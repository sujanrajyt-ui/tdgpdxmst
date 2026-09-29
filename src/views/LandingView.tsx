import React, { useState } from 'react';
import { ArrowRight, Search, ShieldCheck, Tag } from 'lucide-react';
import { AppStore } from '../core/store';
import { ProductCardZayq } from '../components/ProductCardZayq';

interface Props { onNavigate: (view: string, param?: string) => void; }

export const LandingView: React.FC<Props> = ({ onNavigate }) => {
    const [passportId, setPassportId] = useState('');
    const passports = new Map(AppStore.getPassports().map(passport => [passport.passportId, passport]));
    const featured = AppStore.getListings().filter(listing => listing.status === 'ACTIVE').slice(0, 3);

    const handleVerify = (event: React.FormEvent) => {
        event.preventDefault();
        const id = passportId.trim().toUpperCase();
        if (id) onNavigate('passport-detail', id);
    };

    return (
        <div className="shop-home">
            <section className="shop-home-hero">
                <div className="shop-home-copy">
                    <span className="shop-home-eyebrow"><ShieldCheck size={15} /> SECOND-HAND ELECTRONICS, WITH PRODUCT HISTORY</span>
                    <h1>Find a device you can feel good about.</h1>
                    <p>Compare listings, then review a product’s passport for its saved ownership, service, and inspection history.</p>
                    <div className="shop-home-actions">
                        <button onClick={() => onNavigate('marketplace')} className="shop-buy-button">Shop electronics <ArrowRight size={15} /></button>
                        <button onClick={() => onNavigate('create-passport')} className="shop-home-sell"><Tag size={15} /> Create a product passport</button>
                    </div>
                </div>
                <form className="shop-home-verify" onSubmit={handleVerify}>
                    <strong>Have a passport ID?</strong>
                    <span>Look up its saved product record.</span>
                    <div><Search size={17} /><input value={passportId} onChange={event => setPassportId(event.target.value)} placeholder="Enter ID, e.g. PP-82941" aria-label="Product passport ID" /><button type="submit">Look up</button></div>
                    <small>Sample records: <button type="button" onClick={() => onNavigate('passport-detail', 'PP-82941')}>PP-82941</button> · <button type="button" onClick={() => onNavigate('passport-detail', 'PP-91823')}>PP-91823</button></small>
                </form>
            </section>

            <section className="shop-home-featured">
                <div className="shop-home-section-title"><div><span>SHOPPING WITH MORE CONTEXT</span><h2>Featured electronics</h2></div><button onClick={() => onNavigate('marketplace')}>See all listings <ArrowRight size={15} /></button></div>
                <div className="shop-product-grid">
                    {featured.map(listing => <ProductCardZayq key={listing.id} listing={listing} passport={passports.get(listing.passportId)} onViewDetail={id => onNavigate('listing-detail', id)} onViewPassport={id => onNavigate('passport-detail', id)} />)}
                </div>
                <p className="shop-demo-note">Prototype marketplace: these sample listings are stored in this browser. Checkout and payment are not available.</p>
            </section>

            <section className="shop-home-trust"><ShieldCheck size={21} /><div><strong>Review the product before you buy</strong><span>Each listing links to its passport record. Check the evidence and history, and remember that claims can vary in verification level.</span></div></section>
        </div>
    );
};
