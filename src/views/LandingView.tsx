import React, { useState } from 'react';
import { Shield, Search, ArrowRight, Lock, Layers, Sparkles } from 'lucide-react';
import { AppStore } from '../core/store';
import { ProductCardZayq } from '../components/ProductCardZayq';

interface Props {
    onNavigate: (view: string, param?: string) => void;
    onStartKillerDemo: () => void;
    onOpenMSTExplorer: () => void;
}

export const LandingView: React.FC<Props> = ({ onNavigate, onStartKillerDemo, onOpenMSTExplorer }) => {
    const [searchInput, setSearchInput] = useState('');
    const listings = AppStore.getListings();
    const passportsMap = new Map(AppStore.getPassports().map(p => [p.passportId, p]));

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            onNavigate('passport-detail', searchInput.trim().toUpperCase());
        }
    };

    return (
        <div className="space-y-24 pb-20">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 text-center relative z-10 space-y-8">
                    {/* ZAYQ Eyebrow Badge */}
                    <div className="zayq-badge shadow-sm">
                        <Sparkles size={14} className="text-[#3D1A12]" />
                        <span>MST Identity Network • Persistent Product Memory</span>
                    </div>

                    {/* ZAYQ Headline */}
                    <h1 className="text-5xl sm:text-7xl font-black text-[#3D1A12] tracking-tight font-display leading-[1.08] max-w-4xl mx-auto">
                        Every product has a history. <br />
                        <span className="text-[#8C6D58]">
                            Verify it before you buy.
                        </span>
                    </h1>

                    {/* ZAYQ Sub-headline */}
                    <p className="text-lg sm:text-xl text-[#5A4D44] max-w-3xl mx-auto leading-relaxed font-sans font-normal">
                        Second-hand commerce traditionally relies on seller claims. <br className="hidden sm:block" />
                        Product Passport turns the model inside out: <strong className="text-[#3D1A12] font-bold">Trust verifiable history anchored on MST.</strong>
                    </p>

                    {/* Passport Search Input */}
                    <div className="max-w-2xl mx-auto pt-2">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center group">
                            <input
                                type="text"
                                placeholder="Enter Passport ID (e.g. PP-82941)..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="zayq-input-field pl-12 pr-40 py-4 text-sm font-mono shadow-md focus:ring-4 focus:ring-[#3D1A12]/10"
                            />
                            <Search size={20} className="absolute left-4 text-[#8C6D58] group-focus-within:text-[#3D1A12] transition-colors" />
                            <button type="submit" className="absolute right-2.5 zayq-btn-primary">
                                <span>Verify</span>
                                <ArrowRight size={14} />
                            </button>
                        </form>
                        <div className="mt-3 text-xs text-[#8C6D58] font-mono flex items-center justify-center gap-3">
                            <span className="text-[#8C6D58]">Quick Demo Passports:</span>
                            <button onClick={() => onNavigate('passport-detail', 'PP-82941')} className="text-[#3D1A12] underline font-bold hover:text-[#8C6D58]">PP-82941</button>
                            <button onClick={() => onNavigate('passport-detail', 'PP-91823')} className="text-[#3D1A12] underline font-bold hover:text-[#8C6D58]">PP-91823</button>
                            <button onClick={() => onNavigate('passport-detail', 'PP-73910')} className="text-[#3D1A12] underline font-bold hover:text-[#8C6D58]">PP-73910</button>
                        </div>
                    </div>

                    {/* ZAYQ CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => onNavigate('marketplace')}
                            className="zayq-btn-primary py-4 px-9 shadow-lg hover:scale-105 transition-all"
                        >
                            <span>Explore Marketplace</span>
                            <ArrowRight size={16} />
                        </button>

                        <button
                            onClick={onStartKillerDemo}
                            className="zayq-btn-ghost py-4 px-8"
                        >
                            <Sparkles size={16} className="text-[#8C6D58]" />
                            <span>Launch Killer Demo Sequence</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="zayq-card rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-sm">
                    <div className="space-y-1">
                        <span className="text-4xl font-black text-[#3D1A12] font-display">100%</span>
                        <p className="text-[10px] text-[#8C6D58] font-mono tracking-zayq uppercase">History Retention</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-4xl font-black text-[#3D1A12] font-display">0 NFC</span>
                        <p className="text-[10px] text-[#8C6D58] font-mono tracking-zayq uppercase">Zero Tags Needed</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-4xl font-black text-[#8C6D58] font-display">5 Tiers</span>
                        <p className="text-[10px] text-[#8C6D58] font-mono tracking-zayq uppercase">Attestation Claims</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-4xl font-black text-[#3D1A12] font-display">MST L1</span>
                        <p className="text-[10px] text-[#8C6D58] font-mono tracking-zayq uppercase">Smart Contract Escrow</p>
                    </div>
                </div>
            </section>

            {/* Trust Pillars */}
            <section className="max-w-6xl mx-auto px-4 space-y-10">
                <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono font-black text-[#3D1A12] uppercase tracking-zayq">Trust Architecture</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#3D1A12] font-display">How Product Passport Protects Resale</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="zayq-card rounded-2xl p-7 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#3D1A12]/10 border border-[#3D1A12]/20 flex items-center justify-center text-[#3D1A12]">
                            <Shield size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-[#3D1A12] font-display">1. Persistent Identity</h3>
                        <p className="text-sm text-[#5A4D44] leading-relaxed font-sans">
                            Every device gets an immutable Passport ID (<span className="font-mono text-[#3D1A12]">PP-82941</span>) linked to its hashed serial/IMEI. History survives every ownership transfer.
                        </p>
                    </div>

                    <div className="zayq-card rounded-2xl p-7 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#8C6D58]/10 border border-[#8C6D58]/20 flex items-center justify-center text-[#8C6D58]">
                            <Layers size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-[#3D1A12] font-display">2. Layered Attestations</h3>
                        <p className="text-sm text-[#5A4D44] leading-relaxed font-sans">
                            Claims are layered: Identity Verified → Invoice Match → TechCert Professionally Inspected → OEM Service Attested.
                        </p>
                    </div>

                    <div className="zayq-card rounded-2xl p-7 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#6B501B]">
                            <Lock size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-[#3D1A12] font-display">3. MST Escrow</h3>
                        <p className="text-sm text-[#5A4D44] leading-relaxed font-sans">
                            Smart contracts (<span className="font-mono text-[#3D1A12]">OwnershipRegistry</span>) lock funds until buyer receives and confirms physical handover.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-6xl mx-auto px-4 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-[#3D1A12] font-display">Verified Marketplace</h2>
                        <p className="text-sm text-[#8C6D58] font-mono mt-1">Live items backed by MST blockchain proof</p>
                    </div>

                    <button
                        onClick={() => onNavigate('marketplace')}
                        className="text-xs text-[#3D1A12] hover:text-[#8C6D58] font-mono font-bold flex items-center gap-1.5 hover:underline"
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
