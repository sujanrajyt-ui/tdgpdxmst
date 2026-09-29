import React, { useEffect, useState } from 'react';
import { AppStore } from '../core/store';
import { ProductCardZayq } from '../components/ProductCardZayq';
import { Check, ChevronDown, Laptop, Search, ShieldCheck, Smartphone, Tag } from 'lucide-react';
import { User } from '../types';

interface Props {
    onNavigate: (view: string, param?: string) => void;
    currentUser: User;
    listPassportId?: string;
    initialSearchQuery?: string;
}

export const MarketplaceView: React.FC<Props> = ({ onNavigate, currentUser, listPassportId, initialSearchQuery }) => {
    const [search, setSearch] = useState(initialSearchQuery || '');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedVerification, setSelectedVerification] = useState('ALL');
    const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH'>('NEWEST');
    const listPassport = listPassportId ? AppStore.getPassportById(listPassportId) : undefined;
    const [listPrice, setListPrice] = useState(62000);
    const [listLocation, setListLocation] = useState('Bengaluru, KA');
    const [isListing, setIsListing] = useState(false);
    const [listingError, setListingError] = useState('');

    useEffect(() => { if (initialSearchQuery !== undefined) setSearch(initialSearchQuery); }, [initialSearchQuery]);

    const listings = AppStore.getListings();
    const passportsMap = new Map(AppStore.getPassports().map(passport => [passport.passportId, passport]));
    const filteredListings = listings.filter(listing => {
        if (listing.status !== 'ACTIVE') return false;
        const passport = passportsMap.get(listing.passportId);
        if (!passport) return false;
        const query = search.trim().toLowerCase();
        if (query && ![listing.title, passport.model, passport.brand, listing.passportId].some(value => value.toLowerCase().includes(query))) return false;
        if (selectedCategory !== 'ALL' && passport.category !== selectedCategory) return false;
        return selectedVerification === 'ALL' || passport.verificationLevel === selectedVerification;
    }).sort((a, b) => sortBy === 'PRICE_LOW' ? a.price - b.price : sortBy === 'PRICE_HIGH' ? b.price - a.price : 0);

    const categories = [
        { id: 'ALL', label: 'All products', Icon: Tag },
        { id: 'SMARTPHONE', label: 'Smartphones', Icon: Smartphone },
        { id: 'LAPTOP', label: 'Laptops', Icon: Laptop },
    ];

    return (
        <div className="shop-page">
            <div className="shop-page-heading">
                <div><div className="shop-breadcrumb">Marketplace <span>›</span> Electronics</div><h1>Shop verified second-hand electronics</h1><p>Compare listings and open each product passport to review its history.</p></div>
                <button onClick={() => onNavigate('create-passport')} className="shop-sell-button"><Tag size={16} /> Sell a product</button>
            </div>

            {listPassport && <section className="shop-listing-composer">
                <div className="shop-composer-title"><img src={listPassport.imageUrl} alt="" /><div><span>SELLING YOUR PRODUCT</span><h2>{listPassport.model}</h2><small>{listPassport.passportId} · Marketplace listing</small></div></div>
                {listPassport.currentOwnerId !== currentUser.id ? <p className="shop-form-error">Only the current passport owner can list this product.</p> : <>
                    <div className="shop-composer-fields"><label>Asking price (₹)<input type="number" value={listPrice} onChange={event => setListPrice(Number(event.target.value))} min="1" /></label><label>Location<input value={listLocation} onChange={event => setListLocation(event.target.value)} placeholder="City, state" /></label></div>
                    {listingError && <p role="alert" className="shop-form-error">{listingError}</p>}
                    <button disabled={isListing} className="shop-buy-button shop-publish" onClick={async () => {
                        setListingError('');
                        if (!Number.isFinite(listPrice) || listPrice <= 0 || !listLocation.trim()) { setListingError('Enter a price above ₹0 and your item location.'); return; }
                        setIsListing(true);
                        try {
                            const listing = await AppStore.createListing(listPassport.passportId, listPrice, listLocation.trim(), listPassport.model, `Product passport ${listPassport.passportId}.`, currentUser);
                            onNavigate(listing.status === 'PENDING_REVIEW' ? 'dashboard' : 'listing-detail', listing.status === 'PENDING_REVIEW' ? undefined : listing.id);
                        } catch (error) { setListingError(error instanceof Error ? error.message : 'The listing could not be published.'); }
                        finally { setIsListing(false); }
                    }}>{isListing ? 'Publishing…' : 'Publish listing'}</button>
                </>}</section>}

            <div className="shop-layout">
                <aside className="shop-filters">
                    <div className="shop-filter-head"><strong>Department</strong><button onClick={() => { setSelectedCategory('ALL'); setSelectedVerification('ALL'); }}>Clear</button></div>
                    <div className="shop-filter-group">{categories.map(({ id, label, Icon }) => <button key={id} onClick={() => setSelectedCategory(id)} className={selectedCategory === id ? 'selected' : ''}><Icon size={16} />{label}{selectedCategory === id && <Check size={14} />}</button>)}</div>
                    <div className="shop-filter-divider" />
                    <strong className="shop-filter-label">Product passport</strong>
                    <div className="shop-filter-group">
                        {[['ALL', 'Any verification'], ['PROFESSIONALLY_INSPECTED', 'Professionally inspected'], ['OWNERSHIP_VERIFIED', 'Ownership evidence'], ['IDENTITY_VERIFIED', 'Identity recorded'], ['SELLER_REPORTED', 'Seller reported']].map(([id, label]) => <button key={id} onClick={() => setSelectedVerification(id)} className={selectedVerification === id ? 'selected' : ''}><span className={`shop-radio ${selectedVerification === id ? 'checked' : ''}`} />{label}</button>)}
                    </div>
                    <div className="shop-filter-note"><ShieldCheck size={16} /><span>Passport claims can be reviewed before you contact a seller.</span></div>
                </aside>

                <section className="shop-results">
                    <div className="shop-results-toolbar"><div><strong>{filteredListings.length} results</strong><span> for products with a passport</span></div><label>Sort by <span className="shop-sort-select"><select value={sortBy} onChange={event => setSortBy(event.target.value as typeof sortBy)}><option value="NEWEST">Featured</option><option value="PRICE_LOW">Price: Low to High</option><option value="PRICE_HIGH">Price: High to Low</option></select><ChevronDown size={14} /></span></label></div>
                    <div className="shop-active-search"><Search size={15} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Filter these results" aria-label="Filter marketplace results" />{search && <button onClick={() => setSearch('')}>Clear</button>}</div>

                    {filteredListings.length ? <div className="shop-product-grid">{filteredListings.map(listing => <ProductCardZayq key={listing.id} listing={listing} passport={passportsMap.get(listing.passportId)} onViewDetail={id => onNavigate('listing-detail', id)} onViewPassport={id => onNavigate('passport-detail', id)} />)}</div> : <div className="shop-empty"><Search size={26} /><h2>No products match those filters</h2><p>Try another search or clear the selected filters.</p><button onClick={() => { setSearch(''); setSelectedCategory('ALL'); setSelectedVerification('ALL'); }}>Clear all filters</button></div>}
                    <p className="shop-demo-note">Demo records stay in this browser. Wallet-signed listings sync through the API after seller approval; checkout and INR payments are not connected.</p>
                </section>
            </div>
        </div>
    );
};
