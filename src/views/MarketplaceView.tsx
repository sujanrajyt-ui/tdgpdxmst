import React, { useState } from 'react';
import { AppStore } from '../core/store';
import { VerificationBadge } from '../components/VerificationBadge';
import { StatusBadge } from '../components/StatusBadge';
import { Store, Search, Filter, Shield, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProductCategory, VerificationLevel } from '../types';

interface Props {
    onNavigate: (view: string, param?: string) => void;
}

export const MarketplaceView: React.FC<Props> = ({ onNavigate }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedVerification, setSelectedVerification] = useState<string>('ALL');

    const listings = AppStore.getListings().filter(l => l.status === 'ACTIVE' || l.status === 'PENDING_TRANSFER');
    const passportsMap = new Map(AppStore.getPassports().map(p => [p.passportId, p]));

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
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono">
                            Protected Second-Hand Marketplace
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white font-sans">Trusted Products with Persistent Identity</h1>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                        Don't trust seller descriptions alone. Trust verifiable MST passport history.
                    </p>
                </div>

                <button
                    onClick={() => onNavigate('create-passport')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-cyan-900/30"
                >
                    <Tag size={15} />
                    <span>List Verified Product</span>
                </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search listings by model, title, or PP-82941..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                    <Search size={15} className="absolute left-3 top-2.5 text-slate-500" />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto text-xs font-mono">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="LAPTOP">Laptops</option>
                        <option value="SMARTPHONE">Smartphones</option>
                    </select>

                    <select
                        value={selectedVerification}
                        onChange={(e) => setSelectedVerification(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                    >
                        <option value="ALL">All Verification Tiers</option>
                        <option value="PROFESSIONALLY_INSPECTED">Professionally Inspected</option>
                        <option value="OWNERSHIP_VERIFIED">Ownership Verified</option>
                        <option value="IDENTITY_VERIFIED">Identity Verified</option>
                    </select>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredListings.map((l) => {
                    const passport = passportsMap.get(l.passportId);
                    if (!passport) return null;

                    return (
                        <div
                            key={l.id}
                            onClick={() => onNavigate('listing-detail', l.id)}
                            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] group flex flex-col justify-between"
                        >
                            <div>
                                {/* Image */}
                                <div className="relative h-52 bg-slate-950 overflow-hidden">
                                    <img
                                        src={passport.imageUrl}
                                        alt={l.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                                        <VerificationBadge level={passport.verificationLevel} size="sm" />
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white border border-slate-700">
                                        {l.passportId}
                                    </div>
                                </div>

                                {/* Listing Info */}
                                <div className="p-5 space-y-3">
                                    <div>
                                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                                            {passport.brand} • {l.location}
                                        </span>
                                        <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mt-0.5">
                                            {l.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-baseline justify-between pt-1">
                                        <span className="text-xl font-extrabold text-white font-mono">
                                            ₹{l.price.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">
                                            Seller Rep: {l.sellerReputation}/100
                                        </span>
                                    </div>

                                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 font-mono text-slate-400">
                                        <div className="flex justify-between">
                                            <span>Service Records:</span>
                                            <span className="text-amber-400 font-bold">{passport.serviceRecords.length} Verified</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Inspection Score:</span>
                                            <span className="text-purple-400 font-bold">{passport.inspectionRecords[0]?.overallScore || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between text-xs font-mono">
                                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                                    <CheckCircle2 size={13} />
                                    <span>MST Escrow Protected</span>
                                </span>
                                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:underline">
                                    <span>View Details</span>
                                    <ArrowRight size={13} />
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
