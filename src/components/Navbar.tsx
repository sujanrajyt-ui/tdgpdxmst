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
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#090D16]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {/* Ambient Top Glow Line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent" />

            {/* Top Network Status Banner */}
            <div className="bg-[#0D1321]/90 text-xs py-1.5 px-4 border-b border-white/5 text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="font-mono text-[11px] text-cyan-300 font-bold tracking-widest uppercase">MST Testnet</span>
                    <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">| EVM Contract Anchoring Active (0x8f3A...3041)</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onStartKillerDemo}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-3.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 text-[10px] tracking-wider uppercase"
                    >
                        <Sparkles size={12} />
                        <span>Launch Killer Demo</span>
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
                {/* Brand Identity Logo */}
                <div
                    onClick={() => onNavigate('landing')}
                    className="flex items-center gap-3 cursor-pointer group shrink-0"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-all duration-300 border border-cyan-400/30">
                        <Shield size={22} className="text-white" />
                    </div>
                    <div>
                        <div className="font-black text-xl tracking-tight text-white flex items-center gap-1.5 font-display">
                            <span>PRODUCT PASSPORT</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-md font-mono font-extrabold tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.2)]">MST</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono tracking-zayq uppercase -mt-0.5">Trust Infrastructure</p>
                    </div>
                </div>

                {/* Global Quick Search Passport Input */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
                    <input
                        type="text"
                        placeholder="Verify Passport ID (e.g. PP-82941)..."
                        value={passportSearch}
                        onChange={(e) => setPassportSearch(e.target.value)}
                        className="w-full bg-[#0D1321] border border-white/10 focus:border-cyan-500/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-cyan-500/20 font-mono"
                    />
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                </form>

                {/* Nav Items & Pill Action Buttons */}
                <nav className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden lg:flex items-center space-x-6 mr-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.view;
                            return (
                                <button
                                    key={item.view}
                                    onClick={() => onNavigate(item.view)}
                                    className={`relative py-1 font-bold text-xs transition-colors flex items-center gap-1.5 ${isActive ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
                                        }`}
                                >
                                    <Icon size={14} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-300" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ZAYQ Pill CTA Button */}
                    <button
                        onClick={() => onNavigate('create-passport')}
                        className="zayq-btn-primary shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    >
                        <PlusCircle size={15} />
                        <span>Create Passport</span>
                    </button>

                    {/* Specialized Portals */}
                    <button
                        onClick={() => onNavigate('service-portal')}
                        className={`p-2.5 rounded-xl text-xs font-medium transition-all ${currentView === 'service-portal'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                            : 'text-slate-400 hover:bg-[#0D1321] hover:text-slate-200 border border-transparent'
                            }`}
                        title="Service Center Portal"
                    >
                        <Wrench size={16} />
                    </button>

                    <button
                        onClick={() => onNavigate('admin-console')}
                        className={`p-2.5 rounded-xl text-xs font-medium transition-all ${currentView === 'admin-console' || currentView === 'stolen-dispute'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                            : 'text-slate-400 hover:bg-[#0D1321] hover:text-slate-200 border border-transparent'
                            }`}
                        title="Admin & Dispute Console"
                    >
                        <AlertOctagon size={16} />
                    </button>

                    {/* SARAL Identity Selector */}
                    <div className="ml-1 pl-2 border-l border-white/10 flex items-center">
                        <button
                            onClick={onOpenSaralModal}
                            className="flex items-center gap-2 bg-[#0D1321] hover:bg-[#141C30] border border-white/10 px-2.5 py-1 rounded-xl transition-all shadow-sm"
                        >
                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold font-mono">
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
