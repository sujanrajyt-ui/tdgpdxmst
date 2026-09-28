import React, { useState } from 'react';
import { X, Cpu, RefreshCw, Layers, ShieldCheck, FileCode } from 'lucide-react';
import { MSTAnchorService } from '../core/mst/anchorService';
import { MST_CONTRACT_ADDRESSES } from '../core/mst/contracts';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedTxHash?: string;
    initialTxHash?: string;
}

export const MSTExplorerModal: React.FC<Props> = ({ isOpen, onClose, selectedTxHash, initialTxHash }) => {
    const activeTxHash = selectedTxHash || initialTxHash;
    const [activeTab, setActiveTab] = useState<'anchors' | 'contracts' | 'wasmify'>('anchors');
    const [retrying, setRetrying] = useState(false);
    const [retryMessage, setRetryMessage] = useState('');

    if (!isOpen) return null;

    const anchors = MSTAnchorService.getAnchors();

    const handleRetry = async () => {
        setRetrying(true);
        setRetryMessage('');
        const count = await MSTAnchorService.retryFailedAnchors();
        setRetrying(false);
        setRetryMessage(`Successfully processed ${count} pending/retried anchors!`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D1A12]/40 backdrop-blur-md">
            <div className="bg-[#FAF8F5] border border-[#E5DFD9] rounded-2xl max-w-4xl w-full p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD9]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#3D1A12] flex items-center justify-center text-[#F7F4F2] shadow-md">
                            <Cpu size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-[#3D1A12] font-display">MST Blockchain Explorer</h2>
                                <span className="bg-[#3D1A12]/10 text-[#3D1A12] border border-[#3D1A12]/20 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                                    ChainID 4545 (MST Testnet)
                                </span>
                            </div>
                            <p className="text-xs text-[#8C6D58] font-mono">Live EVM Contracts & Anchor Telemetry</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-[#8C6D58] hover:text-[#3D1A12] p-1.5 rounded-lg hover:bg-[#E5DFD9]/50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Selection */}
                <div className="flex items-center gap-2 mt-4 pb-2 border-b border-[#E5DFD9] text-xs font-mono">
                    <button
                        onClick={() => setActiveTab('anchors')}
                        className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${activeTab === 'anchors' ? 'bg-[#3D1A12] text-[#F7F4F2] font-extrabold' : 'text-[#8C6D58] hover:bg-[#E5DFD9]/40'
                            }`}
                    >
                        <Layers size={14} />
                        <span>Anchored Events ({anchors.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('contracts')}
                        className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${activeTab === 'contracts' ? 'bg-[#3D1A12] text-[#F7F4F2] font-extrabold' : 'text-[#8C6D58] hover:bg-[#E5DFD9]/40'
                            }`}
                    >
                        <FileCode size={14} />
                        <span>MST Smart Contracts</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('wasmify')}
                        className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${activeTab === 'wasmify' ? 'bg-[#3D1A12] text-[#F7F4F2] font-extrabold' : 'text-[#8C6D58] hover:bg-[#E5DFD9]/40'
                            }`}
                    >
                        <ShieldCheck size={14} />
                        <span>WASMify Bridge Proofs</span>
                    </button>

                    <button
                        onClick={handleRetry}
                        disabled={retrying}
                        className="ml-auto text-xs bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#3D1A12] border border-[#E5DFD9] px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-sm"
                    >
                        <RefreshCw size={13} className={retrying ? 'animate-spin' : ''} />
                        <span>Retry Pending Queue</span>
                    </button>
                </div>

                {retryMessage && (
                    <div className="mt-2 text-xs bg-[#3D1A12]/10 border border-[#3D1A12]/20 text-[#3D1A12] px-3 py-1.5 rounded-lg font-mono">
                        {retryMessage}
                    </div>
                )}

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3 font-mono text-xs">
                    {activeTab === 'anchors' && (
                        <div className="space-y-3">
                            {anchors.map((anc) => (
                                <div
                                    key={anc.id}
                                    className={`p-4 rounded-xl border transition-all ${activeTxHash && anc.transactionHash.includes(activeTxHash)
                                        ? 'bg-[#FFFFFF] border-[#3D1A12] shadow-md ring-2 ring-[#3D1A12]/20'
                                        : 'bg-[#FFFFFF] border-[#E5DFD9] hover:border-[#8C6D58]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${anc.status === 'CONFIRMED' ? 'bg-[#3D1A12]/10 text-[#3D1A12] border border-[#3D1A12]/20' : 'bg-rose-100 text-rose-800 border border-rose-200'
                                                }`}>
                                                {anc.status}
                                            </span>
                                            <span className="text-[#1A1A1A] font-bold">{anc.contractName}</span>
                                            <span className="text-[#8C6D58] text-[10px]">Passport: {anc.passportId}</span>
                                        </div>
                                        <span className="text-[#8C6D58] text-[10px]">
                                            Block #{anc.blockNumber}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-[#5A4D44] space-y-1">
                                        <div className="flex items-center gap-1 text-[11px] truncate">
                                            <span className="text-[#8C6D58]">Tx Hash:</span>
                                            <span className="text-[#3D1A12] font-bold truncate">{anc.transactionHash}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] truncate">
                                            <span className="text-[#8C6D58]">Contract:</span>
                                            <span className="text-[#8C6D58] truncate">{anc.contractAddress}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] truncate">
                                            <span className="text-[#8C6D58]">Payload Hash:</span>
                                            <span className="text-[#8C6D58] truncate">{anc.payloadHash}</span>
                                        </div>
                                    </div>

                                    {anc.errorMessage && (
                                        <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px]">
                                            {anc.errorMessage}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'contracts' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                            {Object.entries(MST_CONTRACT_ADDRESSES).map(([name, addr]) => (
                                <div key={name} className="p-4 bg-[#FFFFFF] border border-[#E5DFD9] rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[#3D1A12] text-sm">{name}</span>
                                        <span className="text-[10px] bg-[#3D1A12]/10 text-[#3D1A12] border border-[#3D1A12]/20 px-2 py-0.5 rounded font-mono font-bold">
                                            Solidity / EVM
                                        </span>
                                    </div>
                                    <p className="font-mono text-xs text-[#8C6D58] break-all">{addr}</p>
                                    <p className="text-xs text-[#5A4D44]">
                                        Deployed on MST Testnet (ChainID 4545). Enforces state transitions & attestations.
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'wasmify' && (
                        <div className="space-y-3 font-sans">
                            <div className="p-4 bg-[#3D1A12]/10 border border-[#3D1A12]/20 rounded-xl text-xs text-[#3D1A12]">
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    <ShieldCheck size={16} />
                                    <span>MST WASMify Off-Chain Execution Container</span>
                                </div>
                                Heavy payload cryptographic proofs (document invoices, IMEI validation algorithms) run inside WASM bytecode containers. Execution proofs are verified on MST L1.
                            </div>

                            <div className="p-3.5 bg-[#FFFFFF] border border-[#E5DFD9] rounded-xl space-y-2 font-mono text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#3D1A12] font-bold">Proof #WASM-902184</span>
                                    <span className="text-[#3D1A12] font-bold">PASSED (12ms)</span>
                                </div>
                                <p className="text-[#8C6D58]">Module: 0x9a8f12c4b8e90a123f4567890abcdef1234567890abcdef1234567890abcdef1</p>
                                <p className="text-[#1A1A1A]">Computation: SERIAL_INTEGRITY_CHECK</p>
                                <p className="text-[#8C6D58] text-[10px]">Result: VERIFIED_OFFCHAIN_WASM_PROOF_PASSED</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
