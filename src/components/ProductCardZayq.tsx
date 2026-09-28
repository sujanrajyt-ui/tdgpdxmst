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

export const ProductCardZayq: React.FC<Props> = ({ listing, passport, onViewDetail, onViewPassport }) => {
    const [imgError, setImgError] = useState(false);
    const formatPrice = (amount: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);

    const statusConfig = {
        ACTIVE: { label: 'Available', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
        PENDING_TRANSFER: { label: 'In Escrow', style: 'bg-amber-50 text-amber-900 border-amber-200' },
        SOLD: { label: 'Sold Out', style: 'bg-gray-100 text-gray-600 border-gray-200' },
        CANCELLED: { label: 'Cancelled', style: 'bg-rose-50 text-rose-800 border-rose-200' },
    }[listing.status] || { label: listing.status, style: 'bg-gray-100 text-gray-600 border-gray-200' };

    const imageUrl = passport?.imageUrl || '';

    return (
        <article onClick={() => onViewDetail(listing.id)} className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DFD9] bg-white shadow-[0_4px_20px_-2px_rgba(61,26,18,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9BDB5] hover:shadow-[0_16px_35px_-8px_rgba(61,26,18,0.12)]">
            <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl border-b border-[#E5DFD9] bg-[#FAF8F5]">
                    <div className="absolute left-3 top-3 z-20"><VerificationBadge level={passport?.verificationLevel || 'SELLER_REPORTED'} size="sm" /></div>
                    <div className="absolute right-3 top-3 z-20"><span className={`rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] shadow-sm ${statusConfig.style}`}>{statusConfig.label}</span></div>
                    {imageUrl && !imgError ? (
                        <img src={imageUrl} alt={listing.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" onError={() => setImgError(true)} />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#8C6D58]"><Shield size={36} className="opacity-40 text-[#3D1A12]" /><span className="text-[10px] font-mono uppercase tracking-[0.12em]">Device photo unavailable</span></div>
                    )}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#3D1A12]/80 via-[#3D1A12]/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <button onClick={(event) => { event.stopPropagation(); onViewPassport(listing.passportId); }} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/50 bg-white/95 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#3D1A12] shadow-md transition-colors hover:bg-[#3D1A12] hover:text-white">
                            <Cpu size={13} /> Inspect passport ({listing.passportId})
                        </button>
                    </div>
                </div>

                <div className="space-y-2 p-5">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-[#8C6D58]"><span>{passport?.category || 'Device'} · {listing.location}</span><span>{listing.passportId}</span></div>
                    <h3 className="line-clamp-1 font-display text-base font-bold tracking-tight text-[#1A1A1A] transition-colors group-hover:text-[#3D1A12]">{listing.title}</h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-[#5A4D44]">{listing.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono">
                        <div className="flex items-center justify-between rounded-lg border border-[#E5DFD9] bg-[#FAF8F5] px-2.5 py-1.5"><span className="text-[#8C6D58]">Service logs</span><span className="font-bold text-[#3D1A12]">{passport?.serviceRecords.length || 0}</span></div>
                        <div className="flex items-center justify-between rounded-lg border border-[#E5DFD9] bg-[#FAF8F5] px-2.5 py-1.5"><span className="text-[#8C6D58]">Condition</span><span className="font-bold text-[#3D1A12]">{passport?.inspectionRecords[0]?.overallScore || '9.4'}/10</span></div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5DFD9] px-5 pb-5 pt-3">
                <div><span className="mb-0.5 block text-[9px] font-mono uppercase tracking-[0.12em] text-[#8C6D58]">Listed price</span><span className="font-display text-lg font-bold tracking-tight text-[#3D1A12]">{formatPrice(listing.price)}</span></div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3D1A12]/20 bg-[#3D1A12]/5 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#3D1A12] transition-colors group-hover:bg-[#3D1A12] group-hover:text-white">View item <ArrowRight size={13} /></span>
            </div>
        </article>
    );
};