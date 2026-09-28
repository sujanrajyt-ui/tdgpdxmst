import React, { useState, useEffect } from 'react';
import { User, ProductPassport } from './types';
import { CURRENT_USER, DEMO_BUYER, DEMO_SERVICE_CENTER, AppStore } from './core/store';
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

import { Sparkles, ArrowRight, ShieldCheck, Wrench, ArrowRightLeft, Cpu, CheckCircle2, Play, Pause, RotateCcw } from 'lucide-react';

export function App() {
    const [currentView, setCurrentView] = useState<string>('landing');
    const [viewParam, setViewParam] = useState<string | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);

    // Modals
    const [mstExplorerOpen, setMstExplorerOpen] = useState(false);
    const [selectedTxHash, setSelectedTxHash] = useState<string | undefined>(undefined);
    const [saralModalOpen, setSaralModalOpen] = useState(false);

    // Killer Demo State
    const [killerDemoActive, setKillerDemoActive] = useState(false);
    const [demoStep, setDemoStep] = useState<number>(0);
    const [autoPlayDemo, setAutoPlayDemo] = useState<boolean>(false);

    const handleNavigate = (view: string, param?: string) => {
        setCurrentView(view);
        setViewParam(param);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenMSTExplorer = (txHash?: string) => {
        setSelectedTxHash(txHash);
        setMstExplorerOpen(true);
    };

    // Killer Demo Sequence Steps Configuration
    const killerDemoSteps = [
        {
            title: 'Step 1: Product Passport Creation',
            desc: 'Owner #1 (Arjun Mehta) registers MacBook Air M3 with serial C02HK928M3XX. System computes WASMify invoice hash & anchors identity on MST L1.',
            action: () => {
                setCurrentUser(CURRENT_USER);
                handleNavigate('passport-detail', 'PP-82941');
            }
        },
        {
            title: 'Step 2: OEM Service Center Attestation',
            desc: 'Authorized Service Center (iCare Tech) appends genuine OEM battery replacement record, anchored on MST ServiceRegistry.',
            action: () => {
                setCurrentUser(DEMO_SERVICE_CENTER);
                handleNavigate('service-portal', 'PP-82941');
            }
        },
        {
            title: 'Step 3: Trusted Marketplace Listing',
            desc: 'MacBook Air M3 listed on marketplace with verified repair history, ownership badges, and 0 NFC reliance.',
            action: () => {
                handleNavigate('listing-detail', 'LISTING-101');
            }
        },
        {
            title: 'Step 4: Dual Confirmation & Ownership Transfer',
            desc: 'Buyer (Priya Verma) deposits escrow. Dual handover codes executed on MST OwnershipRegistry smart contract.',
            action: () => {
                setCurrentUser(DEMO_BUYER);
                handleNavigate('escrow-handover', 'LISTING-101');
            }
        },
        {
            title: 'Step 5: Passport Identity Survival',
            desc: 'Passport PP-82941 updated with Owner #2 (Priya Verma). 100% history preserved across ownership change.',
            action: () => {
                setCurrentUser(DEMO_BUYER);
                handleNavigate('passport-detail', 'PP-82941');
            }
        }
    ];

    const startKillerDemo = () => {
        setKillerDemoActive(true);
        setDemoStep(0);
        killerDemoSteps[0].action();
    };

    const nextDemoStep = () => {
        const next = Math.min(killerDemoSteps.length - 1, demoStep + 1);
        setDemoStep(next);
        killerDemoSteps[next].action();
    };

    const prevDemoStep = () => {
        const prev = Math.max(0, demoStep - 1);
        setDemoStep(prev);
        killerDemoSteps[prev].action();
    };

    // Render view router
    const renderView = () => {
        switch (currentView) {
            case 'landing':
                return (
                    <LandingView
                        onNavigate={handleNavigate}
                        onStartKillerDemo={startKillerDemo}
                        onOpenMSTExplorer={() => handleOpenMSTExplorer()}
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
            default:
                return (
                    <LandingView
                        onNavigate={handleNavigate}
                        onStartKillerDemo={startKillerDemo}
                        onOpenMSTExplorer={() => handleOpenMSTExplorer()}
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
                onOpenMSTExplorer={() => handleOpenMSTExplorer()}
                onStartKillerDemo={startKillerDemo}
            />

            {/* Killer Demo Persistent Floating Control Overlay */}
            {killerDemoActive && (
                <div className="fixed bottom-6 right-6 z-40 zayq-glass border-2 border-cyan-500 rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.4)] max-w-sm w-full space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold border border-cyan-500/40">
                                {demoStep + 1}
                            </div>
                            <h4 className="text-xs font-extrabold text-white font-sans">Killer Demo Guide</h4>
                        </div>
                        <button
                            onClick={() => setKillerDemoActive(false)}
                            className="text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-slate-800"
                        >
                            Close Overlay
                        </button>
                    </div>

                    <div className="space-y-1">
                        <h5 className="text-xs font-bold text-cyan-300 font-sans">{killerDemoSteps[demoStep].title}</h5>
                        <p className="text-[11px] text-slate-300 font-mono leading-tight">{killerDemoSteps[demoStep].desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                        <button
                            onClick={prevDemoStep}
                            disabled={demoStep === 0}
                            className="text-slate-400 hover:text-white disabled:opacity-30 font-mono"
                        >
                            ← Prev Step
                        </button>

                        <span className="text-[10px] text-slate-500 font-mono">
                            Step {demoStep + 1} of {killerDemoSteps.length}
                        </span>

                        <button
                            onClick={nextDemoStep}
                            disabled={demoStep === killerDemoSteps.length - 1}
                            className="text-cyan-400 hover:text-cyan-300 font-bold font-mono disabled:opacity-30"
                        >
                            Next Step →
                        </button>
                    </div>
                </div>
            )}

            {/* Main View Render */}
            <main className="pt-24 min-h-[calc(100vh-200px)]">
                {renderView()}
            </main>

            {/* Global Footer */}
            <Footer
                onNavigate={handleNavigate}
                onOpenMSTExplorer={() => handleOpenMSTExplorer()}
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
