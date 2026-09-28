import React, { useState } from 'react';
import { AppStore } from '../core/store';
import { User, DisputeRecord } from '../types';
import { AlertOctagon, ShieldAlert, CheckCircle2, FileText, Lock, ExternalLink } from 'lucide-react';

interface Props {
    passportIdParam?: string;
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
    onOpenMSTExplorer: (txHash?: string) => void;
}

export const StolenDisputeView: React.FC<Props> = ({
    passportIdParam,
    currentUser,
    onNavigate,
    onOpenMSTExplorer
}) => {
    const [passportId, setPassportId] = useState(passportIdParam || 'PP-82941');
    const [reason, setReason] = useState<DisputeRecord['reason']>('STOLEN_REPORT');
    const [description, setDescription] = useState('Device stolen from vehicle. FIR police report filed with serial match.');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedDispute, setSubmittedDispute] = useState<DisputeRecord | null>(null);

    const passport = AppStore.getPassportById(passportId.trim().toUpperCase());

    const handleReportStolen = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passport) return;

        setIsSubmitting(true);
        const dispute = await AppStore.reportStolen(passport.passportId, currentUser, reason, description);
        setIsSubmitting(false);
        setSubmittedDispute(dispute);
    };

    const handleResolve = async (disputeId: string, resType: 'RECOVERED' | 'REJECTED') => {
        await AppStore.resolveDispute(disputeId, passportId, resType);
        onNavigate('passport-detail', passportId);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                        <AlertOctagon size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-white font-sans">Stolen Device & Dispute Portal</h1>
                            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-mono">
                                MST Flagging Engine
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">Report stolen products, flag fraudulent clones, and manage recovery</p>
                    </div>
                </div>
            </div>

            {/* Target Passport Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white font-sans">Select Passport to Report / Dispute</h3>
                <input
                    type="text"
                    value={passportId}
                    onChange={(e) => setPassportId(e.target.value)}
                    placeholder="Enter Passport ID (e.g. PP-82941)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono outline-none focus:border-rose-500"
                />

                {passport ? (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={passport.imageUrl} alt={passport.model} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                                <span className="text-[10px] font-mono text-cyan-400 font-bold">{passport.passportId}</span>
                                <h4 className="font-bold text-xs text-white">{passport.model}</h4>
                                <p className="text-[10px] font-mono text-slate-400">Current Status: {passport.currentStatus}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-rose-400 font-mono">Passport {passportId} not found.</p>
                )}
            </div>

            {passport && (
                <form onSubmit={handleReportStolen} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                        <ShieldAlert size={18} className="text-rose-400" />
                        <span>File Evidence-Backed Theft Report</span>
                    </h3>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Dispute Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-rose-500"
                        >
                            <option value="STOLEN_REPORT">Stolen / Theft Report</option>
                            <option value="SERIAL_CLONE">Serial Number Cloning Attempt</option>
                            <option value="FRAUDULENT_LISTING">Fraudulent Resale Listing</option>
                            <option value="SERVICE_DISPUTE">Disputed Service Claim</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Evidence & Police FIR Reference</label>
                        <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-sans outline-none focus:border-rose-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || passport.currentStatus === 'STOLEN'}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span>Flagging Passport & Anchoring Stolen Status on MST...</span>
                        ) : passport.currentStatus === 'STOLEN' ? (
                            <span>Passport Currently Flagged as STOLEN</span>
                        ) : (
                            <>
                                <AlertOctagon size={16} />
                                <span>Flag Passport STOLEN & Anchor on MST</span>
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Existing Disputes on this Passport */}
            {passport && passport.disputes.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white font-sans">Active Disputes & Recovery Actions</h3>
                    {passport.disputes.map((d) => (
                        <div key={d.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-rose-400 font-mono">{d.reason}</span>
                                <span className="text-slate-500 font-mono">{new Date(d.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-300">{d.description}</p>
                            <div className="flex gap-2 pt-2 border-t border-slate-800">
                                <button
                                    onClick={() => handleResolve(d.id, 'RECOVERED')}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors"
                                >
                                    Mark RECOVERED (Police Verified)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
