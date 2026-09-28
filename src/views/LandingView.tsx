import React, { useState } from 'react';
import { Shield, Search, ArrowRight, CheckCircle2, Award, Wrench, Lock, Layers, Sparkles, Cpu, QrCode } from 'lucide-react';
import { AppStore } from '../core/store';
import { VerificationBadge } from '../components/VerificationBadge';
import { StatusBadge } from '../components/StatusBadge';

interface Props {
    onNavigate: (view: string, param?: string) => void;
    onStartKillerDemo: () => void;
    onOpenMSTExplorer: () => void;
}

export const LandingView: React.FC<Props> = ({ onNavigate, onStartKillerDemo, onOpenMSTExplorer }) => {
    const [searchInput, setSearchInput] = useState('');
    const passports = AppStore.getPassports();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            onNavigate('passport-detail', searchInput.trim().toUpperCase());
        }
    };

    return (
        <div className="space-y-20 pb-12">
            {/* Hero Section */}
            <section className="relative pt-12 pb-20 overflow-hidden">
                {/* Glow Accents */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <Sparkles size={14} className="text-cyan-400" />
                        <span>MST-Native Product Identity Network & Trusted Marketplace</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-sans leading-tight">
                        Every product has a history. <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Verify it.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
                        Second-hand commerce traditionally trusts the seller. <br className="hidden sm:block" />
                        Product Passport changes the model: <strong className="text-cyan-300 font-semibold">Trust the product's verifiable history on MST.</strong>
                    </p>

                    {/* Quick Passport Search Box */}
                    <div className="max-w-xl mx-auto">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Enter Passport ID (e.g. PP-82941)..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full bg-slate-900/90 border-2 border-slate-700/80 focus:border-cyan-500 rounded-2xl pl-12 pr-32 py-4 text-base text-white placeholder-slate-500 shadow-2xl outline-none transition-all font-mono"
                            />
                            <Search size={20} className="absolute left-4 text-slate-400" />
                            <button
                                type="submit"
                                className="absolute right-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-1.5"
                            >
                                <span>Verify</span>
                                <ArrowRight size={16} />
                            </button>
                        </form>
                        <div className="mt-2 text-xs text-slate-400 font-mono flex items-center justify-center gap-3">
                            <span>Try demo passports:</span>
                            <button onClick={() => onNavigate('passport-detail', 'PP-82941')} className="text-cyan-400 underline hover:text-cyan-300">PP-82941</button>
                            <button onClick={() => onNavigate('passport-detail', 'PP-91823')} className="text-cyan-400 underline hover:text-cyan-300">PP-91823</button>
                            <button onClick={() => onNavigate('passport-detail', 'PP-73910')} className="text-cyan-400 underline hover:text-cyan-300">PP-73910</button>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => onNavigate('marketplace')}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/30 flex items-center gap-2 transform hover:scale-105"
                        >
                            <span>Explore Marketplace</span>
                            <ArrowRight size={18} />
                        </button>

                        <button
                            onClick={onStartKillerDemo}
                            className="bg-slate-900 hover:bg-slate-800 border-2 border-cyan-500/40 text-cyan-300 font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 transform hover:scale-105"
                        >
                            <Sparkles size={18} className="text-cyan-400" />
                            <span>Launch Killer Demo Sequence</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Network Live Stats Banner */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xl">
                    <div className="space-y-1">
                        <span className="text-3xl font-extrabold text-white font-mono">100%</span>
                        <p className="text-xs text-slate-400 font-mono">Persistent Passport Survival</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-3xl font-extrabold text-cyan-400 font-mono">0 NFC</span>
                        <p className="text-xs text-slate-400 font-mono">Pure Cryptographic Proof</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-3xl font-extrabold text-purple-400 font-mono">5 Layers</span>
                        <p className="text-xs text-slate-400 font-mono">Attestation Verification</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-3xl font-extrabold text-emerald-400 font-mono">MST L1</span>
                        <p className="text-xs text-slate-400 font-mono">EVM Contract Integrity</p>
                    </div>
                </div>
            </section>

            {/* Core Thesis & How It Works */}
            <section className="max-w-6xl mx-auto px-4 space-y-12">
                <div className="text-center space-y-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Architectural Principles</span>
                    <h2 className="text-3xl font-extrabold text-white font-sans">How Product Passport Transforms Commerce</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-cyan-500/50 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">1. Persistent Product Identity</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Every valuable device gets a unique Passport ID (<span className="font-mono text-cyan-300">PP-82941</span>) tied to its hashed serial/IMEI. The Passport survives resales, owner changes, and service events forever.
                        </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/50 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">2. Layered Verification Engine</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Instead of a fake "Authentic = True" switch, claims are layered: Identity Verified → Ownership Invoice Verified → Professionally Inspected → OEM Service Attested.
                        </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/50 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Lock size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">3. MST Integrity Layer</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            MST smart contracts (<span className="font-mono text-emerald-300">ProductPassportRegistry</span> & <span className="font-mono text-emerald-300">OwnershipRegistry</span>) lock ownership transitions and attestations on-chain without storing private data.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Verified Passports Preview */}
            <section className="max-w-6xl mx-auto px-4 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-white font-sans">Featured Verified Passports</h2>
                        <p className="text-xs text-slate-400 font-mono mt-1">Live digital product identities registered on MST</p>
                    </div>

                    <button
                        onClick={() => onNavigate('marketplace')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 hover:underline"
                    >
                        <span>View All Listings</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {passports.map((p) => (
                        <div
                            key={p.passportId}
                            onClick={() => onNavigate('passport-detail', p.passportId)}
                            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group flex flex-col justify-between"
                        >
                            <div>
                                {/* Image */}
                                <div className="relative h-48 bg-slate-950 overflow-hidden">
                                    <img
                                        src={p.imageUrl}
                                        alt={p.model}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                                        <VerificationBadge level={p.verificationLevel} size="sm" />
                                        <StatusBadge status={p.currentStatus} size="sm" />
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white border border-slate-700">
                                        {p.passportId}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{p.brand} • {p.category}</span>
                                        <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                                            {p.model}
                                        </h3>
                                    </div>

                                    <div className="text-xs text-slate-400 space-y-1 font-mono">
                                        <div className="flex justify-between">
                                            <span>Current Owner:</span>
                                            <span className="text-slate-200">{p.currentOwnerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Service Records:</span>
                                            <span className="text-amber-400 font-bold">{p.serviceRecords.length} Verified</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Inspection:</span>
                                            <span className="text-purple-400 font-bold">{p.inspectionRecords[0]?.overallScore || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 pt-0 border-t border-slate-800/60 mt-3 flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-500">MST Block Anchored</span>
                                <span className="text-cyan-400 font-bold flex items-center gap-1">
                                    <span>View Passport</span>
                                    <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
