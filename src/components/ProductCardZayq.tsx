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
        ACTIVE: { label: 'Available', bg: 'bg-[#3D1A12]/10 text-[#3D1A12] border-[#3D1A12]/30' },
        PENDING_TRANSFER: { label: 'In Escrow', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
        SOLD: { label: 'Sold Out', bg: 'bg-gray-100 text-gray-500 border-gray-200' },
        CANCELLED: { label: 'Cancelled', bg: 'bg-rose-100 text-rose-800 border-rose-200' },
    }[listing.status] || { label: listing.status, bg: 'bg-gray-100 text-gray-500' };

    const imageUrl = passport?.imageUrl || '';

    return (
        <div
            onClick={() => onViewDetail(listing.id)}
            className="group cursor-pointer zayq-card rounded-2xl flex flex-col justify-between overflow-hidden relative"
        >
            <div>
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-[#FAF8F5] overflow-hidden rounded-t-2xl border-b border-[#E5DFD9]">
                    {/* Floating Top-Left Verification Badge */}
                    <div className="absolute top-3 left-3 z-20">
                        <VerificationBadge level={passport?.verificationLevel || 'SELLER_REPORTED'} size="sm" />
                    </div>

                    {/* Floating Top-Right Status Badge */}
                    <div className="absolute top-3 right-3 z-20">
                        <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-zayq rounded-full border shadow-sm ${statusConfig.bg}`}>
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
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF8F5] text-[#8C6D58] gap-2">
                            <Shield size={36} className="opacity-40 text-[#3D1A12]" />
                            <span className="text-[10px] font-mono tracking-zayq uppercase text-[#8C6D58]">Verified MST Identity</span>
                        </div>
                    )}

                    {/* Hover Inspect On-Chain Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3D1A12]/80 via-[#3D1A12]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewPassport(listing.passportId);
                            }}
                            className="w-full py-2 bg-[#F7F4F2] hover:bg-[#3D1A12] hover:text-[#F7F4F2] text-[#3D1A12] font-mono text-[10px] font-extrabold rounded-xl border border-[#E5DFD9] transition-all flex items-center justify-center gap-1.5 shadow-md uppercase tracking-zayq"
                        >
                            <Cpu size={13} />
                            <span>Inspect Passport ({listing.passportId})</span>
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8C6D58] tracking-zayq uppercase">
                        <span>{passport?.category || 'TECH'} • {listing.location}</span>
                        <span className="text-[#8C6D58]/80 font-mono">{listing.passportId}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#1A1A1A] tracking-tight group-hover:text-[#3D1A12] transition-colors line-clamp-1 font-display">
                        {listing.title}
                    </h3>

                    <p className="text-xs text-[#5A4D44] line-clamp-2 font-sans leading-relaxed">
                        {listing.description}
                    </p>

                    {/* Service & Inspection Stats */}
                    <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="px-2.5 py-1.5 bg-[#FAF8F5] rounded-xl border border-[#E5DFD9] flex items-center justify-between">
                            <span className="text-[#8C6D58]">Service Logs:</span>
                            <span className="text-[#3D1A12] font-bold">{passport?.serviceRecords.length || 0} Verified</span>
                        </div>
                        <div className="px-2.5 py-1.5 bg-[#FAF8F5] rounded-xl border border-[#E5DFD9] flex items-center justify-between">
                            <span className="text-[#8C6D58]">Condition:</span>
                            <span className="text-[#8C6D58] font-bold">{passport?.inspectionRecords[0]?.overallScore || '9.4'}/10</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price & Action Bottom Row */}
            <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-[#E5DFD9]">
                <div>
                    <span className="text-[9px] text-[#8C6D58] uppercase tracking-zayq font-mono block">Listed Price</span>
                    <span className="text-lg font-black text-[#3D1A12] tracking-tight font-display">{formatPrice(listing.price)}</span>
                </div>

                <div className="bg-[#3D1A12]/10 group-hover:bg-[#3D1A12] text-[#3D1A12] group-hover:text-[#F7F4F2] px-3.5 py-2 rounded-full text-xs font-extrabold uppercase tracking-zayq transition-all border border-[#3D1A12]/20 flex items-center gap-1.5">
                    <span>View Item</span>
                    <ArrowRight size={13} />
                </div>
            </div>
        </div>
    );
};
