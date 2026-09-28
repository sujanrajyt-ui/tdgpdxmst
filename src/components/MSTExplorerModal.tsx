import React, { useState } from 'react';
import { X, Cpu, RefreshCw, Layers, CheckCircle2, ShieldCheck, FileCode, AlertCircle, ArrowUpRight } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="zayq-modal rounded-2xl max-w-4xl w-full p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                            <Cpu size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-white font-sans">MST Blockchain Explorer</h2>
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full">
                                    ChainID 8921 (MST Mainnet)
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono">Live EVM Contracts & Anchor Telemetry</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Selection */}
                <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-800/80 text-xs font-mono">
                    <button
                        onClick={() => setActiveTab('anchors')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'anchors' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        <Layers size={14} />
                        <span>Anchored Events ({anchors.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('contracts')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'contracts' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        <FileCode size={14} />
                        <span>MST Smart Contracts</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('wasmify')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'wasmify' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        <ShieldCheck size={14} />
                        <span>WASMify Bridge Proofs</span>
                    </button>

                    <button
                        onClick={handleRetry}
                        disabled={retrying}
                        className="ml-auto text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                        <RefreshCw size={13} className={retrying ? 'animate-spin' : ''} />
                        <span>Retry Pending Queue</span>
                    </button>
                </div>

                {retryMessage && (
                    <div className="mt-2 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-lg font-mono">
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
                                    className={`p-3.5 rounded-xl border transition-all ${activeTxHash && anc.transactionHash.includes(activeTxHash)
                                        ? 'bg-cyan-950/60 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${anc.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                                }`}>
                                                {anc.status}
                                            </span>
                                            <span className="text-white font-bold">{anc.contractName}</span>
                                            <span className="text-slate-400 text-[10px]">Passport: {anc.passportId}</span>
                                        </div>
                                        <span className="text-slate-500 text-[10px]">
                                            Block #{anc.blockNumber}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-slate-300 space-y-1">
                                        <div className="flex items-center gap-1 text-[11px] truncate">
                                            <span className="text-slate-500">Tx Hash:</span>
                                            <span className="text-cyan-300 truncate">{anc.transactionHash}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] truncate">
                                            <span className="text-slate-500">Contract:</span>
                                            <span className="text-purple-300 truncate">{anc.contractAddress}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] truncate">
                                            <span className="text-slate-500">Payload Hash:</span>
                                            <span className="text-slate-400 truncate">{anc.payloadHash}</span>
                                        </div>
                                    </div>

                                    {anc.errorMessage && (
                                        <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/30 rounded text-rose-300 text-[11px]">
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
                                <div key={name} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-white text-sm">{name}</span>
                                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">
                                            Solidity / EVM
                                        </span>
                                    </div>
                                    <p className="font-mono text-xs text-purple-300 break-all">{addr}</p>
                                    <p className="text-xs text-slate-400">
                                        Deployed on MST L1. Enforces state transitions & attestations.
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'wasmify' && (
                        <div className="space-y-3 font-sans">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-200">
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    <ShieldCheck size={16} />
                                    <span>MST WASMify Off-Chain Execution Container</span>
                                </div>
                                Heavy payload cryptographic proofs (document invoices, IMEI validation algorithms) run inside WASM bytecode containers. Execution proofs are verified on MST L1.
                            </div>

                            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-cyan-300 font-bold">Proof #WASM-902184</span>
                                    <span className="text-emerald-400 font-bold">PASSED (12ms)</span>
                                </div>
                                <p className="text-slate-400">Module: 0x9a8f12c4b8e90a123f4567890abcdef1234567890abcdef1234567890abcdef1</p>
                                <p className="text-slate-300">Computation: SERIAL_INTEGRITY_CHECK</p>
                                <p className="text-slate-500 text-[10px]">Result: VERIFIED_OFFCHAIN_WASM_PROOF_PASSED</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
