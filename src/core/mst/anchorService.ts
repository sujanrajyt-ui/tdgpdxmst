import { ethers } from 'ethers';
import { MSTAnchor } from '../../types';
import { MST_CONTRACT_ADDRESSES, getContract } from './contracts';
import { getWalletState } from './wallet';

export class MSTAnchorService {
    private static anchors: MSTAnchor[] = MSTAnchorService.loadAnchors();

    private static loadAnchors(): MSTAnchor[] {
        try {
            const saved = localStorage.getItem('passport-marketplace-anchors');
            return saved ? JSON.parse(saved) as MSTAnchor[] : [];
        } catch {
            return [];
        }
    }

    private static saveAnchors(): void {
        try {
            localStorage.setItem('passport-marketplace-anchors', JSON.stringify(this.anchors));
        } catch (error) {
            console.warn('Could not save browser activity.', error);
        }
    }

    public static getAnchors(): MSTAnchor[] { return [...this.anchors]; }
    public static getAnchorsForPassport(passportId: string): MSTAnchor[] {
        return this.anchors.filter(anchor => anchor.passportId === passportId);
    }

    private static saveConfirmedAnchor(passportId: string, eventId: string, contractName: MSTAnchor['contractName'], contractAddress: string, txHash: string, blockNumber: number, payloadHash: string): MSTAnchor {
        const timestamp = new Date().toISOString();
        const anchor: MSTAnchor = {
            id: `ANC-${crypto.randomUUID()}`, eventId, passportId, chain: 'MST_TESTNET', contractAddress,
            contractName, transactionHash: txHash, blockNumber, status: 'CONFIRMED', simulated: false,
            createdAt: timestamp, confirmedAt: timestamp, payloadHash,
        };
        this.anchors.unshift(anchor);
        this.saveAnchors();
        return anchor;
    }

    /** Register a passport, its initial owner, and seller claim as real wallet-approved MST transactions. */
    public static async registerPassportAndOwnership(passportId: string, identifierHash: string, onProgress?: (message: string) => void): Promise<{ passportTxHash: string; ownershipTxHash: string; attestationTxHash: string }> {
        const wallet = getWalletState();
        if (!wallet.connected || !wallet.signer || wallet.chainId !== 91562037) {
            throw new Error('Connect BridgeKey to MST Testnet before creating an on-chain passport.');
        }
        if (!ethers.isHexString(identifierHash, 32)) throw new Error('The product identifier hash must be 32 bytes.');
        const passport = getContract('ProductPassportRegistry', true);
        if (await passport.passportExists(passportId)) throw new Error(`Passport ${passportId} is already registered on MST.`);
        onProgress?.('Confirm transaction 1 of 4 in BridgeKey: register the product passport.');
        const passportTx = await passport.registerPassport(passportId, identifierHash);
        const passportReceipt = await passportTx.wait();
        if (!passportReceipt || passportReceipt.status !== 1) throw new Error('MST did not confirm passport registration.');
        this.saveConfirmedAnchor(passportId, 'PASSPORT_REGISTERED', 'ProductPassportRegistry', MST_CONTRACT_ADDRESSES.ProductPassportRegistry, passportReceipt.hash, passportReceipt.blockNumber, identifierHash);

        const ownership = getContract('OwnershipRegistry', true);
        onProgress?.('Passport confirmed. Confirm transaction 2 of 4 in BridgeKey: register initial ownership.');
        const ownershipTx = await ownership.registerOwnership(passportId);
        const ownershipReceipt = await ownershipTx.wait();
        if (!ownershipReceipt || ownershipReceipt.status !== 1) throw new Error('Passport exists on MST, but initial ownership registration was not confirmed. Retry ownership registration before listing.');
        this.saveConfirmedAnchor(passportId, 'OWNERSHIP_REGISTERED', 'OwnershipRegistry', MST_CONTRACT_ADDRESSES.OwnershipRegistry, ownershipReceipt.hash, ownershipReceipt.blockNumber, identifierHash);

        const attestation = getContract('AttestationRegistry', true);
        onProgress?.('Ownership confirmed. Confirm transaction 3 of 4 in BridgeKey: add the seller identity claim.');
        const attestationTx = await attestation.addAttestation(passportId, 'SELLER_REPORTED', identifierHash);
        const attestationReceipt = await attestationTx.wait();
        if (!attestationReceipt || attestationReceipt.status !== 1) throw new Error('Passport and ownership are on MST, but the seller-reported identity claim was not confirmed.');
        this.saveConfirmedAnchor(passportId, 'SELLER_REPORTED', 'AttestationRegistry', MST_CONTRACT_ADDRESSES.AttestationRegistry, attestationReceipt.hash, attestationReceipt.blockNumber, identifierHash);
        return { passportTxHash: passportReceipt.hash, ownershipTxHash: ownershipReceipt.hash, attestationTxHash: attestationReceipt.hash };
    }

    public static async initiateOwnershipTransfer(passportId: string, buyerAddress: string): Promise<MSTAnchor> {
        const wallet = getWalletState();
        if (!wallet.connected || !wallet.signer || wallet.chainId !== 91562037) throw new Error('Connect the seller wallet to MST Testnet first.');
        if (!ethers.isAddress(buyerAddress)) throw new Error('Enter a valid buyer wallet address.');
        const contract = getContract('OwnershipRegistry', true);
        const tx = await contract.initiateTransfer(passportId, ethers.getAddress(buyerAddress));
        const receipt = await tx.wait();
        if (!receipt || receipt.status !== 1) throw new Error('MST did not confirm the ownership transfer request.');
        return this.saveConfirmedAnchor(passportId, 'TRANSFER_INITIATED', 'OwnershipRegistry', MST_CONTRACT_ADDRESSES.OwnershipRegistry, receipt.hash, receipt.blockNumber, ethers.id(ethers.getAddress(buyerAddress).toLowerCase()));
    }

    public static async getPendingOwnershipTransfer(passportId: string): Promise<{ seller: string; buyer: string; txHash: string } | null> {
        const contract = getContract('OwnershipRegistry');
        const initiated = await contract.queryFilter(contract.filters.TransferInitiated(passportId));
        const completed = await contract.queryFilter(contract.filters.TransferCompleted(passportId));
        const latestInitiated = initiated.at(-1);
        const latestCompleted = completed.at(-1);
        if (!latestInitiated || (latestCompleted && (latestCompleted.blockNumber > latestInitiated.blockNumber || (latestCompleted.blockNumber === latestInitiated.blockNumber && latestCompleted.index > latestInitiated.index)))) return null;
        const args = (latestInitiated as ethers.EventLog).args;
        return { seller: String(args.seller), buyer: String(args.buyer), txHash: latestInitiated.transactionHash };
    }

    public static async completeOwnershipTransfer(passportId: string): Promise<MSTAnchor> {
        const wallet = getWalletState();
        if (!wallet.connected || !wallet.signer || wallet.chainId !== 91562037) throw new Error('Connect the buyer wallet to MST Testnet first.');
        const pending = await this.getPendingOwnershipTransfer(passportId);
        if (!pending || pending.buyer.toLowerCase() !== (await wallet.signer.getAddress()).toLowerCase()) throw new Error('This wallet is not the buyer on the pending transfer.');
        const contract = getContract('OwnershipRegistry', true);
        const tx = await contract.completeTransfer(passportId);
        const receipt = await tx.wait();
        if (!receipt || receipt.status !== 1) throw new Error('MST did not confirm the ownership change.');
        return this.saveConfirmedAnchor(passportId, 'TRANSFER_COMPLETED', 'OwnershipRegistry', MST_CONTRACT_ADDRESSES.OwnershipRegistry, receipt.hash, receipt.blockNumber, ethers.id(pending.buyer.toLowerCase()));
    }

    /** Local activity is explicitly LOCAL_ONLY. Connected-wallet errors are never converted into fake receipts. */
    public static async anchorEvent(
        passportId: string,
        eventId: string,
        contractName: keyof typeof MST_CONTRACT_ADDRESSES,
        payloadHash: string,
        _forceFail = false
    ): Promise<MSTAnchor> {
        const wallet = getWalletState();
        const now = new Date().toISOString();

        if (_forceFail) throw new Error('This activity was rejected and was not saved.');

        if (!wallet.connected || !wallet.signer || wallet.chainId !== 91562037) throw new Error('Connect BridgeKey to MST Testnet before recording this event.');

        const payloadBytes32 = ethers.isHexString(payloadHash, 32) ? payloadHash : ethers.id(payloadHash);
        const txResult = await this.executeRealAnchor(passportId, eventId, contractName, payloadBytes32);
        return this.saveConfirmedAnchor(passportId, eventId, contractName, txResult.contractAddress, txResult.txHash, txResult.blockNumber, payloadBytes32);
    }

    private static async executeRealAnchor(
        passportId: string,
        eventId: string,
        contractName: keyof typeof MST_CONTRACT_ADDRESSES,
        payloadHash: string
    ): Promise<{ txHash: string; blockNumber: number; contractAddress: string }> {
        const resolveReceipt = async (tx: ethers.ContractTransactionResponse, address: string) => {
            const receipt = await tx.wait();
            if (!receipt || receipt.status !== 1) throw new Error('MST did not confirm this transaction.');
            return { txHash: receipt.hash, blockNumber: receipt.blockNumber, contractAddress: address };
        };

        if (contractName === 'ProductPassportRegistry') {
            const passportContract = getContract('ProductPassportRegistry', true);
            const alreadyRegistered = await passportContract.passportExists(passportId);
            if (alreadyRegistered) throw new Error('This passport ID is already registered on MST.');
            const tx = await passportContract.registerPassport(passportId, payloadHash);
            return resolveReceipt(tx, MST_CONTRACT_ADDRESSES.ProductPassportRegistry);
        }

        if (contractName === 'OwnershipRegistry') {
            throw new Error('Ownership transfer needs a seller-initiated transfer and buyer wallet confirmation. This action cannot be safely submitted through the current one-step handover screen.');
        }

        const registry = contractName === 'MarketplaceRegistry' || contractName === 'WarrantyRegistry'
            ? 'LifecycleRegistry'
            : contractName;
        const contract = getContract(registry, true);
        let tx: ethers.ContractTransactionResponse;
        if (registry === 'AttestationRegistry') tx = await contract.addAttestation(passportId, eventId, payloadHash);
        else if (registry === 'ServiceRegistry') tx = await contract.recordService(passportId, eventId, payloadHash);
        else tx = await contract.logEvent(passportId, `${contractName}:${eventId}`, payloadHash);
        return resolveReceipt(tx, MST_CONTRACT_ADDRESSES[registry]);
    }

    /** Demo-local entries are never replayed as transactions. */
    public static async retryFailedAnchors(): Promise<number> {
        return 0;
    }
}
