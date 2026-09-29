import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Tag, Wrench, AlertOctagon, User as UserIcon, Menu, X, Wallet, ChevronDown } from 'lucide-react';
import { User } from '../types';
import { AppStore } from '../core/store';
import { connectWallet, disconnectWallet, getWalletState } from '../core/mst/wallet';
import { signInWithWallet, signOutFromApi, type ApiUser } from '../core/api';

interface Props {
    currentView: string;
    onNavigate: (view: string, param?: string) => void;
    currentUser: User;
    onOpenSaralModal: () => void;
    onWalletConnected: (address: string, account?: ApiUser) => void;
}

export const Navbar: React.FC<Props> = ({ currentView, onNavigate, currentUser, onOpenSaralModal, onWalletConnected }) => {
    const [passportSearch, setPassportSearch] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [walletAddress, setWalletAddress] = useState(() => getWalletState().address);
    const [walletMessage, setWalletMessage] = useState('');
    const [walletBusy, setWalletBusy] = useState(false);

    useEffect(() => {
        const onConnected = (event: Event) => setWalletAddress((event as CustomEvent<string>).detail);
        window.addEventListener('mst-wallet-connected', onConnected);
        return () => window.removeEventListener('mst-wallet-connected', onConnected);
    }, []);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const query = passportSearch.trim();
        if (!query) return;
        if (/^PP-[\w-]+$/i.test(query)) onNavigate('passport-detail', query.toUpperCase());
        else onNavigate('marketplace', query);
        setMobileOpen(false);
    };

    const handleSell = () => {
        const ownedProducts = AppStore.getPassports().filter(passport => passport.currentOwnerId === currentUser.id);
        const availableToList = ownedProducts.filter(passport =>
            ['ACTIVE', 'RECOVERED'].includes(passport.currentStatus) &&
            !AppStore.getListings().some(listing => listing.passportId === passport.passportId && ['PENDING_REVIEW', 'ACTIVE', 'PENDING_TRANSFER'].includes(listing.status))
        );
        if (!ownedProducts.length) onNavigate('create-passport');
        else if (availableToList.length === 1) onNavigate('create-listing', availableToList[0].passportId);
        else onNavigate('dashboard');
        setMobileOpen(false);
    };

    const handleWallet = async () => {
        if (walletAddress) {
            void signOutFromApi();
            disconnectWallet();
            setWalletAddress(null);
            setWalletMessage('Wallet disconnected from this page.');
            return;
        }
        setWalletBusy(true);
        setWalletMessage('');
        try {
            const state = await connectWallet();
            setWalletAddress(state.address);
            if (state.address && state.signer) {
                try {
                    const account = await signInWithWallet(state.address, state.signer);
                    onWalletConnected(state.address, account);
                    setWalletMessage('Wallet connected and signed in. The signature did not send a transaction.');
                } catch {
                    onWalletConnected(state.address);
                    setWalletMessage('Wallet connected. Start the marketplace API to sign in across sessions.');
                }
            }
        } catch (error) {
            setWalletMessage(error instanceof Error ? error.message : 'Wallet connection failed.');
        } finally {
            setWalletBusy(false);
        }
    };

    const nav = (view: string) => {
        onNavigate(view);
        setMobileOpen(false);
    };

    return (
        <header className="market-nav fixed inset-x-0 top-0 z-50">
            <div className="market-nav-main">
                <div className="market-nav-inner">
                    <button onClick={() => nav('marketplace')} className="market-brand" aria-label="Relore home">
                        <img src="/relore-lockup.svg" alt="Relore" className="market-brand-logo" />
                    </button>

                    <form onSubmit={handleSearchSubmit} className="market-search hidden md:flex" role="search">
                        <select aria-label="Search category" defaultValue="all"><option value="all">All</option><option value="laptops">Laptops</option><option value="phones">Phones</option></select>
                        <input aria-label="Search products or passport ID" value={passportSearch} onChange={event => setPassportSearch(event.target.value)} placeholder="Search products, brands, or passport ID" />
                        <button type="submit" aria-label="Search"><Search size={21} /></button>
                    </form>

                    <nav className="market-nav-actions" aria-label="Main navigation">
                        <button onClick={handleWallet} disabled={walletBusy} className="market-wallet" title={walletMessage || 'Connect a wallet to submit real MST Testnet transactions'}>
                            <Wallet size={16} /><span>{walletBusy ? 'Connecting' : walletAddress ? `${walletAddress.slice(0, 5)}…${walletAddress.slice(-4)}` : 'Wallet'}</span>
                        </button>
                        <button onClick={() => nav('dashboard')} className="market-nav-link"><span className="market-nav-overline">Hello, {currentUser.name.split(' ')[0]}</span><strong>My products</strong><ChevronDown size={13} /></button>
                        <button onClick={handleSell} className="market-nav-link market-sell"><Tag size={16} /><strong>Sell</strong></button>
                        <button onClick={onOpenSaralModal} className="market-account" aria-label="Open profile"><UserIcon size={20} /><span>Account</span></button>
                        <button onClick={() => setMobileOpen(open => !open)} className="market-mobile-toggle" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
                    </nav>
                </div>
                <form onSubmit={handleSearchSubmit} className="market-search market-search-mobile md:hidden" role="search">
                    <input aria-label="Search products or passport ID" value={passportSearch} onChange={event => setPassportSearch(event.target.value)} placeholder="Search products or passport ID" />
                    <button type="submit" aria-label="Search"><Search size={20} /></button>
                </form>
            </div>

            <div className="market-nav-sub">
                <div className="market-nav-sub-inner">
                    <button onClick={() => setMobileOpen(open => !open)} className="market-all"><Menu size={17} /><strong>All</strong></button>
                    <button onClick={() => nav('marketplace')}>Marketplace</button>
                    <button onClick={() => nav('marketplace')}>Electronics</button>
                    <button onClick={() => nav('dashboard')}>Your products</button>
                    <button onClick={handleSell}>Sell on Passport</button>
                    {currentUser.role === 'SERVICE_CENTER' && <button onClick={() => nav('service-portal')}><Wrench size={14} /> Service center</button>}
                    {currentUser.role === 'ADMIN' && <button onClick={() => nav('admin-console')}><AlertOctagon size={14} /> Admin</button>}
                    <span className="market-nav-caption"><ShoppingBag size={14} /> Product history travels with every sale</span>
                </div>
            </div>

            {mobileOpen && <div className="market-mobile-menu">
                <button onClick={() => nav('marketplace')}>Browse marketplace</button>
                <button onClick={() => nav('dashboard')}>My products</button>
                <button onClick={handleSell}>Sell a product</button>
                <button onClick={onOpenSaralModal}>Switch account</button>
                <button onClick={handleWallet}>{walletAddress ? 'Disconnect wallet' : 'Connect MST wallet'}</button>
                {currentUser.role === 'SERVICE_CENTER' && <button onClick={() => nav('service-portal')}>Service center</button>}
                {currentUser.role === 'ADMIN' && <button onClick={() => nav('admin-console')}>Admin console</button>}
            </div>}
            {walletMessage && <div role="status" className="market-wallet-message">{walletMessage}</div>}
        </header>
    );
};
