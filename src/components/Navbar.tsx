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
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
            {/* Top Network Status Bar */}
            <div className="bg-gray-50 text-xs py-1.5 px-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    <span className="font-mono text-[11px] text-teal-700 font-bold tracking-widest uppercase">MST Testnet</span>
                    <span className="hidden sm:inline text-gray-400 font-mono text-[11px]">| EVM Contract Anchoring Active</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onStartKillerDemo}
                        className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-0.5 rounded-full shadow-sm transition-all text-[10px] tracking-wider uppercase"
                    >
                        <Sparkles size={12} />
                        <span>Launch Killer Demo</span>
                    </button>
                    <button
                        onClick={onOpenMSTExplorer}
                        className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-mono text-[11px] hover:underline"
                    >
                        <Cpu size={12} />
                        <span>MST Explorer</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <div
                    onClick={() => onNavigate('landing')}
                    className="flex items-center gap-3 cursor-pointer group shrink-0"
                >
                    <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
                        <Shield size={22} className="text-white" />
                    </div>
                    <div>
                        <div className="font-black text-xl tracking-tight text-gray-900 flex items-center gap-1.5 font-display">
                            <span>PRODUCT PASSPORT</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md font-mono font-extrabold tracking-widest">MST</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-mono tracking-zayq uppercase -mt-0.5">Trust Infrastructure</p>
                    </div>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
                    <input
                        type="text"
                        placeholder="Verify Passport ID (e.g. PP-82941)..."
                        value={passportSearch}
                        onChange={(e) => setPassportSearch(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-teal-500 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-teal-500/15 font-mono"
                    />
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                </form>

                {/* Nav Items */}
                <nav className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden lg:flex items-center space-x-6 mr-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.view;
                            return (
                                <button
                                    key={item.view}
                                    onClick={() => onNavigate(item.view)}
                                    className={`relative py-1 font-bold text-xs transition-colors flex items-center gap-1.5 ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <Icon size={14} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-500 rounded-full transition-all duration-300" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Primary CTA */}
                    <button
                        onClick={() => onNavigate('create-passport')}
                        className="pp-btn-primary"
                    >
                        <PlusCircle size={15} />
                        <span>Create Passport</span>
                    </button>

                    {/* Portal Buttons */}
                    <button
                        onClick={() => onNavigate('service-portal')}
                        className={`p-2.5 rounded-xl text-xs font-medium transition-all ${currentView === 'service-portal'
                            ? 'bg-violet-50 text-violet-600 border border-violet-200'
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 border border-transparent'
                            }`}
                        title="Service Center Portal"
                    >
                        <Wrench size={16} />
                    </button>

                    <button
                        onClick={() => onNavigate('admin-console')}
                        className={`p-2.5 rounded-xl text-xs font-medium transition-all ${currentView === 'admin-console' || currentView === 'stolen-dispute'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 border border-transparent'
                            }`}
                        title="Admin & Dispute Console"
                    >
                        <AlertOctagon size={16} />
                    </button>

                    {/* SARAL Identity */}
                    <div className="ml-1 pl-2 border-l border-gray-200 flex items-center">
                        <button
                            onClick={onOpenSaralModal}
                            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-xl transition-all"
                        >
                            <div className="w-6 h-6 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 text-xs font-bold font-mono">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="text-left hidden xl:block">
                                <p className="text-xs font-bold text-gray-800 leading-none">{currentUser.name}</p>
                                <p className="text-[8px] text-teal-600 font-mono leading-none mt-0.5 tracking-wider uppercase">SARAL ID</p>
                            </div>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};
