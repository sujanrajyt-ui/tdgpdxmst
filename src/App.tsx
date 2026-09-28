import React, { useState } from 'react';
import { User, ProductPassport } from './types';
import { CURRENT_USER, AppStore } from './core/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MSTExplorerModal } from './components/MSTExplorerModal';
import { SaralAuthModal } from './components/SaralAuthModal';

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
import { MSTEcosystemView } from './views/MSTEcosystemView';

export function App() {
    const [currentView, setCurrentView] = useState<string>('landing');
    const [viewParam, setViewParam] = useState<string | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);

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
            case 'mst-ecosystem':
                return (
                    <MSTEcosystemView
                        onNavigate={handleNavigate}
                        onOpenExplorer={() => handleOpenMSTExplorer()}
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
        <div className="light-app min-h-screen bg-[#f4f2ec] font-sans text-[#171815] selection:bg-[#d6ed73] selection:text-[#171815]">
            {/* Global Navigation Bar */}
            <Navbar
                currentView={currentView}
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenSaralModal={() => setSaralModalOpen(true)}
            />

            {/* Main View Render */}
            <main className="pt-24 min-h-[calc(100vh-200px)]">
                {renderView()}
            </main>

            {/* Global Footer */}
            <Footer
                onNavigate={handleNavigate}
            />

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
            />
        </div>
    );
}
