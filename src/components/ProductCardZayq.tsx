import React, { useState } from 'react';
import { MarketplaceListing, ProductPassport } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { Shield, ArrowRight, Cpu } from 'lucide-react';

interface Props {
    listing: MarketplaceListing;
    passport?: ProductPassport;
    onViewDetail: (listingId: string) => void;
    onViewPassport: (passportId: string) => void;
}

export const ProductCardZayq: React.FC<Props> = ({
    listing,
    passport,
    onViewDetail,
    onViewPassport,
}) => {
    const [imgError, setImgError] = useState(false);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const statusConfig = {
        ACTIVE: { label: 'Available', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        PENDING_TRANSFER: { label: 'In Escrow', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        SOLD: { label: 'Sold Out', bg: 'bg-slate-800 text-slate-400 border-slate-700' },
        CANCELLED: { label: 'Cancelled', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    }[listing.status] || { label: listing.status, bg: 'bg-slate-800 text-slate-300' };

    const imageUrl = passport?.imageUrl || '';

    return (
        <div className="flex flex-col group zayq-glass-card rounded-2xl p-4 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
            {/* ZAYQ Aspect Ratio Image Container */}
            <div className="relative aspect-[4/3] rounded-xl bg-slate-950 overflow-hidden border border-slate-800/80">
                {/* Floating Top-Left Verification Badge */}
                <div className="absolute top-3 left-3 z-20">
                    <VerificationBadge level={passport?.verificationLevel || 'SELLER_REPORTED'} size="sm" />
                </div>

                {/* Floating Top-Right Status Badge */}
                <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-full border backdrop-blur-md shadow-sm ${statusConfig.bg}`}>
                        {statusConfig.label}
                    </span>
                </div>

                {/* Product Image with ZAYQ Hover Scale */}
                {imageUrl && !imgError ? (
                    <img
                        src={imageUrl}
                        alt={listing.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 gap-2">
                        <Shield size={32} className="opacity-40" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">Verified Identity</span>
                    </div>
                )}

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewPassport(listing.passportId);
                        }}
                        className="w-full py-2 bg-slate-900/90 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-mono text-[10px] font-bold rounded-xl border border-cyan-500/40 backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-lg"
                    >
                        <Cpu size={13} />
                        <span>Inspect Passport ({listing.passportId})</span>
                    </button>
                </div>
            </div>

            {/* ZAYQ Content Metadata Section */}
            <div className="mt-4 flex flex-col flex-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 tracking-wider uppercase mb-1">
                    <span>{passport?.category || 'PRODUCT'}</span>
                    <span className="text-slate-500 font-sans">Passport: {listing.passportId}</span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {listing.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-sans leading-relaxed">
                    {listing.description}
                </p>

                {/* Inspection score highlight */}
                {passport?.inspectionRecords && passport.inspectionRecords.length > 0 && (
                    <div className="mt-3 px-2.5 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">TechCert Condition:</span>
                        <span className="text-purple-300 font-bold">{passport.inspectionRecords[0].overallScore}/10</span>
                    </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/80">
                    <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block">Buy-It-Now Price</span>
                        <span className="text-lg font-extrabold text-white tracking-tight font-sans">{formatPrice(listing.price)}</span>
                    </div>

                    <button
                        onClick={() => onViewDetail(listing.id)}
                        className="bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5"
                    >
                        <span>View Item</span>
                        <ArrowRight size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
};
