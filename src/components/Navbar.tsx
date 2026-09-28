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
        { label: 'MST Ecosystem', view: 'mst-ecosystem', icon: Cpu },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 zayq-glass-nav border-b border-[#E5DFD9]">
            {/* Top Network Status Bar */}
            <div className="bg-[#FAF8F5] text-xs py-1.5 px-4 border-b border-[#E5DFD9] flex items-center justify-between text-[#5A4D44]">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C6D58] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3D1A12]"></span>
                    </span>
                    <span className="font-mono text-[11px] text-[#3D1A12] font-bold tracking-zayq uppercase">MST Testnet</span>
                    <span className="hidden sm:inline text-[#8C6D58] font-mono text-[11px]">| Smart Contract Identity Anchoring Active</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onStartKillerDemo}
                        className="flex items-center gap-1.5 bg-[#3D1A12] hover:bg-[#26100B] text-[#F7F4F2] font-extrabold px-3.5 py-0.5 rounded-full shadow-sm transition-all text-[10px] tracking-zayq uppercase"
                    >
                        <Sparkles size={12} className="text-[#C5A059]" />
                        <span>Launch Killer Demo</span>
                    </button>
                    <button
                        onClick={onOpenMSTExplorer}
                        className="flex items-center gap-1 text-[#3D1A12] hover:text-[#8C6D58] font-mono text-[11px] hover:underline"
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
                    <div className="w-10 h-10 rounded-xl bg-[#3D1A12] flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
                        <Shield size={22} className="text-[#F7F4F2]" />
                    </div>
                    <div>
                        <div className="font-black text-xl tracking-tight text-[#3D1A12] flex items-center gap-1.5 font-display">
                            <span>PRODUCT PASSPORT</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-[#3D1A12]/10 text-[#3D1A12] border border-[#3D1A12]/20 rounded-md font-mono font-extrabold tracking-widest">MST</span>
                        </div>
                        <p className="text-[9px] text-[#8C6D58] font-mono tracking-zayq uppercase -mt-0.5">Trust Infrastructure</p>
                    </div>
                </div>

                {/* Quick Search */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
                    <input
                        type="text"
                        placeholder="Verify Passport ID (e.g. PP-82941)..."
                        value={passportSearch}
                        onChange={(e) => setPassportSearch(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#E5DFD9] focus:border-[#3D1A12] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A1A1A] placeholder-[#A0958C] outline-none transition-all font-mono"
                    />
                    <Search size={14} className="absolute left-3 top-2.5 text-[#8C6D58]" />
                </form>

                {/* Nav Links & CTA */}
                <nav className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden lg:flex items-center space-x-6 mr-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.view;
                            return (
                                <button
                                    key={item.view}
                                    onClick={() => onNavigate(item.view)}
                                    className={`relative py-1 font-bold text-xs transition-colors flex items-center gap-1.5 ${isActive ? 'text-[#3D1A12]' : 'text-[#8C6D58] hover:text-[#3D1A12]'}`}
                                >
                                    <Icon size={14} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#3D1A12] rounded-full transition-all duration-300" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ZAYQ Primary CTA Button */}
                    <button
                        onClick={() => onNavigate('create-passport')}
                        className="zayq-btn-primary shadow-md"
                    >
                        <PlusCircle size={15} />
                        <span>Create Passport</span>
                    </button>

                    {/* Portals */}
                    <button
                        onClick={() => onNavigate('service-portal')}
                        className={`p-2.5 rounded-xl text-xs font-medium transition-all ${currentView === 'service-portal'
                            ? 'bg-[#3D1A12]/10 text-[#3D1A12] border border-[#3D1A12]/30'
                            : 'text-[#8C6D58] hover:bg-[#FAF8F5] hover:text-[#3D1A12] border border-transparent'
                            }`}
                        title="Service Center Portal"
                    >
                        <Wrench size={16} />
                    </button>

                    <button
                        onClick={() => onNavigate('admin-console')}
                        className={`p-2.5 rounded-xl text-xs font-medium transition-all ${currentView === 'admin-console' || currentView === 'stolen-dispute'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'text-[#8C6D58] hover:bg-[#FAF8F5] hover:text-[#3D1A12] border border-transparent'
                            }`}
                        title="Admin & Dispute Console"
                    >
                        <AlertOctagon size={16} />
                    </button>

                    {/* SARAL Identity Selector */}
                    <div className="ml-1 pl-2 border-l border-[#E5DFD9] flex items-center">
                        <button
                            onClick={onOpenSaralModal}
                            className="flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#E5DFD9] px-2.5 py-1 rounded-xl transition-all shadow-sm"
                        >
                            <div className="w-6 h-6 rounded-full bg-[#3D1A12] flex items-center justify-center text-[#F7F4F2] text-xs font-bold font-mono">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="text-left hidden xl:block">
                                <p className="text-xs font-bold text-[#1A1A1A] leading-none">{currentUser.name}</p>
                                <p className="text-[8px] text-[#8C6D58] font-mono leading-none mt-0.5 tracking-zayq uppercase">SARAL ID</p>
                            </div>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};
