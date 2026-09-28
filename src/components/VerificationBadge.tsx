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
                    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
                    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                };
            case 'PROFESSIONALLY_INSPECTED':
                return {
                    label: 'Professionally Inspected',
                    icon: ShieldCheck,
                    bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
                    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                };
            case 'OWNERSHIP_VERIFIED':
                return {
                    label: 'Ownership Verified',
                    icon: CheckCircle2,
                    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                };
            case 'IDENTITY_VERIFIED':
                return {
                    label: 'Identity Verified',
                    icon: FileCheck,
                    bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
                    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                };
            case 'SELLER_REPORTED':
            default:
                return {
                    label: 'Seller Reported',
                    icon: ShieldAlert,
                    bg: 'bg-slate-700/30 border-slate-600/40 text-slate-400',
                    glow: ''
                };
        }
    };

    const config = getBadgeConfig();
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs gap-1',
        md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
        lg: 'px-3.5 py-1.5 text-sm font-semibold gap-2'
    };

    const iconSizes = {
        sm: 13,
        md: 15,
        lg: 18
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
