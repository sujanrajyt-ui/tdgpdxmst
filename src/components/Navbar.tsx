import React, { useState } from 'react';
import { Shield, Search, PlusCircle, Store, Wrench, AlertOctagon, Cpu, User as UserIcon, Sparkles } from 'lucide-react';
import { User } from '../types';

interface Props {
    currentView: string;
    onNavigate: (view: string, param?: string) => void;
    currentUser: User;
    onOpenSaralModal: () => void;
    onOpenMSTExplorer: () => void;
    onStartKillerDemo: () => void;
}

export const Navbar: React.FC<Props> = ({
    currentView,
    onNavigate,
    currentUser,
    onOpenSaralModal,
    onOpenMSTExplorer,
    onStartKillerDemo
}) => {
    const [passportSearch, setPassportSearch] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passportSearch.trim()) {
            onNavigate('passport-detail', passportSearch.trim().toUpperCase());
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
            {/* Top Banner: Killer Demo trigger */}
            <div className="bg-gradient-to-r from-cyan-900/60 via-brand-900/60 to-purple-900/60 text-xs py-1.5 px-4 border-b border-cyan-500/20 text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-medium text-cyan-200">MST Network Status:</span>
                    <span className="text-slate-300">Live EVM Contract Anchoring (0x8f3A...3041)</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onStartKillerDemo}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105"
                    >
                        <Sparkles size={13} />
                        <span>Launch Killer Demo Sequence</span>
                    </button>
                    <button
                        onClick={onOpenMSTExplorer}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-xs hover:underline"
                    >
                        <Cpu size={13} />
                        <span>MST Explorer</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <div
                    onClick={() => onNavigate('landing')}
                    className="flex items-center gap-2.5 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
                        <Shield size={22} className="text-white" />
                    </div>
                    <div>
                        <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 font-sans">
                            <span>PRODUCT PASSPORT</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded font-mono font-medium">MST</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono -mt-1">Identity Network</p>
                    </div>
                </div>

                {/* Global Quick Search Passport */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm relative">
                    <input
                        type="text"
                        placeholder="Verify Passport ID (e.g. PP-82941)..."
                        value={passportSearch}
                        onChange={(e) => setPassportSearch(e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-700/70 focus:border-cyan-500/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
                    />
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                </form>

                {/* Navigation Items */}
                <nav className="flex items-center gap-1 sm:gap-2">
                    <button
                        onClick={() => onNavigate('marketplace')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currentView === 'marketplace'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                            }`}
                    >
                        <Store size={15} />
                        <span className="hidden sm:inline">Marketplace</span>
                    </button>

                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currentView === 'dashboard'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                            }`}
                    >
                        <UserIcon size={15} />
                        <span className="hidden sm:inline">My Passports</span>
                    </button>

                    <button
                        onClick={() => onNavigate('create-passport')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-900/20`}
                    >
                        <PlusCircle size={15} />
                        <span>Create Passport</span>
                    </button>

                    {/* Specialized Portals dropdown / buttons */}
                    <button
                        onClick={() => onNavigate('service-portal')}
                        className={`p-2 rounded-lg text-xs font-medium transition-all ${currentView === 'service-portal'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                            }`}
                        title="Service Center Portal"
                    >
                        <Wrench size={16} />
                    </button>

                    <button
                        onClick={() => onNavigate('admin-console')}
                        className={`p-2 rounded-lg text-xs font-medium transition-all ${currentView === 'admin-console' || currentView === 'stolen-dispute'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                            }`}
                        title="Admin & Dispute Console"
                    >
                        <AlertOctagon size={16} />
                    </button>

                    {/* SARAL Identity Selector */}
                    <div className="ml-2 pl-2 border-l border-slate-800 flex items-center">
                        <button
                            onClick={onOpenSaralModal}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-lg transition-all"
                        >
                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-xs font-medium text-slate-200 leading-none">{currentUser.name}</p>
                                <p className="text-[9px] text-cyan-400 font-mono leading-none mt-0.5">SARAL Verified</p>
                            </div>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};
