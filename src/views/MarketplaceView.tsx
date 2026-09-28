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
        return 0; // Newest by default
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* ZAYQ Style Tagline & Banner Section */}
            <div className="zayq-glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold tracking-zayq uppercase">
                            <Shield size={13} />
                            <span>ZAYQ Component-Based Marketplace Layer</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                            Verified Products with Persistent Identity
                        </h1>
                        <p className="text-sm text-slate-300 font-sans leading-relaxed">
                            Resale history survives every owner transition. Browse verified listings backed by MST Blockchain smart-contract escrow and tamper-evident condition attestations.
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigate('create-passport')}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3.5 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 flex items-center gap-2 shrink-0"
                    >
                        <Tag size={16} />
                        <span>List Verified Product</span>
                    </button>
                </div>
            </div>

            {/* ZAYQ Toolbar & Filter Control Bar */}
            <div className="zayq-glass rounded-2xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by model, title, or PP-82941..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50 font-sans"
                        />
                        <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
                    </div>

                    {/* Filter Chips & Sort Controls */}
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto text-xs font-mono">
                        <select
                            value={selectedVerification}
                            onChange={(e) => setSelectedVerification(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
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
                            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                        >
                            <option value="NEWEST">Sort: Newest First</option>
                            <option value="PRICE_LOW">Price: Low to High</option>
                            <option value="PRICE_HIGH">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Category Filter Chips (ZAYQ Style) */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-1.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all ${selectedCategory === cat.id
                                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/80'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ZAYQ Product Catalog Grid */}
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
                    <Shield size={40} className="mx-auto text-slate-600" />
                    <h3 className="text-lg font-bold text-white">No Matching Product Passports Found</h3>
                    <p className="text-xs text-slate-400 font-mono">Try adjusting search query or verification filter parameters.</p>
                </div>
            )}
        </div>
    );
};
