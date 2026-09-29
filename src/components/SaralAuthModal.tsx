import React, { useEffect, useState } from 'react';
import { X, Wallet, UserRound, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { connectWallet } from '../core/mst/wallet';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    onSelectUser: (user: User) => void;
    onWalletConnected: (address: string) => void;
}

export const SaralAuthModal: React.FC<Props> = ({ isOpen, onClose, currentUser, onSelectUser, onWalletConnected }) => {
    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [saved, setSaved] = useState(false);
    const [connectError, setConnectError] = useState('');

    useEffect(() => {
        setName(currentUser.name);
        setEmail(currentUser.email);
        setSaved(false);
        setConnectError('');
    }, [currentUser.name, currentUser.email, isOpen]);

    if (!isOpen) return null;

    const handleSave = (event: React.FormEvent) => {
        event.preventDefault();
        const cleanedName = name.trim();
        if (!cleanedName) return;
        onSelectUser({ ...currentUser, name: cleanedName, email: email.trim() });
        setSaved(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
            <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
                <button className="profile-close" onClick={onClose} aria-label="Close profile"><X size={18} /></button>
                <div className="profile-heading"><span><UserRound size={21} /></span><div><h2 id="profile-title">Your profile</h2><p>Use one account for buying and selling.</p></div></div>

                <div className={`profile-wallet-card ${currentUser.walletAddress ? 'connected' : ''}`}>
                    <div className="profile-wallet-icon"><Wallet size={18} /></div>
                    <div className="profile-wallet-copy"><strong>{currentUser.walletAddress ? 'MST wallet linked' : 'Connect an MST wallet'}</strong><span>{currentUser.walletAddress || 'Use your wallet address as your marketplace identity.'}</span></div>
                    {currentUser.walletAddress && <CheckCircle2 size={18} className="profile-wallet-check" />}
                    {!currentUser.walletAddress && <button onClick={async () => {
                        setConnectError('');
                        try {
                            const wallet = await connectWallet();
                            if (wallet.address) onWalletConnected(wallet.address);
                        } catch (error) {
                            setConnectError(error instanceof Error ? error.message : 'Could not connect the wallet.');
                        }
                    }} className="profile-connect">Connect</button>}
                </div>

                {connectError && <p className="profile-error" role="alert">{connectError}</p>}

                <form onSubmit={handleSave} className="profile-form">
                    <label>Display name<input value={name} onChange={event => setName(event.target.value)} placeholder="Your name" required maxLength={60} /></label>
                    <label>Email <span className="profile-optional">optional</span><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                    {saved && <p className="profile-saved" role="status"><CheckCircle2 size={15} /> Profile saved in this browser.</p>}
                    <button type="submit" className="profile-save">Save profile</button>
                </form>
                <p className="profile-note">Wallet connection enables transaction approvals. This prototype keeps your profile in this browser; it does not provide shared account login yet.</p>
            </section>
        </div>
    );
};
