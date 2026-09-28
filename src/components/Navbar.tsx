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

    const navItems = [
        { label: 'Marketplace', view: 'marketplace', icon: Store },
        { label: 'My Passports', view: 'dashboard', icon: UserIcon },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
            {/* Top Banner: MST Status & Killer Demo */}
            <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-purple-950/80 text-xs py-1.5 px-4 border-b border-slate-800/60 text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-mono text-[11px] text-cyan-300 font-semibold tracking-wider uppercase">MST Testnet</span>
                    <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">| EVM Contract Anchoring Active</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onStartKillerDemo}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-3 py-0.5 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 text-[11px]"
                    >
                        <Sparkles size={12} />
                        <span className="tracking-wide">Launch Killer Demo</span>
                    </button>
                    <button
                        onClick={onOpenMSTExplorer}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] hover:underline"
                    >
                        <Cpu size={12} />
                        <span>MST Explorer</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* ZAYQ Style Brand Logo */}
                <div
                    onClick={() => onNavigate('landing')}
                    className="flex items-center gap-2.5 cursor-pointer group shrink-0"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
                        <Shield size={20} className="text-white" />
                    </div>
                    <div>
                        <div className="font-black text-xl tracking-tight text-white flex items-center gap-1.5 font-sans">
                            <span>PASSPORT</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded font-mono font-bold tracking-widest">MST</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono tracking-zayq uppercase -mt-0.5">Trust Infrastructure</p>
                    </div>
                </div>

                {/* Global Quick Search Passport */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
                    <input
                        type="text"
                        placeholder="Verify Passport ID (e.g. PP-82941)..."
                        value={passportSearch}
                        onChange={(e) => setPassportSearch(e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
                    />
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                </form>

                {/* Navigation Links with ZAYQ-style underline animations & pill buttons */}
                <nav className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden lg:flex items-center space-x-6 mr-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.view;
                            return (
                                <button
                                    key={item.view}
                                    onClick={() => onNavigate(item.view)}
                                    className={`relative py-1 font-semibold text-xs transition-colors flex items-center gap-1.5 ${isActive ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
                                        }`}
                                >
                                    <Icon size={14} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full transition-all duration-300" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ZAYQ Pill Action Button */}
                    <button
                        onClick={() => onNavigate('create-passport')}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 sm:px-5 py-2 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 flex items-center gap-1.5"
                    >
                        <PlusCircle size={15} />
                        <span>Create Passport</span>
                    </button>

                    {/* Specialized Portals */}
                    <button
                        onClick={() => onNavigate('service-portal')}
                        className={`p-2 rounded-xl text-xs font-medium transition-all ${currentView === 'service-portal'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                        title="Service Center Portal"
                    >
                        <Wrench size={16} />
                    </button>

                    <button
                        onClick={() => onNavigate('admin-console')}
                        className={`p-2 rounded-xl text-xs font-medium transition-all ${currentView === 'admin-console' || currentView === 'stolen-dispute'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                        title="Admin Console"
                    >
                        <AlertOctagon size={16} />
                    </button>

                    {/* SARAL Identity Selector */}
                    <div className="ml-1 pl-2 border-l border-slate-800 flex items-center">
                        <button
                            onClick={onOpenSaralModal}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded-xl transition-all"
                        >
                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="text-left hidden xl:block">
                                <p className="text-xs font-bold text-slate-200 leading-none">{currentUser.name}</p>
                                <p className="text-[8px] text-cyan-400 font-mono leading-none mt-0.5 tracking-wider uppercase">SARAL ID</p>
                            </div>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};
