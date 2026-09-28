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
        ACTIVE: { label: 'Available', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        PENDING_TRANSFER: { label: 'In Escrow', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
        SOLD: { label: 'Sold Out', bg: 'bg-gray-100 text-gray-500 border-gray-200' },
        CANCELLED: { label: 'Cancelled', bg: 'bg-rose-50 text-rose-600 border-rose-200' },
    }[listing.status] || { label: listing.status, bg: 'bg-gray-100 text-gray-500' };

    const imageUrl = passport?.imageUrl || '';

    return (
        <div
            onClick={() => onViewDetail(listing.id)}
            className="group cursor-pointer pp-card pp-card-lift rounded-2xl flex flex-col justify-between overflow-hidden"
        >
            <div>
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-2xl">
                    {/* Floating Top-Left Verification Badge */}
                    <div className="absolute top-3 left-3 z-20">
                        <VerificationBadge level={passport?.verificationLevel || 'SELLER_REPORTED'} size="sm" />
                    </div>

                    {/* Floating Top-Right Status Badge */}
                    <div className="absolute top-3 right-3 z-20">
                        <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-full border shadow-sm ${statusConfig.bg}`}>
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
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 gap-2">
                            <Shield size={36} className="opacity-50 text-teal-300" />
                            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400">Verified MST Identity</span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewPassport(listing.passportId);
                            }}
                            className="w-full py-2 bg-white/90 hover:bg-teal-600 hover:text-white text-teal-700 font-mono text-[10px] font-extrabold rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5 shadow-lg uppercase tracking-wider"
                        >
                            <Cpu size={13} />
                            <span>Inspect Passport ({listing.passportId})</span>
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-teal-600 tracking-wider uppercase">
                        <span>{passport?.category || 'TECH'} • {listing.location}</span>
                        <span className="text-gray-400 font-mono">{listing.passportId}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-gray-900 tracking-tight group-hover:text-teal-700 transition-colors line-clamp-1 font-display">
                        {listing.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 font-sans leading-relaxed">
                        {listing.description}
                    </p>

                    {/* Service & Inspection Stats */}
                    <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="px-2.5 py-1.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <span className="text-gray-400">Service Logs:</span>
                            <span className="text-amber-600 font-bold">{passport?.serviceRecords.length || 0} Verified</span>
                        </div>
                        <div className="px-2.5 py-1.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <span className="text-gray-400">Condition:</span>
                            <span className="text-violet-600 font-bold">{passport?.inspectionRecords[0]?.overallScore || '9.4'}/10</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price & Action */}
            <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-gray-100">
                <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-mono block">Listed Price</span>
                    <span className="text-lg font-black text-gray-900 tracking-tight font-display">{formatPrice(listing.price)}</span>
                </div>

                <div className="bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-teal-200 group-hover:border-teal-600 group-hover:shadow-md flex items-center gap-1.5">
                    <span>View Item</span>
                    <ArrowRight size={13} />
                </div>
            </div>
        </div>
    );
};
