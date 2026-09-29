import React, { useState, useEffect } from 'react';
import { User, ProductPassport } from './types';
import { AppStore } from './core/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MSTExplorerModal } from './components/MSTExplorerModal';
import { SaralAuthModal } from './components/SaralAuthModal';
import { getWalletSession, type ApiUser } from './core/api';

import { LandingView } from './views/LandingView';
import { UserDashboardView } from './views/UserDashboardView';
import { CreatePassportView } from './views/CreatePassportView';
import { PassportDetailView } from './views/PassportDetailView';
import { MarketplaceView } from './views/MarketplaceView';
import { ListingDetailView } from './views/ListingDetailView';
import { EscrowHandoverView } from './views/EscrowHandoverView';
import { ServicePortalView } from './views/ServicePortalView';
import { AdminConsoleView } from './views/AdminConsoleView';
import { StolenDisputeView } from './views/StolenDisputeView';


const LOCAL_GUEST: User = {
    id: 'LOCAL-GUEST',
    name: 'Marketplace Guest',
    email: '',
    role: 'CONSUMER',
    mstIdentityDid: 'did:mst:local:guest',
    saralVerified: false,
    reputationScore: 0,
};

export function App() {
    const [currentView, setCurrentView] = useState<string>('landing');
    const [viewParam, setViewParam] = useState<string | undefined>(undefined);
    const [, setStoreRevision] = useState(0);
    const [currentUser, setCurrentUser] = useState<User>(() => {
        try {
            const savedUser = localStorage.getItem('passport-marketplace-user');
            if (!savedUser) return LOCAL_GUEST;
            const user = JSON.parse(savedUser) as User;
            if (['ADMIN', 'SERVICE_CENTER', 'INSPECTOR'].includes(user.role)) return LOCAL_GUEST;
            return { ...user, role: 'CONSUMER' };
        } catch {
            return LOCAL_GUEST;
        }
    });

    useEffect(() => {
        let active = true;
        getWalletSession().then(account => {
            if (!active) return;
            if (account) setCurrentUser(userFromApiAccount(account));
            void AppStore.syncFromApi(account?.walletAddress).then(() => { if (active) setStoreRevision(revision => revision + 1); });
        });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('passport-marketplace-user', JSON.stringify(currentUser));
            if (currentUser.walletAddress) {
                const saved = localStorage.getItem('passport-marketplace-wallet-profiles');
                const profiles = saved ? JSON.parse(saved) as Record<string, User> : {};
                profiles[currentUser.walletAddress.toLowerCase()] = currentUser;
                localStorage.setItem('passport-marketplace-wallet-profiles', JSON.stringify(profiles));
            }
        } catch (error) {
            console.warn('Could not save the local profile in this browser.', error);
        }
    }, [currentUser]);

    // Modals
    const [mstExplorerOpen, setMstExplorerOpen] = useState(false);
    const [selectedTxHash, setSelectedTxHash] = useState<string | undefined>(undefined);
    const [saralModalOpen, setSaralModalOpen] = useState(false);

    const handleNavigate = (view: string, param?: string) => {
        setCurrentView(view);
        setViewParam(param);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenMSTExplorer = (txHash?: string) => {
        setSelectedTxHash(txHash);
        setMstExplorerOpen(true);
    };

    const handleWalletConnected = (address: string, account?: ApiUser) => {
        const key = address.toLowerCase();
        if (account) {
            setCurrentUser(userFromApiAccount(account));
            void AppStore.syncFromApi(account.walletAddress).then(() => setStoreRevision(revision => revision + 1));
            window.dispatchEvent(new CustomEvent('mst-wallet-connected', { detail: address }));
            return;
        }
        try {
            const saved = localStorage.getItem('passport-marketplace-wallet-profiles');
            const profiles = saved ? JSON.parse(saved) as Record<string, User> : {};
            const profile = profiles[key] || {
                id: `MST-${key}`,
                name: `MST user ${address.slice(-4)}`,
                email: '',
                role: 'CONSUMER' as const,
                mstIdentityDid: `did:mst:wallet:${key}`,
                saralVerified: false,
                reputationScore: 0,
                walletAddress: address,
            };
            setCurrentUser({ ...profile, role: 'CONSUMER', walletAddress: address });
            window.dispatchEvent(new CustomEvent('mst-wallet-connected', { detail: address }));
        } catch {
            setCurrentUser({
                ...LOCAL_GUEST,
                id: `MST-${key}`,
                name: `MST user ${address.slice(-4)}`,
                mstIdentityDid: `did:mst:wallet:${key}`,
                walletAddress: address,
            });
        }
    };

    // Render view router
    const renderView = () => {
        switch (currentView) {
            case 'landing':
                return (
                    <LandingView
                        onNavigate={handleNavigate}
                    />
                );
            case 'dashboard':
                return <UserDashboardView currentUser={currentUser} onNavigate={handleNavigate} />;
            case 'create-passport':
                return <CreatePassportView currentUser={currentUser} onNavigate={handleNavigate} />;
            case 'passport-detail':
                return (
                    <PassportDetailView
                        passportId={viewParam || 'PP-82941'}
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onOpenMSTExplorer={handleOpenMSTExplorer}
                    />
                );
            case 'marketplace':
            case 'create-listing':
                return (
                    <MarketplaceView
                        onNavigate={handleNavigate}
                        currentUser={currentUser}
                        listPassportId={currentView === 'create-listing' ? viewParam : undefined}
                        initialSearchQuery={currentView === 'marketplace' ? viewParam : undefined}
                    />
                );
            case 'listing-detail':
                return (
                    <ListingDetailView
                        listingId={viewParam || 'LISTING-101'}
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                    />
                );
            case 'escrow-handover':
                return (
                    <EscrowHandoverView
                        listingId={viewParam || 'LISTING-101'}
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onOpenMSTExplorer={handleOpenMSTExplorer}
                    />
                );
            case 'service-portal':
                return (
                    <ServicePortalView
                        passportIdParam={viewParam}
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onOpenMSTExplorer={handleOpenMSTExplorer}
                    />
                );
            case 'admin-console':
                return (
                    <AdminConsoleView
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onOpenMSTExplorer={() => handleOpenMSTExplorer()}
                    />
                );
            case 'stolen-dispute':
                return (
                    <StolenDisputeView
                        passportIdParam={viewParam}
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onOpenMSTExplorer={handleOpenMSTExplorer}
                    />
                );
            default:
                return (
                    <LandingView
                        onNavigate={handleNavigate}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
            {/* Global Navigation Bar */}
            <Navbar
                currentView={currentView}
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenSaralModal={() => setSaralModalOpen(true)}
                onWalletConnected={handleWalletConnected}
            />

            {/* Main View Render */}
            <main className="app-main pt-[104px] min-h-[calc(100vh-200px)]">
                {renderView()}
            </main>

            {/* Global Footer */}
            <Footer />

            {/* MST Explorer Modal */}
            <MSTExplorerModal
                isOpen={mstExplorerOpen}
                onClose={() => setMstExplorerOpen(false)}
                initialTxHash={selectedTxHash}
            />

            {/* SARAL Identity Modal */}
            <SaralAuthModal
                isOpen={saralModalOpen}
                onClose={() => setSaralModalOpen(false)}
                currentUser={currentUser}
                onSelectUser={(user) => setCurrentUser(user)}
                onWalletConnected={handleWalletConnected}
            />
        </div>
    );
}

function userFromApiAccount(account: ApiUser): User {
    return {
        id: account.id,
        name: account.name || `MST user ${account.walletAddress.slice(-4)}`,
        email: '',
        role: account.role,
        mstIdentityDid: `did:mst:wallet:${account.walletAddress.toLowerCase()}`,
        saralVerified: false,
        reputationScore: 0,
        walletAddress: account.walletAddress,
        sellerStatus: account.sellerStatus,
    };
}
