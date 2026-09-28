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
                    bg: 'bg-amber-50 border-amber-200 text-amber-700',
                };
            case 'PROFESSIONALLY_INSPECTED':
                return {
                    label: 'TechCert Inspected',
                    icon: ShieldCheck,
                    bg: 'bg-violet-50 border-violet-200 text-violet-700',
                };
            case 'OWNERSHIP_VERIFIED':
                return {
                    label: 'Ownership Verified',
                    icon: CheckCircle2,
                    bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                };
            case 'IDENTITY_VERIFIED':
                return {
                    label: 'Identity Verified',
                    icon: FileCheck,
                    bg: 'bg-teal-50 border-teal-200 text-teal-700',
                };
            case 'SELLER_REPORTED':
            default:
                return {
                    label: 'Seller Reported',
                    icon: ShieldAlert,
                    bg: 'bg-gray-100 border-gray-200 text-gray-500',
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
            className={`inline-flex items-center rounded-full border shadow-sm transition-all ${config.bg} ${sizeClasses[size]}`}
        >
            <Icon size={iconSizes[size]} />
            {showLabel && <span>{config.label}</span>}
        </span>
    );
};
