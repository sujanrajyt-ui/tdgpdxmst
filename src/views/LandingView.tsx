import React, { useState } from 'react';
import { Shield, Search, ArrowRight, CheckCircle2, Award, Wrench, Lock, Layers, Sparkles, Cpu, QrCode, ShieldCheck, Zap } from 'lucide-react';
import { AppStore } from '../core/store';
import { VerificationBadge } from '../components/VerificationBadge';
import { ProductCardZayq } from '../components/ProductCardZayq';

interface Props {
    onNavigate: (view: string, param?: string) => void;
    onStartKillerDemo: () => void;
    onOpenMSTExplorer: () => void;
}

export const LandingView: React.FC<Props> = ({ onNavigate, onStartKillerDemo, onOpenMSTExplorer }) => {
    const [searchInput, setSearchInput] = useState('');
    const passports = AppStore.getPassports();
    const listings = AppStore.getListings();
    const passportsMap = new Map(passports.map(p => [p.passportId, p]));

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            onNavigate('passport-detail', searchInput.trim().toUpperCase());
        }
    };

    return (
        <div className="space-y-24 pb-20">
            {/* High-Impact Hero Section */}
            <section className="relative pt-16 pb-24 overflow-hidden">
                {/* Ambient Radial Background Lights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/15 rounded-full blur-[150px] pointer-events-none animate-glow" />
                <div className="absolute top-1/3 right-5 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 text-center relative z-10 space-y-8">
                    {/* Eyebrow Chip */}
                    <div className="inline-flex items-center gap-2 zayq-glass px-4 py-2 rounded-full text-[10px] font-black tracking-zayq uppercase text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] border border-cyan-500/30">
                        <Sparkles size={14} className="text-cyan-400" />
                        <span>MST Identity Network • Persistent Product Memory</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight font-display leading-[1.08] max-w-4xl mx-auto">
                        Every product has a history. <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Verify it before you buy.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
                        Second-hand commerce traditionally relies on seller claims. <br className="hidden sm:block" />
                        Product Passport turns the model inside out: <strong className="text-cyan-300 font-bold">Trust verifiable history anchored on MST.</strong>
                    </p>

                    {/* Passport Verification Form Input */}
                    <div className="max-w-2xl mx-auto pt-2">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center group">
                            <input
                                type="text"
                                placeholder="Enter Passport ID (e.g. PP-82941)..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full bg-[#0D1321] border-2 border-white/10 focus:border-cyan-500/90 rounded-2xl pl-13 pr-40 py-4 text-sm text-white placeholder-slate-500 shadow-2xl outline-none transition-all font-mono focus:ring-4 focus:ring-cyan-500/20"
                            />
                            <Search size={20} className="absolute left-4.5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                            <button
                                type="submit"
                                className="absolute right-2.5 zayq-btn-primary shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                            >
                                <span>Verify</span>
                                <ArrowRight size={14} />
                            </button>
                        </form>
                        <div className="mt-3 text-xs text-slate-400 font-mono flex items-center justify-center gap-3">
                            <span className="text-slate-500">Quick Demo Passports:</span>
                            <button onClick={() => onNavigate('passport-detail', 'PP-82941')} className="text-cyan-400 underline font-bold hover:text-cyan-300">PP-82941</button>
                            <button onClick={() => onNavigate('passport-detail', 'PP-91823')} className="text-cyan-400 underline font-bold hover:text-cyan-300">PP-91823</button>
                            <button onClick={() => onNavigate('passport-detail', 'PP-73910')} className="text-cyan-400 underline font-bold hover:text-cyan-300">PP-73910</button>
                        </div>
                    </div>

                    {/* Main CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => onNavigate('marketplace')}
                            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black px-9 py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2 transform hover:scale-105 active:scale-95"
                        >
                            <span>Explore Marketplace</span>
                            <ArrowRight size={16} />
                        </button>

                        <button
                            onClick={onStartKillerDemo}
                            className="bg-[#0D1321] hover:bg-[#141C30] border border-cyan-500/40 text-cyan-300 font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 transform hover:scale-105"
                        >
                            <Sparkles size={16} className="text-cyan-400" />
                            <span>Launch Killer Demo Sequence</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Live Stats Bar */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="zayq-glass-card rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="space-y-1">
                        <span className="text-4xl font-black text-white font-display">100%</span>
                        <p className="text-[10px] text-slate-400 font-mono tracking-zayq uppercase">History Retention</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-4xl font-black text-cyan-400 font-display">0 NFC</span>
                        <p className="text-[10px] text-slate-400 font-mono tracking-zayq uppercase">Zero Physical Tag Needed</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-4xl font-black text-purple-400 font-display">5 Tiers</span>
                        <p className="text-[10px] text-slate-400 font-mono tracking-zayq uppercase">Attestation Claims</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-4xl font-black text-emerald-400 font-display">MST L1</span>
                        <p className="text-[10px] text-slate-400 font-mono tracking-zayq uppercase">Smart Contract Escrow</p>
                    </div>
                </div>
            </section>

            {/* Architectural Trust Pillars */}
            <section className="max-w-6xl mx-auto px-4 space-y-10">
                <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-zayq">Trust Architecture</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white font-display">How Product Passport Protects Resale</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="zayq-glass-card rounded-2xl p-7 space-y-4 hover:border-cyan-500/50 transition-all zayq-card-hover border border-white/10">
                        <div className="w-13 h-13 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <Shield size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-display">1. Persistent Identity</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            Every laptop or smartphone gets a immutable Passport ID (<span className="font-mono text-cyan-300">PP-82941</span>) linked to its hashed serial/IMEI. History survives every ownership transfer forever.
                        </p>
                    </div>

                    <div className="zayq-glass-card rounded-2xl p-7 space-y-4 hover:border-purple-500/50 transition-all zayq-card-hover border border-white/10">
                        <div className="w-13 h-13 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                            <Layers size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-display">2. Layered Attestations</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            Instead of a single fake "Authentic" tag, claims are layered: Identity Verified → Invoice Verified → TechCert Professionally Inspected → Service Center Attested.
                        </p>
                    </div>

                    <div className="zayq-glass-card rounded-2xl p-7 space-y-4 hover:border-emerald-500/50 transition-all zayq-card-hover border border-white/10">
                        <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <Lock size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-display">3. MST Smart-Contract Escrow</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            MST EVM smart contracts (<span className="font-mono text-emerald-300">OwnershipRegistry</span>) lock funds until buyer receives the physical item and verifies the handover code.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Marketplace Catalog Showcase */}
            <section className="max-w-6xl mx-auto px-4 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-white font-display">Verified Marketplace Catalog</h2>
                        <p className="text-xs text-slate-400 font-mono mt-1">Live second-hand items backed by MST blockchain proof</p>
                    </div>

                    <button
                        onClick={() => onNavigate('marketplace')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1.5 hover:underline"
                    >
                        <span>View All Listings</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {listings.slice(0, 3).map((l) => (
                        <ProductCardZayq
                            key={l.id}
                            listing={l}
                            passport={passportsMap.get(l.passportId)}
                            onViewDetail={(id) => onNavigate('listing-detail', id)}
                            onViewPassport={(id) => onNavigate('passport-detail', id)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};
