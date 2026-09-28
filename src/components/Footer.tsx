import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface Props {
    onNavigate: (view: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
    return (
        <footer className="border-t border-[#deddd6] bg-[#eceae2] pt-12 pb-8 mt-20 text-[#62635b] text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="space-y-3 md:col-span-1">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-[#59652e]" />
                        <span className="font-extrabold text-sm text-[#171815] font-sans tracking-tight">ZAYQ PRODUCT PASSPORT</span>
                    </div>
                    <p className="max-w-xs text-xs leading-relaxed">
                        Remarkable pre-owned devices, with their ownership, service, and inspection history attached.
                    </p>
                </div>

                <div className="space-y-2">
                    <span className="font-bold text-[#171815] text-xs font-sans uppercase tracking-zayq block mb-2">Explore</span>
                    <ul className="space-y-1.5">
                        <li><button onClick={() => onNavigate('marketplace')} className="transition-colors hover:text-[#59652e]">Marketplace</button></li>
                        <li><button onClick={() => onNavigate('dashboard')} className="transition-colors hover:text-[#59652e]">My passports</button></li>
                        <li><button onClick={() => onNavigate('create-passport')} className="transition-colors hover:text-[#59652e]">Register a device</button></li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <span className="font-bold text-[#171815] text-xs font-sans uppercase tracking-zayq block mb-2">For professionals</span>
                    <ul className="space-y-1.5">
                        <li><button onClick={() => onNavigate('service-portal')} className="transition-colors hover:text-[#59652e]">Service center</button></li>
                        <li><button onClick={() => onNavigate('admin-console')} className="transition-colors hover:text-[#59652e]">Administration</button></li>
                    </ul>
                </div>

                <div className="space-y-3 border-l border-[#d4d2c9] pl-4">
                    <div className="flex items-center gap-1.5 font-semibold text-[#171815] text-xs">
                        <Lock size={14} className="text-[#59652e]" />
                        <span>Buy with confidence</span>
                    </div>
                    <blockquote className="text-[11px] leading-relaxed text-[#62635b]">
                        Every device has a story. Check its history before you make it yours.
                    </blockquote>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#d4d2c9] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
                <p>© {new Date().getFullYear()} ZAYQ Product Passport. All rights reserved.</p>
                <span>Verified product history</span>
            </div>
        </footer>
    );
};
