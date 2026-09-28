import React, { useState } from 'react';
import { Shield, Search, ArrowRight, CheckCircle2, Award, Wrench, Lock, Layers, Sparkles, Cpu, QrCode } from 'lucide-react';
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
        <div className="space-y-20 pb-16">
            {/* ZAYQ Style Hero Section */}
            <section className="relative pt-10 pb-16 overflow-hidden">
                {/* Glow Accents */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 zayq-glass px-4 py-1.5 rounded-full text-[10px] font-bold tracking-zayq uppercase text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                        <Sparkles size={14} className="text-cyan-400" />
                        <span>ZAYQ Component-Based UI • MST Identity Network</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-sans leading-tight">
                        Every product has a history. <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Verify it before you buy.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
                        Second-hand commerce traditionally trusts the seller. <br className="hidden sm:block" />
                        Product Passport changes the model: <strong className="text-cyan-300 font-semibold">Trust the product's verifiable on-chain history on MST.</strong>
                    </p>

                    {/* ZAYQ Quick Passport Verification Box */}
                    <div className="max-w-xl mx-auto">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Enter Passport ID (e.g. PP-82941)..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-500/80 rounded-2xl pl-12 pr-36 py-4 text-sm text-white placeholder-slate-500 shadow-2xl outline-none transition-all font-mono"
                            />
                            <Search size={18} className="absolute left-4 text-slate-400" />
                            <button
                                type="submit"
                                className="absolute right-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5"
                            >
                                <span>Verify</span>
                                <ArrowRight size={14} />
                            </button>
                        </form>
                        <div className="mt-2.5 text-xs text-slate-400 font-mono flex items-center justify-center gap-3">
                            <span>Try demo passports:</span>
                            <button onClick={() => onNavigate('passport-detail', 'PP-82941')} className="text-cyan-400 underline hover:text-cyan-300">PP-82941</button>
                            <button onClick={() => onNavigate('passport-detail', 'PP-91823')} className="text-cyan-400 underline hover:text-cyan-300">PP-91823</button>
                            <button onClick={() => onNavigate('passport-detail', 'PP-73910')} className="text-cyan-400 underline hover:text-cyan-300">PP-73910</button>
                        </div>
                    </div>

                    {/* ZAYQ CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <button
                            onClick={() => onNavigate('marketplace')}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 transform hover:scale-105 active:scale-95"
                        >
                            <span>Explore Marketplace</span>
                            <ArrowRight size={16} />
                        </button>

                        <button
                            onClick={onStartKillerDemo}
                            className="bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 transform hover:scale-105"
                        >
                            <Sparkles size={16} className="text-cyan-400" />
                            <span>Launch Killer Demo Sequence</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* ZAYQ Network Live Stats Banner */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="zayq-glass-card rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border border-slate-800">
                    <div className="space-y-1">
                        <span className="text-3xl font-black text-white font-mono">100%</span>
                        <p className="text-[10px] text-slate-400 font-mono tracking-zayq uppercase">Passport History Survival</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-3xl font-black text-cyan-400 font-mono">0 NFC</span>
                        <p className="text-[10px] text-slate-400 font-mono tracking-zayq uppercase">Pure Cryptographic Proof</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-3xl font-black text-purple-400 font-mono">5 Tiers</span>
                        <p className="text-[10px] text-slate-400 font-mono tracking-zayq uppercase">Verification Claims</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-3xl font-black text-emerald-400 font-mono">MST L1</span>
                        <p className="text-[10px] text-slate-400 font-mono tracking-zayq uppercase">Smart Contract Escrow</p>
                    </div>
                </div>
            </section>

            {/* ZAYQ Core Architectural Features Grid */}
            <section className="max-w-6xl mx-auto px-4 space-y-8">
                <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-zayq">Trust Infrastructure</span>
                    <h2 className="text-3xl font-black text-white font-sans">How Product Passport Transforms Resale</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="zayq-glass-card rounded-2xl p-6 space-y-4 hover:border-cyan-500/50 transition-all zayq-card-hover">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">1. Persistent Product Memory</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Every item receives a unique Passport ID (<span className="font-mono text-cyan-300">PP-82941</span>) anchored on MST Blockchain. History survives across Owner #1 → Owner #2 → Owner #3.
                        </p>
                    </div>

                    <div className="zayq-glass-card rounded-2xl p-6 space-y-4 hover:border-purple-500/50 transition-all zayq-card-hover">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">2. Layered Verification Engine</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Verification tiers communicate true evidence: Seller Declared → Identity Verified → Ownership Invoice Match → TechCert Professionally Inspected.
                        </p>
                    </div>

                    <div className="zayq-glass-card rounded-2xl p-6 space-y-4 hover:border-emerald-500/50 transition-all zayq-card-hover">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Lock size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">3. MST Smart-Contract Escrow</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            MST smart contracts (<span className="font-mono text-emerald-300">OwnershipRegistry</span>) lock funds until buyer receives and confirms physical handover.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Marketplace Listings Showcase */}
            <section className="max-w-6xl mx-auto px-4 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white font-sans">Verified Marketplace Catalog</h2>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">Explore active items with MST on-chain history</p>
                    </div>

                    <button
                        onClick={() => onNavigate('marketplace')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 hover:underline"
                    >
                        <span>View All Products</span>
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
