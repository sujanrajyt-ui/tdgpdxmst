import React from 'react';
import { Shield, Cpu, Lock, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
    onNavigate: (view: string) => void;
    onOpenMSTExplorer: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenMSTExplorer }) => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 mt-20 text-slate-400 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Col 1 */}
                <div className="space-y-3 md:col-span-1">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white">
                            <Shield size={18} />
                        </div>
                        <span className="font-extrabold text-sm text-white font-sans tracking-tight">PRODUCT PASSPORT</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Persistent physical product identity network built on MST. Verify product history, ownership attestations, and service records across owners and marketplaces.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-[11px] text-emerald-400">MST L1 Contract Active</span>
                    </div>
                </div>

                {/* Col 2 */}
                <div className="space-y-2">
                    <span className="font-bold text-white text-xs font-sans uppercase tracking-zayq block mb-2">Ecosystem Portals</span>
                    <ul className="space-y-1.5">
                        <li>
                            <button onClick={() => onNavigate('marketplace')} className="hover:text-cyan-300 transition-colors">
                                Trusted Second-Hand Marketplace
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-300 transition-colors">
                                User Passport Dashboard
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onNavigate('create-passport')} className="hover:text-cyan-300 transition-colors">
                                Register Product Passport
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onNavigate('service-portal')} className="hover:text-cyan-300 transition-colors">
                                Authorized Service Center Portal
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onNavigate('admin-console')} className="hover:text-cyan-300 transition-colors">
                                Admin & Dispute Resolution Console
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Col 3 */}
                <div className="space-y-2">
                    <span className="font-bold text-white text-xs font-sans uppercase tracking-zayq block mb-2">MST Technology</span>
                    <ul className="space-y-1.5">
                        <li>
                            <button onClick={onOpenMSTExplorer} className="hover:text-cyan-300 transition-colors flex items-center gap-1 font-mono text-[11px]">
                                <Cpu size={12} />
                                <span>MST Contract Explorer</span>
                            </button>
                        </li>
                        <li>
                            <span className="text-slate-500">SARAL Keyless Onboarding</span>
                        </li>
                        <li>
                            <span className="text-slate-500">WASMify Off-Chain Verification</span>
                        </li>
                        <li>
                            <span className="text-slate-500">Dual-Confirmation Escrow</span>
                        </li>
                        <li>
                            <span className="text-slate-500">Async Retry Anchor Queue</span>
                        </li>
                    </ul>
                </div>

                {/* Col 4 */}
                <div className="space-y-3 zayq-glass-card p-4 rounded-xl">
                    <div className="flex items-center gap-1.5 font-semibold text-white text-xs">
                        <Lock size={14} className="text-cyan-400" />
                        <span>Core Product Thesis</span>
                    </div>
                    <blockquote className="text-[11px] italic text-slate-300 border-l-2 border-cyan-500 pl-2">
                        "The marketplace can change. The seller can change. The owner can change. The product's verified identity and history should not."
                    </blockquote>
                    <p className="text-[10px] text-slate-500 font-mono">
                        Powered by MST Ecosystem Architecture.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
                <p className="text-slate-500">
                    © {new Date().getFullYear()} Product Passport Network. Built on MST. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-slate-400">
                    <span>Privacy Preserving On-Chain Hashes</span>
                    <span>•</span>
                    <span>Zero NFC Required</span>
                </div>
            </div>
        </footer>
    );
};
