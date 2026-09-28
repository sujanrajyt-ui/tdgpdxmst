import { ethers } from 'ethers';

// MST Testnet Configuration
const MST_TESTNET_CONFIG = {
    chainId: 4545,
    chainIdHex: '0x11C1',
    chainName: 'MST Testnet',
    rpcUrl: 'https://testnetrpc.mstblockchain.com',
    currencyName: 'tMSTC',
    currencySymbol: 'tMSTC',
    currencyDecimals: 18,
    blockExplorerUrl: 'https://testnet.mstscan.com',
};

export interface WalletState {
    connected: boolean;
    address: string | null;
    chainId: number | null;
    signer: ethers.Signer | null;
    provider: ethers.BrowserProvider | null;
}

let walletState: WalletState = {
    connected: false,
    address: null,
    chainId: null,
    signer: null,
    provider: null,
};

/**
 * Check if Bridgekey (or any EIP-1193 wallet) is available.
 */
export function isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
}

/**
 * Switch or add the MST Testnet chain to the wallet.
 */
export async function switchToMSTTestnet(): Promise<void> {
    if (!isWalletAvailable()) throw new Error('No wallet extension detected');

    const ethereum = (window as any).ethereum;

    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MST_TESTNET_CONFIG.chainIdHex }],
        });
    } catch (switchError: any) {
        // Chain not added yet — add it
        if (switchError.code === 4902) {
            await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: MST_TESTNET_CONFIG.chainIdHex,
                    chainName: MST_TESTNET_CONFIG.chainName,
                    nativeCurrency: {
                        name: MST_TESTNET_CONFIG.currencyName,
                        symbol: MST_TESTNET_CONFIG.currencySymbol,
                        decimals: MST_TESTNET_CONFIG.currencyDecimals,
                    },
                    rpcUrls: [MST_TESTNET_CONFIG.rpcUrl],
                    blockExplorerUrls: [MST_TESTNET_CONFIG.blockExplorerUrl],
                }],
            });
        } else {
            throw switchError;
        }
    }
}

/**
 * Connect to the Bridgekey wallet, ensure MST Testnet, and return wallet state.
 */
export async function connectWallet(): Promise<WalletState> {
    if (!isWalletAvailable()) {
        throw new Error(
            'Bridgekey wallet not found. Install it from: https://chromewebstore.google.com/detail/bridgekey/bfjojdcfenehemjgjlepdjomkpginlkg'
        );
    }

    const ethereum = (window as any).ethereum;

    // Request account access
    const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) throw new Error('No accounts found');

    // Switch to MST Testnet
    await switchToMSTTestnet();

    // Create ethers provider and signer
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    walletState = {
        connected: true,
        address: accounts[0],
        chainId: Number(network.chainId),
        signer,
        provider,
    };

    // Listen for account / chain changes
    ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
            disconnectWallet();
        } else {
            walletState.address = newAccounts[0];
        }
    });

    ethereum.on('chainChanged', () => {
        // Reload to re-sync state
        window.location.reload();
    });

    return walletState;
}

/**
 * Disconnect wallet (reset state).
 */
export function disconnectWallet(): void {
    walletState = {
        connected: false,
        address: null,
        chainId: null,
        signer: null,
        provider: null,
    };
}

/**
 * Get current wallet state.
 */
export function getWalletState(): WalletState {
    return { ...walletState };
}

/**
 * Get signer — throws if not connected.
 */
export function getSigner(): ethers.Signer {
    if (!walletState.connected || !walletState.signer) {
        throw new Error('Wallet not connected. Call connectWallet() first.');
    }
    return walletState.signer;
}

/**
 * Get provider — throws if not connected.
 */
export function getProvider(): ethers.BrowserProvider {
    if (!walletState.connected || !walletState.provider) {
        throw new Error('Wallet not connected. Call connectWallet() first.');
    }
    return walletState.provider;
}

export async function connectBridgekeyWallet(): Promise<{ success: boolean; account?: string; error?: string }> {
    try {
        const state = await connectWallet();
        return { success: true, account: state.address || undefined };
    } catch (e: any) {
        return { success: false, error: e.message || 'Failed to connect wallet' };
    }
}

export function getMSTNetworkDetails() {
    return MST_TESTNET_CONFIG;
}

export { MST_TESTNET_CONFIG };

