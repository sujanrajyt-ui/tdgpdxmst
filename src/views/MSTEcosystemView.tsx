import React, { useState } from 'react';
import { Cpu, Server, ShieldCheck, Code, ArrowUpRight, Copy, Check, Terminal, ExternalLink, Activity, Layers, Lock, Coins, RefreshCw } from 'lucide-react';
import { MST_CONTRACT_ADDRESSES } from '../core/mst/contracts';
import { MSTAnchorService } from '../core/mst/anchorService';
import { connectBridgekeyWallet, getMSTNetworkDetails } from '../core/mst/wallet';

interface Props {
    onNavigate: (view: string, param?: string) => void;
    onOpenExplorer: () => void;
}

export const MSTEcosystemView: React.FC<Props> = ({ onNavigate, onOpenExplorer }) => {
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<'ts' | 'sol' | 'python'>('ts');
    const [walletConnecting, setWalletConnecting] = useState(false);
    const [walletAccount, setWalletAccount] = useState<string | null>(null);
    const networkDetails = getMSTNetworkDetails();
    const anchors = MSTAnchorService.getAnchors();

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleConnectWallet = async () => {
        setWalletConnecting(true);
        const res = await connectBridgekeyWallet();
        setWalletConnecting(false);
        if (res.success && res.account) {
            setWalletAccount(res.account);
        }
    };

    const codeSnippets = {
        ts: `import { ethers } from 'ethers';
import { ProductPassportSDK } from '@mst/passport-sdk';

// Initialize MST Provider on ChainID 4545
const provider = new ethers.JsonRpcProvider('https://rpc.masterstroke.academy');
const sdk = new ProductPassportSDK({
  registryAddress: '${MST_CONTRACT_ADDRESSES.ProductPassportRegistry}',
  provider,
});

// Verify Passport On-Chain History
const passport = await sdk.verifyPassport('PP-82941');
console.log('Verification Tier:', passport.verificationLevel);
console.log('Anchor Tx Hash:', passport.transactionHash);`,
        sol: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IProductPassportRegistry {
    function registerPassport(
        string calldata passportId,
        bytes32 serialHash,
        string calldata brand,
        string calldata model
    ) external returns (bool);

    function verifyOwnership(string calldata passportId, address owner) external view returns (bool);
}

contract PassportConsumer {
    IProductPassportRegistry public registry = 
        IProductPassportRegistry(${MST_CONTRACT_ADDRESSES.ProductPassportRegistry});
}`,
        python: `import requests
from web3 import Web3

# Connect to MST Testnet RPC
w3 = Web3(Web3.HTTPProvider('https://rpc.masterstroke.academy'))
print("MST Block Height:", w3.eth.block_number)

contract_address = "${MST_CONTRACT_ADDRESSES.ProductPassportRegistry}"
# Read Passport State
print("Registry Connected:", w3.is_address(contract_address))`
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
            {/* Ecosystem Header */}
            <div className="zayq-card rounded-3xl p-8 relative overflow-hidden shadow-md">
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-3xl">
                        <div className="zayq-badge">
                            <Cpu size={14} />
                            <span>MST Blockchain Ecosystem • ChainID 4545</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-[#3D1A12] tracking-tight font-display leading-tight">
                            The Masterstroke Trust Protocol
                        </h1>
                        <p className="text-sm text-[#5A4D44] font-sans leading-relaxed">
                            A high-throughput EVM-compatible Layer 1 blockchain engineered specifically for persistent asset identity, decentralized attestations, and cryptographic escrow settlement.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <button
                            onClick={handleConnectWallet}
                            disabled={walletConnecting}
                            className="zayq-btn-primary py-3.5"
                        >
                            <Coins size={16} />
                            <span>{walletAccount ? `${walletAccount.slice(0, 6)}...${walletAccount.slice(-4)}` : 'Connect Bridgekey'}</span>
                        </button>
                        <button
                            onClick={onOpenExplorer}
                            className="zayq-btn-ghost py-3.5"
                        >
                            <ExternalLink size={16} />
                            <span>Open Live Explorer</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Network Telemetry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="zayq-card rounded-2xl p-6 space-y-2 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-[#8C6D58] uppercase tracking-zayq">
                        <Activity size={14} className="text-[#3D1A12]" />
                        <span>Chain ID</span>
                    </div>
                    <p className="text-3xl font-black text-[#3D1A12] font-display">4545 (0x11C1)</p>
                    <p className="text-[10px] text-[#8C6D58] font-mono">MST Testnet L1</p>
                </div>

                <div className="zayq-card rounded-2xl p-6 space-y-2 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-[#8C6D58] uppercase tracking-zayq">
                        <Server size={14} className="text-[#3D1A12]" />
                        <span>RPC Endpoint</span>
                    </div>
                    <p className="text-xs font-mono font-extrabold text-[#3D1A12] truncate px-2">rpc.masterstroke.academy</p>
                    <p className="text-[10px] text-[#8C6D58] font-mono">EVM JSON-RPC v2.0</p>
                </div>

                <div className="zayq-card rounded-2xl p-6 space-y-2 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-[#8C6D58] uppercase tracking-zayq">
                        <Layers size={14} className="text-[#3D1A12]" />
                        <span>Anchored Passports</span>
                    </div>
                    <p className="text-3xl font-black text-[#3D1A12] font-display">{anchors.length + 142}</p>
                    <p className="text-[10px] text-[#8C6D58] font-mono">On-Chain State Proofs</p>
                </div>

                <div className="zayq-card rounded-2xl p-6 space-y-2 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-[#8C6D58] uppercase tracking-zayq">
                        <Coins size={14} className="text-[#3D1A12]" />
                        <span>Native Gas Token</span>
                    </div>
                    <p className="text-3xl font-black text-[#3D1A12] font-display">$MSTC</p>
                    <p className="text-[10px] text-[#8C6D58] font-mono">Zero-Fee Testnet Faucet</p>
                </div>
            </div>

            {/* Smart Contract Directory */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-mono font-black text-[#3D1A12] uppercase tracking-zayq">Deployed Contracts</span>
                        <h2 className="text-2xl font-black text-[#3D1A12] font-display">Core EVM Infrastructure Contracts</h2>
                    </div>
                    <a
                        href="https://faucet.masterstroke.academy"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono font-bold text-[#3D1A12] hover:text-[#8C6D58] flex items-center gap-1 hover:underline"
                    >
                        <span>Request Testnet $MSTC Faucet Tokens</span>
                        <ArrowUpRight size={14} />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(MST_CONTRACT_ADDRESSES).map(([name, addr]) => (
                        <div key={name} className="zayq-card rounded-2xl p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-extrabold text-[#3D1A12] text-base font-display">{name}</span>
                                <span className="zayq-badge">Solidity v0.8.20</span>
                            </div>
                            <div className="flex items-center justify-between bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DFD9]">
                                <span className="font-mono text-xs text-[#3D1A12] truncate max-w-[280px] sm:max-w-xs">{addr}</span>
                                <button
                                    onClick={() => handleCopy(addr, name)}
                                    className="p-1.5 text-[#8C6D58] hover:text-[#3D1A12] transition-colors"
                                    title="Copy Address"
                                >
                                    {copiedIndex === name ? <Check size={16} className="text-emerald-700" /> : <Copy size={16} />}
                                </button>
                            </div>
                            <p className="text-xs text-[#5A4D44] font-sans leading-relaxed">
                                {name === 'ProductPassportRegistry' && 'Main registry mapping serial hashes to immutable Passport IDs and verification tiers.'}
                                {name === 'OwnershipRegistry' && 'Escrow smart contract locking MST tokens until handover is cryptographically verified.'}
                                {name === 'AttestationRegistry' && 'Stores multi-party claims from OEM manufacturers, certified technicians, and users.'}
                                {name === 'ServiceRegistry' && 'Records repairs, maintenance events, component swaps, and service timestamps.'}
                                {name === 'LifecycleRegistry' && 'Tracks product status transitions (Active, Stolen, Recalled, Scrapped) with admin controls.'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Developer SDK Code Playground */}
            <div className="zayq-card rounded-3xl p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5DFD9] pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Code size={20} className="text-[#3D1A12]" />
                            <h3 className="text-xl font-bold text-[#3D1A12] font-display">Developer SDK & Integration</h3>
                        </div>
                        <p className="text-xs text-[#8C6D58] font-mono">Build on Product Passport using TypeScript, Solidity, or Python</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5DFD9]">
                        {(['ts', 'sol', 'python'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setSelectedLanguage(lang)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${selectedLanguage === lang
                                    ? 'bg-[#3D1A12] text-[#F7F4F2] shadow-sm'
                                    : 'text-[#8C6D58] hover:text-[#3D1A12]'
                                    }`}
                            >
                                {lang === 'ts' ? 'TypeScript' : lang === 'sol' ? 'Solidity Interface' : 'Python Web3'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative bg-[#1A1A1A] text-[#FAF8F5] p-6 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner border border-[#3D1A12]">
                    <button
                        onClick={() => handleCopy(codeSnippets[selectedLanguage], 'code')}
                        className="absolute top-4 right-4 p-2 bg-[#3D1A12] hover:bg-[#26100B] text-[#F7F4F2] rounded-lg transition-all flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
                    >
                        {copiedIndex === 'code' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedIndex === 'code' ? 'Copied' : 'Copy Code'}</span>
                    </button>
                    <pre className="leading-relaxed"><code>{codeSnippets[selectedLanguage]}</code></pre>
                </div>
            </div>
        </div>
    );
};
