import React, { useState } from 'react';
import { AppStore, DEMO_SERVICE_CENTER } from '../core/store';
import { User, ServiceRecord } from '../types';
import { Wrench, Search, ShieldCheck, CheckCircle2, Cpu, ExternalLink, PlusCircle } from 'lucide-react';

interface Props {
    passportIdParam?: string;
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
    onOpenMSTExplorer: (txHash?: string) => void;
}

export const ServicePortalView: React.FC<Props> = ({
    passportIdParam,
    currentUser,
    onNavigate,
    onOpenMSTExplorer
}) => {
    const [targetPassportId, setTargetPassportId] = useState(passportIdParam || 'PP-82941');
    const [serviceType, setServiceType] = useState<ServiceRecord['serviceType']>('BATTERY_REPLACEMENT');
    const [description, setDescription] = useState('Installed genuine OEM Lithium Polymer replacement battery.');
    const [partInput, setPartInput] = useState('Original 66.5Wh OEM Battery');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedRecord, setSubmittedRecord] = useState<ServiceRecord | null>(null);

    const passport = AppStore.getPassportById(targetPassportId.trim().toUpperCase());

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passport) return;

        setIsSubmitting(true);
        const record = await AppStore.addServiceRecord(passport.passportId, {
            serviceType,
            description,
            partsReplaced: [partInput],
            serviceCenterUser: DEMO_SERVICE_CENTER
        });
        setIsSubmitting(false);
        setSubmittedRecord(record);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header Banner */}
            <div className="zayq-glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                        <Wrench size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-white font-sans">Authorized Service Center Console</h1>
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                                MST ServiceRegistry
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">Log verified OEM hardware repair attestations onto Product Passports</p>
                    </div>
                </div>

                <div className="text-right font-mono text-xs text-slate-400">
                    <span className="text-white font-bold block">{DEMO_SERVICE_CENTER.name}</span>
                    <span className="text-[10px] text-cyan-400">{DEMO_SERVICE_CENTER.mstIdentityDid}</span>
                </div>
            </div>

            {/* Passport Search Lookup */}
            <div className="zayq-glass-card rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white font-sans">Lookup Product Passport for Servicing</h3>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter Passport ID (e.g. PP-82941)..."
                        value={targetPassportId}
                        onChange={(e) => setTargetPassportId(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500"
                    />
                </div>

                {passport ? (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={passport.imageUrl} alt={passport.model} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                                <span className="text-[10px] font-mono text-cyan-400 font-bold">{passport.passportId}</span>
                                <h4 className="font-bold text-xs text-white">{passport.model}</h4>
                                <p className="text-[10px] font-mono text-slate-400">Serial: {passport.identifier.serialNumber}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onNavigate('passport-detail', passport.passportId)}
                            className="text-xs text-cyan-400 hover:underline font-mono"
                        >
                            View History →
                        </button>
                    </div>
                ) : (
                    <p className="text-xs text-rose-400 font-mono">No Passport found matching {targetPassportId}</p>
                )}
            </div>

            {/* Service Record Submission Form */}
            {passport && (
                <form onSubmit={handleAddService} className="zayq-glass-card rounded-2xl p-6 space-y-6">
                    <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                        <PlusCircle size={18} className="text-amber-400" />
                        <span>Record Service & OEM Repair Attestation</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Service Type</label>
                            <select
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value as any)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-cyan-500"
                            >
                                <option value="BATTERY_REPLACEMENT">OEM Battery Replacement</option>
                                <option value="DISPLAY_REPAIR">Display / Glass Repair</option>
                                <option value="LOGIC_BOARD">Logic Board Maintenance</option>
                                <option value="GENERAL_MAINTENANCE">General Diagnostics & Cleaning</option>
                                <option value="REFURBISHMENT">Certified Refurbishment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Replaced Parts List</label>
                            <input
                                type="text"
                                required
                                value={partInput}
                                onChange={(e) => setPartInput(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Technical Report</label>
                        <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-sans outline-none focus:border-cyan-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-600 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span>Saving service record…</span>
                        ) : (
                            <>
                                <Wrench size={16} />
                                <span>Add service record to passport</span>
                            </>
                        )}
                    </button>
                </form>
            )}

            {submittedRecord && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                        <CheckCircle2 size={16} />
                        <span>Service record added to passport</span>
                    </div>
                    <p className="text-slate-300">{submittedRecord.mstTxHash ? `MST Testnet transaction: ${submittedRecord.mstTxHash}` : 'Saved in this browser only. No blockchain transaction was submitted.'}</p>
                    <button
                        onClick={() => onNavigate('passport-detail', targetPassportId)}
                        className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-bold"
                    >
                        <span>View Updated Passport History →</span>
                    </button>
                </div>
            )}
        </div>
    );
};
