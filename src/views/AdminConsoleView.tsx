import React, { useState } from 'react';
import { AppStore } from '../core/store';
import { User, ProductPassport } from '../types';
import { MSTAnchorService } from '../core/mst/anchorService';
import { Shield, AlertTriangle, RefreshCw, CheckCircle2, FileText, Cpu, AlertOctagon } from 'lucide-react';

interface Props {
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
    onOpenMSTExplorer: () => void;
}

export const AdminConsoleView: React.FC<Props> = ({ currentUser, onNavigate, onOpenMSTExplorer }) => {
    const [retrying, setRetrying] = useState(false);
    const [retryMsg, setRetryMsg] = useState('');

    const passports = AppStore.getPassports();
    const anchors = MSTAnchorService.getAnchors();
    const failedAnchors = anchors.filter(a => a.status === 'FAILED' || a.status === 'PENDING');
    const flaggedPassports = passports.filter(p => p.riskLevel === 'HIGH_RISK' || p.currentStatus === 'STOLEN');

    const handleRetryAll = async () => {
        setRetrying(true);
        setRetryMsg('');
        const count = await MSTAnchorService.retryFailedAnchors();
        setRetrying(false);
        setRetryMsg(`Retried and confirmed ${count} anchor transactions on MST L1!`);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="zayq-glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                        <Shield size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-white font-sans">Admin Verification & Telemetry Console</h1>
                            <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                                Platform Root
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">Review manual claims, theft disputes, and MST anchor queues</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onOpenMSTExplorer}
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-mono"
                    >
                        <Cpu size={14} />
                        <span>Open Explorer</span>
                    </button>
                </div>
            </div>

            {/* MST Anchor Queue Telemetry Box */}
            <div className="zayq-glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu size={18} className="text-cyan-400" />
                        <h3 className="font-bold text-sm text-white font-sans">MST Transaction Anchor Retry Queue</h3>
                    </div>
                    <button
                        onClick={handleRetryAll}
                        disabled={retrying}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-mono"
                    >
                        <RefreshCw size={13} className={retrying ? 'animate-spin' : ''} />
                        <span>Retry Failed Queue ({failedAnchors.length})</span>
                    </button>
                </div>

                {retryMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono">
                        {retryMsg}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Total Anchors Logged</span>
                        <span className="text-white font-bold text-lg">{anchors.length}</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Confirmed on MST</span>
                        <span className="text-emerald-400 font-bold text-lg">{anchors.filter(a => a.status === 'CONFIRMED').length}</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Pending / Retry Queue</span>
                        <span className="text-rose-400 font-bold text-lg">{failedAnchors.length}</span>
                    </div>
                </div>
            </div>

            {/* Flagged & High Risk Passports */}
            <div className="space-y-4">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                    <AlertOctagon size={18} className="text-rose-400" />
                    <span>Flagged Passports & Active Disputes ({flaggedPassports.length})</span>
                </h3>

                {flaggedPassports.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        Zero high risk anomalies or unhandled theft disputes present.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {flaggedPassports.map((p) => (
                            <div key={p.passportId} className="bg-slate-900 border border-rose-500/40 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-white font-sans">{p.model}</span>
                                        <span className="text-xs font-mono text-cyan-400">{p.passportId}</span>
                                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-mono font-bold">
                                            {p.currentStatus}
                                        </span>
                                    </div>
                                    <p className="text-xs text-rose-300 font-mono mt-1">
                                        Risk Score: {p.riskScore}/100 • Signals: {p.riskSignals.join(' | ')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onNavigate('stolen-dispute', p.passportId)}
                                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg font-mono transition-colors"
                                >
                                    Manage Dispute
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
