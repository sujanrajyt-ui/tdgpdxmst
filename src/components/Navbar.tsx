import React, { useState } from 'react';
import { Shield, Search, PlusCircle, Store, Wrench, AlertOctagon, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface Props {
    currentView: string;
    onNavigate: (view: string, param?: string) => void;
    currentUser: User;
    onOpenSaralModal: () => void;
}

export const Navbar: React.FC<Props> = ({ currentView, onNavigate, currentUser, onOpenSaralModal }) => {
    const [passportSearch, setPassportSearch] = useState('');

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (passportSearch.trim()) onNavigate('passport-detail', passportSearch.trim().toUpperCase());
    };

    const navItems = [
        { label: 'Marketplace', view: 'marketplace', icon: Store },
        { label: 'My Passports', view: 'dashboard', icon: UserIcon },
    ];

    return (
        <header className="fixed left-0 right-0 top-0 z-50 zayq-glass-nav">
            <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-8 lg:px-12">
                <button onClick={() => onNavigate('landing')} className="flex shrink-0 items-center gap-2.5 text-left">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#3D1A12] text-[#F7F4F2]"><Shield size={22} /></span>
                    <span>
                        <span className="block font-display text-[17px] font-bold leading-none tracking-[0.02em] text-[#3D1A12]">ZAYQ</span>
                        <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8C6D58]">Product Passport</span>
                    </span>
                </button>

                <form onSubmit={handleSearchSubmit} className="relative hidden max-w-[250px] flex-1 md:flex">
                    <input type="text" placeholder="Passport ID" value={passportSearch} onChange={(event) => setPassportSearch(event.target.value)} className="w-full border-b border-[#C9BDB5] bg-transparent py-2 pl-7 pr-2 text-xs text-[#1A1A1A] outline-none transition-colors placeholder:text-[#A0958C] focus:border-[#3D1A12]" />
                    <Search size={14} className="absolute left-0 top-2.5 text-[#8C6D58]" />
                </form>

                <nav className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden items-center gap-5 lg:flex">
                        {navItems.map(({ label, view, icon: Icon }) => (
                            <button key={view} onClick={() => onNavigate(view)} className={`inline-flex items-center gap-1.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors ${currentView === view ? 'text-[#3D1A12]' : 'text-[#8C6D58] hover:text-[#3D1A12]'}`}>
                                <Icon size={14} /> {label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => onNavigate('create-passport')} className="zayq-btn-primary h-10 px-3 shadow-md sm:px-4">
                        <PlusCircle size={14} /><span className="hidden sm:inline">Create passport</span><span className="sm:hidden">Create</span>
                    </button>
                    <button onClick={() => onNavigate('service-portal')} className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${currentView === 'service-portal' ? 'bg-[#3D1A12]/10 text-[#3D1A12]' : 'text-[#8C6D58] hover:bg-[#FAF8F5] hover:text-[#3D1A12]'}`} title="Service Center Portal"><Wrench size={15} /></button>
                    <button onClick={() => onNavigate('admin-console')} className={`hidden h-9 w-9 place-items-center rounded-lg transition-colors sm:grid ${currentView === 'admin-console' || currentView === 'stolen-dispute' ? 'bg-rose-100 text-rose-800' : 'text-[#8C6D58] hover:bg-[#FAF8F5] hover:text-[#3D1A12]'}`} title="Admin & Dispute Console"><AlertOctagon size={15} /></button>
                    <button onClick={onOpenSaralModal} title={`Signed in as ${currentUser.name}`} className="ml-1 grid h-9 w-9 place-items-center border-l border-[#E5DFD9] pl-2 text-xs font-bold text-[#3D1A12]">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#3D1A12] text-[#F7F4F2]">{currentUser.name.charAt(0)}</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};