import React, { useState } from 'react';
import { AppStore } from '../core/store';
import { ProductCardZayq } from '../components/ProductCardZayq';
import { Search, Shield, Tag, ArrowRight } from 'lucide-react';

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

        if (selectedCategory !== 'ALL' && passport.category !== selectedCategory) return false;
        if (selectedVerification !== 'ALL' && passport.verificationLevel !== selectedVerification) return false;

        return true;
    }).sort((a, b) => {
        if (sortBy === 'PRICE_LOW') return a.price - b.price;
        if (sortBy === 'PRICE_HIGH') return b.price - a.price;
        return 0;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            {/* Header Banner */}
            <div className="pp-card rounded-3xl p-8 relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="pp-chip">
                            <Shield size={13} />
                            <span>Verified Second-Hand Marketplace</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-display leading-tight">
                            Trusted Products with Persistent Identity
                        </h1>
                        <p className="text-sm text-gray-500 font-sans leading-relaxed">
                            Resale history survives every owner transition. Browse verified listings backed by MST Blockchain smart-contract escrow.
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigate('create-passport')}
                        className="pp-btn-primary py-3.5 shrink-0"
                    >
                        <Tag size={16} />
                        <span>List Verified Product</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="pp-card rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by model, title, or PP-82941..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-teal-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-teal-500/15 font-mono"
                        />
                        <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto text-xs font-mono">
                        <select
                            value={selectedVerification}
                            onChange={(e) => setSelectedVerification(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 transition-colors cursor-pointer"
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
                            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 transition-colors cursor-pointer"
                        >
                            <option value="NEWEST">Sort: Newest First</option>
                            <option value="PRICE_LOW">Price: Low to High</option>
                            <option value="PRICE_HIGH">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-gray-100">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all ${selectedCategory === cat.id
                                ? 'bg-teal-600 text-white shadow-md'
                                : 'bg-gray-50 text-gray-500 hover:text-gray-900 border border-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((l) => (
                    <ProductCardZayq
                        key={l.id}
                        listing={l}
                        passport={passportsMap.get(l.passportId)}
                        onViewDetail={(id) => onNavigate('listing-detail', id)}
                        onViewPassport={(id) => onNavigate('passport-detail', id)}
                    />
                ))}
            </div>

            {filteredListings.length === 0 && (
                <div className="pp-card rounded-2xl p-12 text-center space-y-3">
                    <Shield size={44} className="mx-auto text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-700 font-display">No Matching Products Found</h3>
                    <p className="text-xs text-gray-400 font-mono">Try adjusting your search query or filters.</p>
                </div>
            )}
        </div>
    );
};
