import React, { useState } from 'react';
import { AppStore } from '../core/store';
import { User, ProductCategory } from '../types';
import { MSTAnchorService } from '../core/mst/anchorService';
import { Shield, RefreshCw, Cpu, AlertOctagon, Plus, Trash2, CheckCircle2, Package, Sparkles } from 'lucide-react';

interface Props {
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
    onOpenMSTExplorer: () => void;
}

export const AdminConsoleView: React.FC<Props> = ({ currentUser, onNavigate, onOpenMSTExplorer }) => {
    const [retrying, setRetrying] = useState(false);
    const [retryMsg, setRetryMsg] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    // Form State
    const [category, setCategory] = useState<ProductCategory>('LAPTOP');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [releaseYear, setReleaseYear] = useState(2024);
    const [serialNumber, setSerialNumber] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [createMsg, setCreateMsg] = useState('');

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

    const handleClearStorage = () => {
        if (confirm('Are you sure you want to reset all stored passports & listings to initial defaults?')) {
            AppStore.clearStorage();
            window.location.reload();
        }
    };

    const handleCreatePassport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand || !model || !serialNumber) {
            setCreateMsg('Please fill in Brand, Model, and Serial/IMEI.');
            return;
        }

        setCreating(true);
        setCreateMsg('');

        try {
            const res = await AppStore.createPassport({
                category,
                brand,
                model,
                releaseYear: Number(releaseYear),
                serialNumber,
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                currentUser
            });

            setCreating(false);
            setCreateMsg(`Passport ${res.passport.passportId} created & anchored on MST Testnet (Tx: ${res.anchorTx.slice(0, 10)}...)!`);
            setTimeout(() => {
                setShowCreateModal(false);
                onNavigate('passport-detail', res.passport.passportId);
            }, 1500);
        } catch (err: any) {
            setCreating(false);
            setCreateMsg(`Failed to create passport: ${err.message || 'Transaction rejected'}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
            {/* Header */}
            <div className="zayq-card rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#3D1A12] text-[#F7F4F2] flex items-center justify-center shadow-md">
                        <Shield size={28} />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-[#3D1A12] font-display">Admin & Verification Telemetry Console</h1>
                            <span className="zayq-badge">Platform Root</span>
                        </div>
                        <p className="text-xs text-[#5A4D44] font-sans">Manage live MST passports, persistent storage, and blockchain anchors</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="zayq-btn-primary"
                    >
                        <Plus size={16} />
                        <span>Register New Item</span>
                    </button>
                    <button
                        onClick={onOpenMSTExplorer}
                        className="zayq-btn-ghost"
                    >
                        <Cpu size={16} />
                        <span>MST Telemetry</span>
                    </button>
                    <button
                        onClick={handleClearStorage}
                        className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                        title="Clear local storage cache"
                    >
                        <Trash2 size={14} />
                        <span>Reset Storage</span>
                    </button>
                </div>
            </div>

            {/* Create Passport Form Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="zayq-card rounded-3xl p-8 max-w-xl w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E5DFD9] pb-4">
                            <div className="flex items-center gap-2">
                                <Package size={20} className="text-[#3D1A12]" />
                                <h3 className="text-xl font-black text-[#3D1A12] font-display">Register New Product Passport</h3>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-xs font-mono text-[#8C6D58] hover:text-[#3D1A12]"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {createMsg && (
                            <div className={`p-3 rounded-xl text-xs font-mono border ${createMsg.includes('Failed') ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                                {createMsg}
                            </div>
                        )}

                        <form onSubmit={handleCreatePassport} className="space-y-4 text-xs font-sans">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-mono font-bold text-[#3D1A12] uppercase tracking-wider text-[10px]">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as ProductCategory)}
                                        className="w-full bg-[#FAF8F5] border border-[#E5DFD9] rounded-xl p-3 font-sans text-xs text-[#3D1A12]"
                                    >
                                        <option value="LAPTOP">Laptop / Computer</option>
                                        <option value="SMARTPHONE">Smartphone</option>
                                        <option value="WATCH">Luxury Watch</option>
                                        <option value="CAMERA">Camera Gear</option>
                                        <option value="TABLET">Tablet</option>
                                        <option value="OTHER">Other Luxury Asset</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="font-mono font-bold text-[#3D1A12] uppercase tracking-wider text-[10px]">Release Year</label>
                                    <input
                                        type="number"
                                        value={releaseYear}
                                        onChange={(e) => setReleaseYear(Number(e.target.value))}
                                        className="w-full bg-[#FAF8F5] border border-[#E5DFD9] rounded-xl p-3 font-sans text-xs text-[#3D1A12]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-mono font-bold text-[#3D1A12] uppercase tracking-wider text-[10px]">Brand</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Apple, Sony, Rolex"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full bg-[#FAF8F5] border border-[#E5DFD9] rounded-xl p-3 font-sans text-xs text-[#3D1A12]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-mono font-bold text-[#3D1A12] uppercase tracking-wider text-[10px]">Model</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. MacBook Pro M3 Max"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full bg-[#FAF8F5] border border-[#E5DFD9] rounded-xl p-3 font-sans text-xs text-[#3D1A12]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-mono font-bold text-[#3D1A12] uppercase tracking-wider text-[10px]">Serial Number / IMEI / Service Tag</label>
                                <input
                                    type="text"
                                    placeholder="e.g. C02G1928M3XX"
                                    value={serialNumber}
                                    onChange={(e) => setSerialNumber(e.target.value)}
                                    className="w-full bg-[#FAF8F5] border border-[#E5DFD9] rounded-xl p-3 font-mono text-xs text-[#3D1A12]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-mono font-bold text-[#3D1A12] uppercase tracking-wider text-[10px]">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full bg-[#FAF8F5] border border-[#E5DFD9] rounded-xl p-3 font-sans text-xs text-[#3D1A12]"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5DFD9]">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="zayq-btn-ghost py-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="zayq-btn-primary py-3"
                                >
                                    {creating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    <span>{creating ? 'Anchoring on MST...' : 'Mint & Anchor Passport'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MST Anchor Telemetry Box */}
            <div className="zayq-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu size={18} className="text-[#3D1A12]" />
                        <h3 className="font-bold text-base text-[#3D1A12] font-display">MST Transaction Anchor Queue Telemetry</h3>
                    </div>
                    <button
                        onClick={handleRetryAll}
                        disabled={retrying}
                        className="zayq-btn-primary py-2 px-4 text-xs font-mono"
                    >
                        <RefreshCw size={13} className={retrying ? 'animate-spin' : ''} />
                        <span>Retry Queue ({failedAnchors.length})</span>
                    </button>
                </div>

                {retryMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono">
                        {retryMsg}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5DFD9]">
                        <span className="text-[#8C6D58] block text-[10px] uppercase tracking-wider font-bold">Total Passports Registered</span>
                        <span className="text-[#3D1A12] font-black text-2xl font-display">{passports.length}</span>
                    </div>
                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5DFD9]">
                        <span className="text-[#8C6D58] block text-[10px] uppercase tracking-wider font-bold">Confirmed on MST Testnet</span>
                        <span className="text-emerald-800 font-black text-2xl font-display">{anchors.filter(a => a.status === 'CONFIRMED').length}</span>
                    </div>
                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5DFD9]">
                        <span className="text-[#8C6D58] block text-[10px] uppercase tracking-wider font-bold">Pending / Retry Queue</span>
                        <span className="text-rose-800 font-black text-2xl font-display">{failedAnchors.length}</span>
                    </div>
                </div>
            </div>

            {/* Registered Passports & Anomalies */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#3D1A12] font-display flex items-center gap-2">
                        <Package size={20} className="text-[#3D1A12]" />
                        <span>All Registered Passports ({passports.length})</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {passports.map((p) => (
                        <div key={p.passportId} className="zayq-card rounded-2xl p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <img src={p.imageUrl} alt={p.model} className="w-14 h-14 rounded-xl object-cover border border-[#E5DFD9]" />
                                <div>
                                    <h4 className="font-extrabold text-[#3D1A12] text-sm font-display">{p.model}</h4>
                                    <p className="text-xs font-mono text-[#8C6D58]">{p.passportId} • {p.brand}</p>
                                    <span className="zayq-badge mt-1">{p.currentStatus}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onNavigate('passport-detail', p.passportId)}
                                className="zayq-btn-ghost text-xs py-2 px-3 shrink-0"
                            >
                                View Passport
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
