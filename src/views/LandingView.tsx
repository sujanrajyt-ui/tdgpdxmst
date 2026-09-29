import React, { Suspense, useState } from 'react';
import { ArrowRight, Search, ShieldCheck, Tag } from 'lucide-react';
import { AppStore } from '../core/store';
import { ProductCardZayq } from '../components/ProductCardZayq';

const ReloreProductScene3D = React.lazy(() => import('../components/ReloreProductScene3D'));

interface Props { onNavigate: (view: string, param?: string) => void; }

export const LandingView: React.FC<Props> = ({ onNavigate }) => {
    const [passportId, setPassportId] = useState('');
    const passports = new Map(AppStore.getPassports().map(passport => [passport.passportId, passport]));
    const featured = AppStore.getListings().filter(listing => listing.status === 'ACTIVE').slice(0, 3);
    const heroListing = featured[0];
    const heroPassport = heroListing ? passports.get(heroListing.passportId) : undefined;

    const handleVerify = (event: React.FormEvent) => {
        event.preventDefault();
        const id = passportId.trim().toUpperCase();
        if (id) onNavigate('passport-detail', id);
    };

    return (
        <div className="shop-home">
            <section className="shop-home-hero">
                <div className="shop-home-copy">
                    <span className="shop-home-eyebrow"><ShieldCheck size={15} /> PRE-OWNED TECH, WITH ITS HISTORY</span>
                    <h1>Good devices deserve another life.</h1>
                    <p>Explore pre-owned electronics and check each product passport for saved ownership, service, and inspection records.</p>
                    <div className="shop-home-actions">
                        <button onClick={() => onNavigate('marketplace')} className="shop-buy-button">Shop electronics <ArrowRight size={15} /></button>
                        <button onClick={() => onNavigate('create-passport')} className="shop-home-sell"><Tag size={15} /> Sell with Relore</button>
                    </div>
                </div>
                {heroListing && heroPassport && <div className="shop-home-showcase">
                    <div className="shop-home-product-stage" aria-label={`Interactive 3D preview of a laptop. Featured listing: ${heroListing.title}`}>
                        <span className="shop-home-stage-glow" />
                        <Suspense fallback={<div className="shop-home-stage-loading">Loading 3D product…</div>}>
                            <ReloreProductScene3D />
                        </Suspense>
                        <span className="shop-home-stage-passport"><ShieldCheck size={14} /> Passport included</span>
                    </div>
                    <div className="shop-home-showcase-caption">
                        <span>FEATURED DEVICE · {heroPassport.brand}</span>
                        <strong>{heroPassport.model}</strong>
                        <div className="shop-home-showcase-links">
                            <button type="button" onClick={() => onNavigate('listing-detail', heroListing.id)}>View listing <ArrowRight size={14} /></button>
                            <button type="button" onClick={() => onNavigate('passport-detail', heroPassport.passportId)}>View passport <ArrowRight size={14} /></button>
                        </div>
                        <span className="shop-home-drag-tip">Drag over the model to rotate it</span>
                    </div>
                </div>}
            </section>

            <form className="shop-home-verify" onSubmit={handleVerify}>
                <div className="shop-home-verify-copy"><strong>Checking a product?</strong><span>Look up the passport ID to see its saved record.</span></div>
                <div className="shop-home-verify-field"><Search size={17} /><input value={passportId} onChange={event => setPassportId(event.target.value)} placeholder="Enter passport ID, e.g. PP-82941" aria-label="Product passport ID" /><button type="submit">Look up</button></div>
                <small>Try a sample: <button type="button" onClick={() => onNavigate('passport-detail', 'PP-82941')}>PP-82941</button> · <button type="button" onClick={() => onNavigate('passport-detail', 'PP-91823')}>PP-91823</button></small>
            </form>

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
