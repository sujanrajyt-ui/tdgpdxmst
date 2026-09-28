import { ethers } from 'ethers';
import { MSTAnchor } from '../../types';
import { MSTContractBridge, MST_CONTRACT_ADDRESSES, getContract } from './contracts';
import { isWalletAvailable, getWalletState } from './wallet';

export class MSTAnchorService {
    private static anchors: MSTAnchor[] = [
        {
            id: 'ANC-1001',
            eventId: 'EVT-REGISTER-82941',
            passportId: 'PP-82941',
            chain: 'MST_TESTNET',
            contractAddress: MST_CONTRACT_ADDRESSES.ProductPassportRegistry,
            contractName: 'ProductPassportRegistry',
            transactionHash: '0xa49f2b8c91d8e123f4567890abcdef1234567890abcdef1234567890abcdef12',
            blockNumber: 18492001,
            status: 'CONFIRMED',
            createdAt: '2025-03-15T10:14:00Z',
            confirmedAt: '2025-03-15T10:14:04Z',
            payloadHash: '0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a'
        },
        {
            id: 'ANC-1002',
            eventId: 'EVT-VERIFY-82941',
            passportId: 'PP-82941',
            chain: 'MST_TESTNET',
            contractAddress: MST_CONTRACT_ADDRESSES.AttestationRegistry,
            contractName: 'AttestationRegistry',
            transactionHash: '0xb58e1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
            blockNumber: 18492015,
            status: 'CONFIRMED',
            createdAt: '2025-03-16T14:22:00Z',
            confirmedAt: '2025-03-16T14:22:05Z',
            payloadHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
        },
        {
            id: 'ANC-1003',
            eventId: 'EVT-SERVICE-82941',
            passportId: 'PP-82941',
            chain: 'MST_TESTNET',
            contractAddress: MST_CONTRACT_ADDRESSES.ServiceRegistry,
            contractName: 'ServiceRegistry',
            transactionHash: '0xc67f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
            blockNumber: 18492030,
            status: 'CONFIRMED',
            createdAt: '2026-01-10T11:05:00Z',
            confirmedAt: '2026-01-10T11:05:03Z',
            payloadHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e'
        }
    ];

    public static getAnchors(): MSTAnchor[] {
        return [...this.anchors];
    }

    public static getAnchorsForPassport(passportId: string): MSTAnchor[] {
        return this.anchors.filter(a => a.passportId === passportId);
    }

    /**
     * Anchor an event on-chain via the appropriate MST registry contract.
     * If wallet is connected, this sends a real blockchain transaction.
     * Falls back to simulation otherwise.
     */
    public static async anchorEvent(
        passportId: string,
        eventId: string,
        contractName: keyof typeof MST_CONTRACT_ADDRESSES,
        payloadHash: string,
        forceFail: boolean = false
    ): Promise<MSTAnchor> {
        const anchorId = `ANC-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date().toISOString();

        if (forceFail) {
            const failedAnchor: MSTAnchor = {
                id: anchorId,
                eventId,
                passportId,
                chain: 'MST_TESTNET',
                contractAddress: MST_CONTRACT_ADDRESSES[contractName],
                contractName,
                transactionHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                blockNumber: 0,
                status: 'FAILED',
                createdAt: now,
                errorMessage: 'MST Node congestion timeout - Queued for background retry',
                payloadHash
            };
            this.anchors.unshift(failedAnchor);
            return failedAnchor;
        }

        // Attempt real on-chain transaction
        const walletState = getWalletState();
        const useRealChain = isWalletAvailable() && walletState.connected;

        let txHash: string;
        let blockNumber: number;

        if (useRealChain) {
            try {
                const result = await this.executeRealAnchor(passportId, eventId, contractName, payloadHash);
                txHash = result.txHash;
                blockNumber = result.blockNumber;
            } catch (error) {
                console.warn('On-chain anchor failed, falling back to simulation:', error);
                const sim = MSTContractBridge.simulateContractCall(contractName, 'anchorEvent', { passportId, eventId, payloadHash });
                txHash = sim.txHash;
                blockNumber = sim.blockNumber;
            }
        } else {
            // Simulation fallback
            const sim = MSTContractBridge.simulateContractCall(contractName, 'anchorEvent', { passportId, eventId, payloadHash });
            txHash = sim.txHash;
            blockNumber = sim.blockNumber;
        }

        const newAnchor: MSTAnchor = {
            id: anchorId,
            eventId,
            passportId,
            chain: 'MST_TESTNET',
            contractAddress: MST_CONTRACT_ADDRESSES[contractName],
            contractName,
            transactionHash: txHash,
            blockNumber,
            status: 'CONFIRMED',
            createdAt: now,
            confirmedAt: now,
            payloadHash
        };

        this.anchors.unshift(newAnchor);
        return newAnchor;
    }

    /**
     * Execute a real on-chain anchor transaction based on the contract type.
     */
    private static async executeRealAnchor(
        passportId: string,
        eventId: string,
        contractName: keyof typeof MST_CONTRACT_ADDRESSES,
        payloadHash: string
    ): Promise<{ txHash: string; blockNumber: number }> {
        const payloadBytes32 = ethers.id(payloadHash).slice(0, 66) as `0x${string}`;

        switch (contractName) {
            case 'ProductPassportRegistry': {
                const contract = getContract('ProductPassportRegistry');
                const identifierHash = ethers.id(payloadHash).slice(0, 66);
                const tx = await contract.registerPassport(passportId, identifierHash);
                const receipt = await tx.wait();
                return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
            }
            case 'OwnershipRegistry': {
                const contract = getContract('OwnershipRegistry');
                const tx = await contract.registerOwnership(passportId);
                const receipt = await tx.wait();
                return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
            }
            case 'AttestationRegistry': {
                const contract = getContract('AttestationRegistry');
                const tx = await contract.addAttestation(passportId, eventId, payloadBytes32);
                const receipt = await tx.wait();
                return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
            }
            case 'ServiceRegistry': {
                const contract = getContract('ServiceRegistry');
                const tx = await contract.recordService(passportId, eventId, payloadBytes32);
                const receipt = await tx.wait();
                return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
            }
            case 'LifecycleRegistry': {
                const contract = getContract('LifecycleRegistry');
                const tx = await contract.logEvent(passportId, eventId, payloadBytes32);
                const receipt = await tx.wait();
                return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
            }
            default: {
                // For registries without dedicated contracts (Warranty, Marketplace),
                // log to LifecycleRegistry as a general event
                const contract = getContract('LifecycleRegistry');
                const tx = await contract.logEvent(passportId, `${contractName}:${eventId}`, payloadBytes32);
                const receipt = await tx.wait();
                return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
            }
        }
    }

    public static async retryFailedAnchors(): Promise<number> {
        let retriedCount = 0;
        const now = new Date().toISOString();
        for (const anchor of this.anchors) {
            if (anchor.status === 'FAILED' || anchor.status === 'PENDING') {
                try {
                    const result = await this.executeRealAnchor(
                        anchor.passportId,
                        anchor.eventId,
                        anchor.contractName,
                        anchor.payloadHash
                    );
                    anchor.status = 'CONFIRMED';
                    anchor.transactionHash = result.txHash;
                    anchor.blockNumber = result.blockNumber;
                    anchor.confirmedAt = now;
                    anchor.errorMessage = undefined;
                    retriedCount++;
                } catch {
                    // If real chain fails, fall back to simulation
                    const { txHash, blockNumber } = MSTContractBridge.simulateContractCall(
                        anchor.contractName,
                        'retryAnchor',
                        { id: anchor.id }
                    );
                    anchor.status = 'CONFIRMED';
                    anchor.transactionHash = txHash;
                    anchor.blockNumber = blockNumber;
                    anchor.confirmedAt = now;
                    anchor.errorMessage = undefined;
                    retriedCount++;
                }
            }
        }
        return retriedCount;
    }
}
