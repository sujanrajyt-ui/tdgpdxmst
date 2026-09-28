import React, { useState } from 'react';
import { MarketplaceListing, ProductPassport } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { Shield, ArrowRight, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

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
        ACTIVE: { label: 'Available', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' },
        PENDING_TRANSFER: { label: 'In Escrow', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' },
        SOLD: { label: 'Sold Out', bg: 'bg-slate-800 text-slate-400 border-slate-700' },
        CANCELLED: { label: 'Cancelled', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    }[listing.status] || { label: listing.status, bg: 'bg-slate-800 text-slate-300' };

    const imageUrl = passport?.imageUrl || '';

    return (
        <div
            onClick={() => onViewDetail(listing.id)}
            className="group cursor-pointer zayq-glass-card rounded-2xl p-4 border border-white/10 zayq-card-hover relative flex flex-col justify-between overflow-hidden"
        >
            {/* Top Glow Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div>
                {/* Image Container */}
                <div className="relative aspect-[4/3] rounded-xl bg-[#090D16] overflow-hidden border border-white/10 shadow-inner">
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

                    {/* Image with smooth zoom */}
                    {imageUrl && !imgError ? (
                        <img
                            src={imageUrl}
                            alt={listing.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#090D16] text-slate-600 gap-2">
                            <Shield size={36} className="opacity-30 text-cyan-400" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">Verified MST Identity</span>
                        </div>
                    )}

                    {/* Hover Inspect On-Chain Overlay Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/95 via-[#090D16]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewPassport(listing.passportId);
                            }}
                            className="w-full py-2 bg-[#0D1321] hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-mono text-[10px] font-extrabold rounded-xl border border-cyan-500/40 backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-lg uppercase tracking-wider"
                        >
                            <Cpu size={13} />
                            <span>Inspect Passport ({listing.passportId})</span>
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 tracking-wider uppercase">
                        <span>{passport?.category || 'TECH'} • {listing.location}</span>
                        <span className="text-slate-500 font-mono">{listing.passportId}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-1 font-display">
                        {listing.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 font-sans leading-relaxed">
                        {listing.description}
                    </p>

                    {/* Service & Inspection Badge Highlights */}
                    <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="px-2.5 py-1.5 bg-[#0D1321] rounded-xl border border-white/5 flex items-center justify-between">
                            <span className="text-slate-400">Service Logs:</span>
                            <span className="text-amber-300 font-bold">{passport?.serviceRecords.length || 0} Verified</span>
                        </div>
                        <div className="px-2.5 py-1.5 bg-[#0D1321] rounded-xl border border-white/5 flex items-center justify-between">
                            <span className="text-slate-400">Condition:</span>
                            <span className="text-purple-300 font-bold">{passport?.inspectionRecords[0]?.overallScore || '9.4'}/10</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price & Action Bottom Row */}
            <div className="mt-5 pt-3.5 flex items-center justify-between border-t border-white/10">
                <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block">Listed Price</span>
                    <span className="text-lg font-black text-white tracking-tight font-display">{formatPrice(listing.price)}</span>
                </div>

                <div className="bg-cyan-500/10 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-1.5">
                    <span>View Item</span>
                    <ArrowRight size={13} />
                </div>
            </div>
        </div>
    );
};
