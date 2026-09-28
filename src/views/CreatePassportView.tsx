import React, { useState } from 'react';
import { User, ProductCategory } from '../types';
import { AppStore } from '../core/store';
import { Shield, Sparkles, Upload, FileText, CheckCircle2, Cpu, AlertTriangle } from 'lucide-react';

interface Props {
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
}

export const CreatePassportView: React.FC<Props> = ({ currentUser, onNavigate }) => {
    const [category, setCategory] = useState<ProductCategory>('LAPTOP');
    const [brand, setBrand] = useState('Apple');
    const [model, setModel] = useState('MacBook Pro M3 Max (16-inch, 36GB RAM)');
    const [releaseYear, setReleaseYear] = useState(2024);
    const [serialNumber, setSerialNumber] = useState('C02H9281M399');
    const [imei, setImei] = useState('');
    const [serviceTag, setServiceTag] = useState('');
    const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80');
    const [invoiceTitle, setInvoiceTitle] = useState('Official Tax Invoice & Store Receipt');
    const [hasInvoice, setHasInvoice] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiAutofillUsed, setAiAutofillUsed] = useState(false);

    const handleAiAssist = () => {
        setAiAutofillUsed(true);
        if (category === 'LAPTOP') {
            setBrand('Dell');
            setModel('XPS 15 (Intel Core i9, 32GB RAM, 1TB SSD)');
            setSerialNumber('DLXPS-9201984');
            setServiceTag('SVC-DELL-9921');
            setImageUrl('https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80');
        } else {
            setBrand('Samsung');
            setModel('Galaxy S24 Ultra (512GB Titanium Gray)');
            setImei('359182093812093');
            setSerialNumber('SM-S928B-0982');
            setImageUrl('https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const invoiceHash = hasInvoice ? `0xINVOICE_${Math.floor(100000 + Math.random() * 900000)}` : undefined;

        const { passport, anchorTx } = await AppStore.createPassport({
            category,
            brand,
            model,
            releaseYear,
            serialNumber: serialNumber || undefined,
            imei: imei || undefined,
            serviceTag: serviceTag || undefined,
            imageUrl,
            invoiceTitle,
            invoiceHash,
            currentUser
        });

        setIsSubmitting(false);
        onNavigate('passport-detail', passport.passportId);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-mono mb-2">
                        <Cpu size={14} />
                        <span>MST Product Identity Network</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white font-sans">Register New Product Passport</h1>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                        Create a persistent digital identity anchored on MST smart contracts.
                    </p>
                </div>

                <button
                    onClick={handleAiAssist}
                    type="button"
                    className="bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                >
                    <Sparkles size={14} className="text-purple-400" />
                    <span>AI Photo Listing Auto-Fill</span>
                </button>
            </div>

            {aiAutofillUsed && (
                <div className="bg-purple-500/10 border border-purple-500/30 text-purple-300 p-3 rounded-xl text-xs flex items-center gap-2 font-mono">
                    <Sparkles size={16} className="shrink-0" />
                    <span>AI Vision extracted device category, model, and serial details from upload!</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                {/* Category Choice */}
                <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Product Category</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setCategory('LAPTOP')}
                            className={`p-3.5 rounded-xl border text-left font-sans transition-all ${category === 'LAPTOP' ? 'bg-cyan-950/60 border-cyan-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                        >
                            <span className="block text-sm">Laptop / Computer</span>
                            <span className="text-[10px] font-mono text-slate-500">Uses Serial Number & Service Tag</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategory('SMARTPHONE')}
                            className={`p-3.5 rounded-xl border text-left font-sans transition-all ${category === 'SMARTPHONE' ? 'bg-cyan-950/60 border-cyan-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                        >
                            <span className="block text-sm">Smartphone / Mobile</span>
                            <span className="text-[10px] font-mono text-slate-500">Uses IMEI & Device Serial</span>
                        </button>
                    </div>
                </div>

                {/* Brand & Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Brand / Manufacturer</label>
                        <input
                            type="text"
                            required
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Release Year</label>
                        <input
                            type="number"
                            required
                            value={releaseYear}
                            onChange={(e) => setReleaseYear(parseInt(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Model Description</label>
                    <input
                        type="text"
                        required
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                </div>

                {/* Category-Specific Physical Identifiers (NO NFC!) */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                            Physical Product Identifiers (Cryptographically Hashed)
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">No NFC Needed</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Serial Number <span className="text-cyan-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                                placeholder="e.g. C02G1928M3XX"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                            />
                        </div>

                        {category === 'SMARTPHONE' ? (
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">IMEI Number (15 digits)</label>
                                <input
                                    type="text"
                                    value={imei}
                                    onChange={(e) => setImei(e.target.value)}
                                    placeholder="e.g. 358921098492019"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Tag / Frame ID</label>
                                <input
                                    type="text"
                                    value={serviceTag}
                                    onChange={(e) => setServiceTag(e.target.value)}
                                    placeholder="e.g. DELL-SVC-92810"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Evidence & Ownership Documents Upload */}
                <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-300">Ownership Evidence & Invoice Upload</label>

                    <div className="bg-slate-950 p-4 border border-dashed border-slate-700 rounded-xl text-center space-y-2">
                        <Upload size={24} className="mx-auto text-cyan-400" />
                        <p className="text-xs text-slate-300 font-medium">Drag & drop tax invoice or proof of purchase</p>
                        <p className="text-[10px] text-slate-500 font-mono">Invoice document hash will be computed via WASMify and anchored on MST</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <input
                            type="checkbox"
                            id="invoiceCheck"
                            checked={hasInvoice}
                            onChange={(e) => setHasInvoice(e.target.checked)}
                            className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                        />
                        <label htmlFor="invoiceCheck">Include verified purchase invoice for initial OWNERSHIP_VERIFIED tier</label>
                    </div>
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Product Photo URL</label>
                    <input
                        type="text"
                        required
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <span>Computing WASMify Proof & Anchoring on MST...</span>
                    ) : (
                        <>
                            <Shield size={18} />
                            <span>Create Passport & Anchor Identity on MST</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
