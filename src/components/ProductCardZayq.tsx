import React, { useState } from 'react';
import { MarketplaceListing, ProductPassport } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { ExternalLink, Shield } from 'lucide-react';

interface Props {
    listing: MarketplaceListing;
    passport?: ProductPassport;
    onViewDetail: (listingId: string) => void;
    onViewPassport: (passportId: string) => void;
}

export const ProductCardZayq: React.FC<Props> = ({ listing, passport, onViewDetail, onViewPassport }) => {
    const [imgError, setImgError] = useState(false);
    const formatPrice = (amount: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount);

    return (
        <article className="shop-product-card">
            <button onClick={() => onViewDetail(listing.id)} className="shop-product-image" aria-label={`View ${listing.title}`}>
                {passport?.imageUrl && !imgError ? <img src={passport.imageUrl} alt={listing.title} loading="lazy" onError={() => setImgError(true)} /> : <span className="shop-image-fallback"><Shield size={34} /> Product passport</span>}
                <span className="shop-passport-pill"><Shield size={12} /> Passport included</span>
            </button>
            <div className="shop-product-body">
                <div className="shop-product-category">{passport?.category === 'SMARTPHONE' ? 'SMARTPHONES' : 'LAPTOPS'} <span>•</span> {passport?.brand || 'Verified listing'}</div>
                <button onClick={() => onViewDetail(listing.id)} className="shop-product-title">{listing.title}</button>
                <div className="shop-verification-row"><VerificationBadge level={passport?.verificationLevel || 'SELLER_REPORTED'} size="sm" /> <span>{passport?.currentStatus === 'FOR_SALE' ? 'Available now' : 'Passport record'}</span></div>
                {passport?.inspectionRecords?.length ? <p className="shop-condition">Inspected · {passport.inspectionRecords[0].overallScore}</p> : <p className="shop-condition">{listing.location}</p>}
                <div className="shop-price">{formatPrice(listing.price)}</div>
                <p className="shop-price-note">Asking price · payment handled outside this demo</p>
                <div className="shop-product-actions">
                    <button onClick={() => onViewDetail(listing.id)} className="shop-buy-button">View listing</button>
                    <button onClick={() => onViewPassport(listing.passportId)} className="shop-passport-link" aria-label="View product passport"><ExternalLink size={16} /></button>
                </div>
            </div>
        </article>
    );
};
