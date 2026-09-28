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
                    bg: 'bg-[#C5A059]/15 border-[#C5A059]/30 text-[#6B501B]',
                };
            case 'PROFESSIONALLY_INSPECTED':
                return {
                    label: 'TechCert Inspected',
                    icon: ShieldCheck,
                    bg: 'bg-amber-100/70 border-amber-300 text-amber-900',
                };
            case 'OWNERSHIP_VERIFIED':
                return {
                    label: 'Ownership Verified',
                    icon: CheckCircle2,
                    bg: 'bg-[#3D1A12]/10 border-[#3D1A12]/20 text-[#3D1A12]',
                };
            case 'IDENTITY_VERIFIED':
                return {
                    label: 'Identity Verified',
                    icon: FileCheck,
                    bg: 'bg-[#8C6D58]/15 border-[#8C6D58]/30 text-[#3D1A12]',
                };
            case 'SELLER_REPORTED':
            default:
                return {
                    label: 'Seller Reported',
                    icon: ShieldAlert,
                    bg: 'bg-gray-100 border-gray-200 text-gray-600',
                };
        }
    };

    const config = getBadgeConfig();
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[9px] gap-1 tracking-zayq uppercase font-bold',
        md: 'px-2.5 py-1 text-[10px] font-bold tracking-zayq uppercase gap-1.5',
        lg: 'px-3.5 py-1.5 text-xs font-extrabold tracking-zayq uppercase gap-2'
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
