import { ethers } from 'ethers';
import { getSigner, getProvider, MST_TESTNET_CONFIG } from './wallet';

/** Public MST Testnet deployments, verified to contain bytecode on chain. Vercel
 * environment variables can override these values for a future redeployment. */
export const MST_CONTRACT_ADDRESSES = {
    ProductPassportRegistry: import.meta.env.VITE_MST_PRODUCT_PASSPORT_REGISTRY || '0x38ca8F4d80d5882Ac0D75E6058fa5EF502b48A5C',
    OwnershipRegistry: import.meta.env.VITE_MST_OWNERSHIP_REGISTRY || '0x6aDA1f94033eF88bD44D5125204909A0C809feA8',
    AttestationRegistry: import.meta.env.VITE_MST_ATTESTATION_REGISTRY || '0x47A4c4E56C83Fa226f0Dd5f5327C4EBdDa11e1FC',
    LifecycleRegistry: import.meta.env.VITE_MST_LIFECYCLE_REGISTRY || '0x480d6567d2dd395D8ff4d75e750Fdbd714b8f328',
    ServiceRegistry: import.meta.env.VITE_MST_SERVICE_REGISTRY || '0x745795d9d6657fd9f1cE01b3880458b36ce7b4Ce',
    WarrantyRegistry: '',
    MarketplaceRegistry: '',
};

export const CONTRACT_ABIS: Record<string, string[]> = {
    ProductPassportRegistry: [
        'function registerPassport(string _passportId, bytes32 _identifierHash) external',
        'function getPassport(string _passportId) external view returns (bytes32 identifierHash, address registrant, uint256 registeredAt)',
        'function passportExists(string _passportId) external view returns (bool)',
        'function totalPassports() external view returns (uint256)',
        'event PassportRegistered(string indexed passportId, bytes32 identifierHash, address indexed registrant, uint256 timestamp)',
    ],
    OwnershipRegistry: [
        'function registerOwnership(string _passportId) external',
        'function initiateTransfer(string _passportId, address _buyer) external',
        'function completeTransfer(string _passportId) external',
        'function getOwner(string _passportId) external view returns (address owner, uint256 acquiredAt)',
        'event OwnershipRegistered(string indexed passportId, address indexed owner, uint256 timestamp)',
        'event TransferInitiated(string indexed passportId, address indexed seller, address indexed buyer, uint256 timestamp)',
        'event TransferCompleted(string indexed passportId, address indexed newOwner, uint256 timestamp)',
    ],
    AttestationRegistry: [
        'function addAttestation(string _passportId, string _claim, bytes32 _evidenceHash) external',
        'function getAttestationCount(string _passportId) external view returns (uint256)',
        'function getAttestation(string _passportId, uint256 _index) external view returns (string claim, bytes32 evidenceHash, address issuer, uint256 timestamp)',
        'event AttestationAdded(string indexed passportId, string claim, bytes32 evidenceHash, address indexed issuer, uint256 timestamp)',
    ],
    ServiceRegistry: [
        'function recordService(string _passportId, string _serviceType, bytes32 _documentHash) external',
        'function getServiceCount(string _passportId) external view returns (uint256)',
        'function getServiceRecord(string _passportId, uint256 _index) external view returns (string serviceType, bytes32 documentHash, address serviceCenter, uint256 timestamp)',
        'event ServiceRecorded(string indexed passportId, string serviceType, bytes32 documentHash, address indexed serviceCenter, uint256 timestamp)',
    ],
    LifecycleRegistry: [
        'function logEvent(string _passportId, string _eventType, bytes32 _payloadHash) external',
        'function getEventCount(string _passportId) external view returns (uint256)',
        'function getEvent(string _passportId, uint256 _index) external view returns (string eventType, bytes32 payloadHash, address actor, uint256 timestamp)',
        'event LifecycleEventLogged(string indexed passportId, string eventType, bytes32 payloadHash, address indexed actor, uint256 timestamp)',
    ],
};

export function getContract(contractName: keyof typeof MST_CONTRACT_ADDRESSES, write = false): ethers.Contract {
    // Listing and warranty events are recorded in the general lifecycle registry;
    // this codebase does not include separate marketplace or warranty contracts.
    const registryName = contractName === 'MarketplaceRegistry' || contractName === 'WarrantyRegistry'
        ? 'LifecycleRegistry'
        : contractName;
    const address = MST_CONTRACT_ADDRESSES[registryName];
    const abi = CONTRACT_ABIS[registryName];

    if (!address || !ethers.isAddress(address)) {
        throw new Error(`${registryName} is not configured for MST Testnet.`);
    }
    if (!abi) throw new Error(`No contract interface is available for ${registryName}.`);

    if (write) return new ethers.Contract(address, abi, getSigner());
    try { return new ethers.Contract(address, abi, getProvider()); }
    catch { return new ethers.Contract(address, abi, new ethers.JsonRpcProvider(MST_TESTNET_CONFIG.rpcUrl, MST_TESTNET_CONFIG.chainId)); }
}

export class MSTContractBridge {
    /** Submit a user-approved transaction and only report success after mining. */
    public static async executeContractCall(
        contractName: keyof typeof MST_CONTRACT_ADDRESSES,
        methodName: string,
        params: unknown[]
    ): Promise<{ success: true; txHash: string; blockNumber: number; gasUsed: number }> {
        const contract = new ethers.Contract(
            (contractName === 'MarketplaceRegistry' || contractName === 'WarrantyRegistry'
                ? MST_CONTRACT_ADDRESSES.LifecycleRegistry
                : MST_CONTRACT_ADDRESSES[contractName]),
            CONTRACT_ABIS[contractName === 'MarketplaceRegistry' || contractName === 'WarrantyRegistry'
                ? 'LifecycleRegistry'
                : contractName],
            getSigner()
        );
        const tx = await contract[methodName](...params);
        const receipt = await tx.wait();
        if (!receipt || receipt.status !== 1) throw new Error('The MST transaction did not succeed.');
        return { success: true, txHash: receipt.hash, blockNumber: receipt.blockNumber, gasUsed: Number(receipt.gasUsed) };
    }
}
