import React from 'react';
import { VerificationLevel } from '../types';
import { ShieldCheck, ShieldAlert, Award, FileCheck, CheckCircle2 } from 'lucide-react';

interface Props {
    level: VerificationLevel;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const VerificationBadge: React.FC<Props> = ({ level, size = 'md', showLabel = true }) => {
    const getBadgeConfig = () => {
        switch (level) {
            case 'MANUFACTURER_VERIFIED':
                return {
                    label: 'Manufacturer Verified',
                    icon: Award,
                    bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
                    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                };
            case 'PROFESSIONALLY_INSPECTED':
                return {
                    label: 'TechCert Inspected',
                    icon: ShieldCheck,
                    bg: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
                    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                };
            case 'OWNERSHIP_VERIFIED':
                return {
                    label: 'Ownership Verified',
                    icon: CheckCircle2,
                    bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
                    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                };
            case 'IDENTITY_VERIFIED':
                return {
                    label: 'Identity Verified',
                    icon: FileCheck,
                    bg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
                    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                };
            case 'SELLER_REPORTED':
            default:
                return {
                    label: 'Seller Reported',
                    icon: ShieldAlert,
                    bg: 'bg-slate-800/80 border-slate-700 text-slate-400',
                    glow: ''
                };
        }
    };

    const config = getBadgeConfig();
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[9px] gap-1 tracking-wider uppercase font-bold',
        md: 'px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase gap-1.5',
        lg: 'px-3.5 py-1.5 text-xs font-extrabold tracking-wider uppercase gap-2'
    };

    const iconSizes = {
        sm: 11,
        md: 13,
        lg: 16
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all ${config.bg} ${config.glow} ${sizeClasses[size]}`}
        >
            <Icon size={iconSizes[size]} />
            {showLabel && <span>{config.label}</span>}
        </span>
    );
};
