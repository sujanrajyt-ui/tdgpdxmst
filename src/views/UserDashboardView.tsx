import React, { useState } from 'react';
import { User, ProductPassport, MarketplaceListing } from '../types';
import { AppStore } from '../core/store';
import { VerificationBadge } from '../components/VerificationBadge';
import { StatusBadge } from '../components/StatusBadge';
import { PlusCircle, Shield, Store, ArrowRightLeft, AlertOctagon, KeyRound } from 'lucide-react';
import { applyToSell } from '../core/api';

interface Props {
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
}

export const UserDashboardView: React.FC<Props> = ({ currentUser, onNavigate }) => {
    const [businessName, setBusinessName] = useState('');
    const [sellerMessage, setSellerMessage] = useState('');
    const [sellerBusy, setSellerBusy] = useState(false);
    const [applicationPending, setApplicationPending] = useState(currentUser.sellerStatus === 'PENDING');
    const passports = AppStore.getPassports().filter(p => p.currentOwnerId === currentUser.id);
    const listings = AppStore.getListings().filter(l => l.sellerId === currentUser.id);
    const pendingTransfers = AppStore.getListings().filter(
        l => (l.sellerId === currentUser.id || l.buyerId === currentUser.id) && l.status === 'PENDING_TRANSFER'
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="zayq-glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-cyan-400/40">
                        {currentUser.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-white font-sans">{currentUser.name}</h1>
                            <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono px-2.5 py-0.5 rounded-full">
                                SARAL Verified
                            </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 mt-1">{currentUser.mstIdentityDid}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onNavigate('create-passport')}
                        className="zayq-btn-primary flex items-center gap-1.5"
                    >
                        <PlusCircle size={15} />
                        <span>Register New Passport</span>
                    </button>
                </div>
            </div>

            {currentUser.role === 'CONSUMER' && currentUser.walletAddress && currentUser.sellerStatus !== 'APPROVED' && <section className="zayq-glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2"><Store size={18} className="text-cyan-700" /><h2 className="font-bold">Seller account</h2></div>
                {applicationPending || currentUser.sellerStatus === 'PENDING' ? <p className="text-sm text-slate-600">Your seller application is waiting for admin review.</p> : <form className="flex flex-col sm:flex-row gap-3" onSubmit={async event => {
                    event.preventDefault();
                    setSellerMessage('');
                    setSellerBusy(true);
                    try {
                        await applyToSell(businessName.trim() || 'Individual seller');
                        setApplicationPending(true);
                        setSellerMessage('Application submitted. An admin must approve the seller account before listings go live.');
                    } catch (error) {
                        setSellerMessage(error instanceof Error ? error.message : 'Could not submit the application. Sign in to the marketplace API first.');
                    } finally { setSellerBusy(false); }
                }}>
                    <label className="flex-1 text-sm">Business name <span className="text-slate-500">(optional for individual sellers)</span><input className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" value={businessName} onChange={event => setBusinessName(event.target.value)} maxLength={120} placeholder="Your shop or seller name" /></label>
                    <button disabled={sellerBusy} className="zayq-btn-primary self-end">{sellerBusy ? 'Sending…' : 'Apply to sell'}</button>
                </form>}
                {sellerMessage && <p role="status" className="text-sm text-slate-600">{sellerMessage}</p>}
            </section>}

            {/* Pending Escrow Transfer Action Banner */}
            {pendingTransfers.length > 0 && (
                <div className="bg-gradient-to-r from-purple-950/80 to-slate-900 border-2 border-purple-500/50 rounded-2xl p-5 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/40">
                            <ArrowRightLeft size={22} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">Pending Handover & Ownership Transfer</h3>
                            <p className="text-xs text-slate-300">
                                You have {pendingTransfers.length} item(s) awaiting dual confirmation & MST ownership anchor.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onNavigate('escrow-handover', pendingTransfers[0].id)}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 shadow-lg shadow-purple-900/30"
                    >
                        Execute Handover Transfer
                    </button>
                </div>
            )}

            {/* User's Owned Passports */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                        <Shield size={18} className="text-cyan-400" />
                        <span>My Product Passports ({passports.length})</span>
                    </h2>
                </div>

                {passports.length === 0 ? (
                    <div className="zayq-glass-card rounded-2xl p-12 text-center text-slate-400 space-y-3">
                        <Shield size={36} className="mx-auto text-slate-600" />
                        <p className="text-sm font-medium">You don't own any active Product Passports yet.</p>
                        <button
                            onClick={() => onNavigate('create-passport')}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5"
                        >
                            <PlusCircle size={15} />
                            <span>Create Passport Now</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {passports.map((p) => (
                            <div
                                key={p.passportId}
                                className="zayq-glass-card rounded-xl p-4 flex gap-4 hover:border-cyan-500/50 transition-all cursor-pointer group"
                                onClick={() => onNavigate('passport-detail', p.passportId)}
                            >
                                <img
                                    src={p.imageUrl}
                                    alt={p.model}
                                    className="w-24 h-24 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                                />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[9px] font-mono text-cyan-400 uppercase">{p.passportId}</span>
                                            <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 line-clamp-1">{p.model}</h3>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5 flex-wrap">
                                        <VerificationBadge level={p.verificationLevel} size="sm" />
                                        <StatusBadge status={p.currentStatus} size="sm" />
                                    </div>

                                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                                        <span>{p.ownershipHistory.length} owner record{p.ownershipHistory.length === 1 ? '' : 's'} · {p.serviceRecords.length} service record{p.serviceRecords.length === 1 ? '' : 's'}</span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {['ACTIVE', 'RECOVERED'].includes(p.currentStatus) && !AppStore.getListings().some(listing => listing.passportId === p.passportId && ['PENDING_REVIEW', 'ACTIVE', 'PENDING_TRANSFER'].includes(listing.status)) && <button
                                                onClick={event => { event.stopPropagation(); onNavigate('create-listing', p.passportId); }}
                                                className="rounded-full bg-amber-100 px-2.5 py-1 font-sans text-[10px] font-bold text-amber-900 hover:bg-amber-200"
                                            >List for sale</button>}
                                            <span className="text-cyan-400 group-hover:underline">Open passport →</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* User's Listings */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                    <Store size={18} className="text-cyan-400" />
                    <span>My Marketplace Listings ({listings.length})</span>
                </h2>

                {listings.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No active listings created.</p>
                ) : (
                    <div className="space-y-3">
                                {listings.map((l) => (
                            <div key={l.id} className="zayq-glass-card rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm text-white">{l.title}</h4>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                                        Passport {l.passportId} • Listed at ₹{l.price.toLocaleString()} • {l.location}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/30 font-bold">
                                        {l.status}
                                    </span>
                                    {l.status === 'ACTIVE' && l.sellerId === currentUser.id && <button
                                        onClick={async (event) => {
                                            event.stopPropagation();
                                            await AppStore.cancelListing(l.id, currentUser);
                                            onNavigate('dashboard');
                                        }}
                                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-3 py-1.5 rounded-lg transition-colors"
                                    >Cancel listing</button>}
                                    <button
                                        onClick={() => onNavigate('listing-detail', l.id)}
                                        className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        View Listing
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
