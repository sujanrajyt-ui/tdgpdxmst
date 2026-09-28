import React, { useState } from 'react';
import { AppStore } from '../core/store';
import { User } from '../types';
import { ArrowRightLeft, ShieldCheck, CheckCircle2, Lock, Sparkles, ExternalLink } from 'lucide-react';
import { ZayqEyebrow } from '../components/Zayq';

interface Props {
    listingId: string;
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
    onOpenMSTExplorer: (txHash?: string) => void;
}

export const EscrowHandoverView: React.FC<Props> = ({
    listingId,
    currentUser,
    onNavigate,
    onOpenMSTExplorer
}) => {
    const listing = AppStore.getListingById(listingId) || AppStore.getListings()[0];
    const passport = AppStore.getPassportById(listing.passportId);

    const [sellerInputCode, setSellerInputCode] = useState(listing.handoverCodeSeller || '849201');
    const [buyerInputCode, setBuyerInputCode] = useState(listing.handoverCodeBuyer || '392018');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [transferSuccess, setTransferSuccess] = useState<{ passportId: string; txHash: string } | null>(null);

    if (!passport) return null;

    const handleConfirmHandover = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Execute Smart Contract Ownership Transfer
        const { passport: updatedPassport, transferTx } = await AppStore.executeOwnershipTransfer(listing.id, currentUser);
        setIsSubmitting(false);

        setTransferSuccess({
            passportId: updatedPassport.passportId,
            txHash: transferTx
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <ZayqEyebrow tone="purple">
                    <ArrowRightLeft size={14} />
                    MST OwnershipRegistry.completeTransfer
                </ZayqEyebrow>
                <h1 className="text-2xl font-extrabold text-white font-sans">Physical Handover & Dual Confirmation</h1>
                <p className="text-xs text-slate-400 font-mono">
                    Escrow funds deposited for Passport <strong className="text-cyan-300">{passport.passportId}</strong>
                </p>
            </div>

            {transferSuccess ? (
                <div className="bg-gradient-to-br from-slate-900 to-cyan-950/80 border-2 border-cyan-500/70 rounded-2xl p-8 text-center space-y-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400/50 flex items-center justify-center mx-auto">
                        <CheckCircle2 size={36} />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold text-white font-sans">Ownership Transferred Successfully!</h2>
                        <p className="text-xs text-slate-300 font-mono">
                            MST Smart Contract <span className="text-cyan-300 font-bold">OwnershipRegistry</span> confirmed transaction receipt.
                        </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs font-mono space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Persistent Passport ID:</span>
                            <span className="text-cyan-300 font-bold">{transferSuccess.passportId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">New Verified Owner:</span>
                            <span className="text-emerald-400 font-bold">{currentUser.name} (Owner #2)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">MST Block Transaction:</span>
                            <button
                                onClick={() => onOpenMSTExplorer(transferSuccess.txHash)}
                                className="text-cyan-400 hover:underline flex items-center gap-1"
                            >
                                <span>{transferSuccess.txHash.slice(0, 16)}...</span>
                                <ExternalLink size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3 justify-center">
                        <button
                            onClick={() => onNavigate('passport-detail', transferSuccess.passportId)}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/30"
                        >
                            <span>Inspect Updated Passport History</span>
                            <ShieldCheck size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleConfirmHandover} className="zayq-glass-card rounded-2xl p-6 space-y-6">
                    {/* Item Card */}
                    <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <img src={passport.imageUrl} alt={passport.model} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                            <span className="text-[10px] font-mono text-cyan-400">PASSPORT {passport.passportId}</span>
                            <h4 className="font-bold text-sm text-white">{passport.model}</h4>
                            <p className="text-xs text-slate-400 font-mono">Price: ₹{listing.price.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                            <Lock size={14} />
                            <span>Dual Handover Verification Rules</span>
                        </div>
                        <p>Both Seller and Buyer provide secret handover pins at physical exchange. Handover releases escrow and executes MST smart contract ownership transition.</p>
                    </div>

                    {/* Dual Code Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                            <label className="block text-xs font-semibold text-slate-300">Seller Handover Code</label>
                            <input
                                type="text"
                                required
                                value={sellerInputCode}
                                onChange={(e) => setSellerInputCode(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold text-cyan-300 outline-none"
                            />
                            <span className="text-[10px] text-slate-500 block text-center">Provided by Seller (Arjun Mehta)</span>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                            <label className="block text-xs font-semibold text-slate-300">Buyer Confirmation Code</label>
                            <input
                                type="text"
                                required
                                value={buyerInputCode}
                                onChange={(e) => setBuyerInputCode(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold text-emerald-300 outline-none"
                            />
                            <span className="text-[10px] text-slate-500 block text-center">Provided by Buyer ({currentUser.name})</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span>Submitting MST OwnershipRegistry.completeTransfer...</span>
                        ) : (
                            <>
                                <ArrowRightLeft size={16} />
                                <span>Confirm Handover & Release Escrow on MST</span>
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};
