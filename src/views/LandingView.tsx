import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Search, Shield, Sparkles } from 'lucide-react';
import { AppStore } from '../core/store';
import { ProductCardZayq } from '../components/ProductCardZayq';

interface Props {
    onNavigate: (view: string, param?: string) => void;
}

export const LandingView: React.FC<Props> = ({ onNavigate }) => {
    const [searchInput, setSearchInput] = useState('');
    const passports = AppStore.getPassports();
    const listings = AppStore.getListings();
    const passportsMap = new Map(passports.map((passport) => [passport.passportId, passport]));
    const featuredListing = listings[0];
    const featuredPassport = featuredListing ? passportsMap.get(featuredListing.passportId) : undefined;

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (searchInput.trim()) onNavigate('passport-detail', searchInput.trim().toUpperCase());
    };

    return (
        <div className="storefront -mt-24 bg-[#F7F4F2] pb-20 text-[#1A1A1A]">
            <section className="relative flex min-h-[620px] items-end overflow-hidden bg-[#3D1A12] sm:min-h-[680px]">
                {featuredPassport?.imageUrl && <img src={featuredPassport.imageUrl} alt={featuredListing?.title || 'Featured verified device'} loading="eager" className="absolute inset-0 h-full w-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-14 pt-40 text-white sm:px-10 sm:pb-20 lg:px-16">
                    <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80"><span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" /> A considered second life</p>
                    <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] sm:text-7xl lg:text-[88px]">Good things<br /><span className="text-[#E8C985]">deserve a second life.</span></h1>
                    <p className="mt-6 max-w-md text-sm leading-6 text-white/80 sm:text-base">Remarkable devices, with their real story attached. Shop pre-owned tech backed by a history you can verify.</p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <button onClick={() => onNavigate('marketplace')} className="inline-flex h-12 items-center gap-8 bg-[#3D1A12] px-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#26100B]">Shop verified devices <ArrowRight size={16} /></button>
                        <button onClick={() => onNavigate('create-passport')} className="inline-flex h-12 items-center gap-2 border border-white/60 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#1A1A1A]"><Sparkles size={14} /> Create a passport</button>
                    </div>
                    {featuredListing && <button onClick={() => onNavigate('listing-detail', featuredListing.id)} className="mt-12 flex items-center gap-3 text-left text-xs text-white/75 transition-colors hover:text-white"><span className="h-px w-8 bg-white/60" /><span>Featured: {featuredListing.title}</span></button>}
                </div>
            </section>

            <section className="mx-auto max-w-[1440px] px-6 py-5 sm:px-10 lg:px-16">
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 border-b border-[#E5DFD9] pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-sm"><Shield size={17} className="text-[#3D1A12]" /><span className="font-semibold">Every listing comes with its own product passport.</span><span className="hidden text-[#8C6D58] md:inline">Identity, care and ownership history. On record.</span></div>
                    <div className="flex w-full max-w-md items-center border-b border-[#C9BDB5] focus-within:border-[#3D1A12]">
                        <Search size={16} className="shrink-0 text-[#8C6D58]" />
                        <input type="text" placeholder="Look up a passport ID" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#A0958C]" />
                        <button type="submit" className="py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#3D1A12]">Verify</button>
                    </div>
                </form>
            </section>

            <section className="mx-auto max-w-[1440px] space-y-7 px-6 pb-16 pt-10 sm:px-10 sm:pt-14 lg:px-16">
                <div className="flex items-end justify-between gap-4"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6D58]">Curated selection</p><h2 className="font-display text-3xl font-semibold sm:text-4xl">Latest finds</h2></div><button onClick={() => onNavigate('marketplace')} className="inline-flex shrink-0 items-center gap-2 border-b border-[#3D1A12] pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#3D1A12]">View all <ArrowRight size={13} /></button></div>
                <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                    {listings.slice(0, 3).map((listing) => <ProductCardZayq key={listing.id} listing={listing} passport={passportsMap.get(listing.passportId)} onViewDetail={(id) => onNavigate('listing-detail', id)} onViewPassport={(id) => onNavigate('passport-detail', id)} />)}
                </div>
            </section>

            <section className="mx-auto grid max-w-[1440px] gap-10 border-y border-[#E5DFD9] px-6 py-12 sm:px-10 md:grid-cols-[1fr_2fr] md:items-center lg:px-16">
                <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6D58]">A little more certainty</p><h2 className="max-w-sm font-display text-3xl font-semibold leading-tight sm:text-4xl">Know the story behind your next device.</h2></div>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="border-t border-[#C9BDB5] pt-4"><CheckCircle2 size={16} className="mb-4 text-[#3D1A12]" /><h3 className="text-sm font-semibold">Identity that stays</h3><p className="mt-2 text-xs leading-5 text-[#5A4D44]">A unique passport follows each device through every owner.</p></div>
                    <div className="border-t border-[#C9BDB5] pt-4"><Shield size={16} className="mb-4 text-[#3D1A12]" /><h3 className="text-sm font-semibold">Care, on record</h3><p className="mt-2 text-xs leading-5 text-[#5A4D44]">Repairs and inspections are attached to the product history.</p></div>
                    <div className="border-t border-[#C9BDB5] pt-4"><Lock size={16} className="mb-4 text-[#3D1A12]" /><h3 className="text-sm font-semibold">Protected handover</h3><p className="mt-2 text-xs leading-5 text-[#5A4D44]">Escrow keeps payment secure until the device is received.</p></div>
                </div>
            </section>
        </div>
    );
};