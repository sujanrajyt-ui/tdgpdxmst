import React, { useState } from 'react';
import { AppStore } from '../core/store';
import { ProductCardZayq } from '../components/ProductCardZayq';
import { Store, Search, Filter, Shield, Tag, ArrowRight, CheckCircle2, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductCategory, VerificationLevel } from '../types';

interface Props {
    onNavigate: (view: string, param?: string) => void;
}

export const MarketplaceView: React.FC<Props> = ({ onNavigate }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedVerification, setSelectedVerification] = useState<string>('ALL');
    const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH'>('NEWEST');

    const listings = AppStore.getListings();
    const passportsMap = new Map(AppStore.getPassports().map(p => [p.passportId, p]));

    const categories = [
        { id: 'ALL', label: 'All Items' },
        { id: 'LAPTOP', label: 'Laptops' },
        { id: 'SMARTPHONE', label: 'Smartphones' },
        { id: 'CAMERA', label: 'Cameras' },
        { id: 'AUDIO', label: 'Audio' },
    ];

    const filteredListings = listings.filter(l => {
        const passport = passportsMap.get(l.passportId);
        if (!passport) return false;

        if (search.trim()) {
            const q = search.toLowerCase();
            const matchTitle = l.title.toLowerCase().includes(q);
            const matchModel = passport.model.toLowerCase().includes(q);
            const matchPassport = l.passportId.toLowerCase().includes(q);
            if (!matchTitle && !matchModel && !matchPassport) return false;
        }

        if (selectedCategory !== 'ALL' && passport.category !== selectedCategory) {
            return false;
        }

        if (selectedVerification !== 'ALL' && passport.verificationLevel !== selectedVerification) {
            return false;
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === 'PRICE_LOW') return a.price - b.price;
        if (sortBy === 'PRICE_HIGH') return b.price - a.price;
        return 0;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            {/* Header Banner */}
            <div className="zayq-glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-black tracking-zayq uppercase shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                            <Shield size={13} />
                            <span>Verified Second-Hand Marketplace</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display leading-tight">
                            Trusted Products with Persistent Identity
                        </h1>
                        <p className="text-sm text-slate-300 font-sans leading-relaxed">
                            Resale history survives every owner transition. Browse verified listings backed by MST Blockchain smart-contract escrow and tamper-evident condition attestations.
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigate('create-passport')}
                        className="zayq-btn-primary py-3.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0"
                    >
                        <Tag size={16} />
                        <span>List Verified Product</span>
                    </button>
                </div>
            </div>

            {/* ZAYQ Toolbar & Filter Control Bar */}
            <div className="zayq-glass rounded-2xl p-5 space-y-4 shadow-xl border border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by model, title, or PP-82941..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#0D1321] border border-white/10 focus:border-cyan-500/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-cyan-500/20 font-mono"
                        />
                        <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
                    </div>

                    {/* Filter Dropdowns & Sort Controls */}
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto text-xs font-mono">
                        <select
                            value={selectedVerification}
                            onChange={(e) => setSelectedVerification(e.target.value)}
                            className="bg-[#0D1321] border border-white/10 text-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                        >
                            <option value="ALL">All Verification Tiers</option>
                            <option value="PROFESSIONALLY_INSPECTED">TechCert Inspected</option>
                            <option value="OWNERSHIP_VERIFIED">Ownership Verified</option>
                            <option value="IDENTITY_VERIFIED">Identity Verified</option>
                            <option value="SELLER_REPORTED">Seller Reported</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-[#0D1321] border border-white/10 text-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                        >
                            <option value="NEWEST">Sort: Newest First</option>
                            <option value="PRICE_LOW">Price: Low to High</option>
                            <option value="PRICE_HIGH">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-white/10">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all ${selectedCategory === cat.id
                                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] font-extrabold'
                                : 'bg-[#0D1321] text-slate-400 hover:text-white border border-white/5'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((l) => {
                    const passport = passportsMap.get(l.passportId);
                    return (
                        <ProductCardZayq
                            key={l.id}
                            listing={l}
                            passport={passport}
                            onViewDetail={(id) => onNavigate('listing-detail', id)}
                            onViewPassport={(id) => onNavigate('passport-detail', id)}
                        />
                    );
                })}
            </div>

            {filteredListings.length === 0 && (
                <div className="zayq-glass-card rounded-2xl p-12 text-center space-y-3">
                    <Shield size={44} className="mx-auto text-slate-600 opacity-50" />
                    <h3 className="text-lg font-bold text-white font-display">No Matching Product Passports Found</h3>
                    <p className="text-xs text-slate-400 font-mono">Try adjusting your search query or verification filter settings.</p>
                </div>
            )}
        </div>
    );
};
