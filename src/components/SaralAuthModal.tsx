import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, Shield, User as UserIcon, Sparkles } from 'lucide-react';
import { User } from '../types';
import { MSTSaralProvider } from '../core/mst/saral';
import { CURRENT_USER, DEMO_BUYER, DEMO_SERVICE_CENTER, DEMO_INSPECTOR } from '../core/store';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    onSelectUser: (user: User) => void;
}

export const SaralAuthModal: React.FC<Props> = ({ isOpen, onClose, currentUser, onSelectUser }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleCustomSaralLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;
        setLoading(true);

        const provider = new MSTSaralProvider();
        const newUser = await provider.authenticateUser(email, name);
        setLoading(false);
        onSelectUser(newUser);
        onClose();
    };

    const presetUsers = [
        { user: CURRENT_USER, badge: 'Seller (Owner #1)', desc: 'Arjun Mehta - Holds MacBook Air M3' },
        { user: DEMO_BUYER, badge: 'Buyer (Owner #2)', desc: 'Priya Verma - Purchasing via Escrow' },
        { user: DEMO_SERVICE_CENTER, badge: 'Authorized Service Center', desc: 'iCare Tech - Attests Battery Repairs' },
        { user: DEMO_INSPECTOR, badge: 'Hardware Inspector', desc: 'TechCert Labs - Performs 42-point checks' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="zayq-modal rounded-2xl max-w-lg w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                    <X size={18} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <KeyRound size={22} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white font-sans">SARAL Onboarding</h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                Keyless Web3 Identity
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">Simplified Web2-to-MST DID Derivation Layer</p>
                    </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 mb-5">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
                        <Sparkles size={14} />
                        <span>Zero Crypto Friction</span>
                    </div>
                    No seed phrases, raw private keys, or gas fees required for everyday users. SARAL automatically derives an MST Decentralized Identity (<span className="font-mono text-cyan-400">did:mst:saral:...</span>).
                </div>

                {/* Quick Identity Switcher for Demo */}
                <div className="space-y-2 mb-5">
                    <span className="text-xs font-semibold text-slate-300 block">Switch Active Demo Role:</span>
                    {presetUsers.map(({ user, badge, desc }) => (
                        <button
                            key={user.id}
                            onClick={() => {
                                onSelectUser(user);
                                onClose();
                            }}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${currentUser.id === user.id
                                    ? 'bg-cyan-950/60 border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold border border-slate-700">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs text-white">{user.name}</span>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                                            {badge}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.mstIdentityDid}</p>
                                </div>
                            </div>

                            {currentUser.id === user.id && (
                                <CheckCircle2 size={16} className="text-cyan-400" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Or Custom Login */}
                <form onSubmit={handleCustomSaralLogin} className="border-t border-slate-800/80 pt-4 space-y-3">
                    <span className="text-xs font-semibold text-slate-300 block">Or Derivate Custom SARAL DID:</span>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email || !name}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>Derive SARAL MST Identity</span>
                    </button>
                </form>
            </div>
        </div>
    );
};
