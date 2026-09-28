import React from 'react';
import { ProductStatus } from '../types';
import { Tag, CheckCircle, Clock, AlertTriangle, AlertOctagon, RotateCcw, Archive } from 'lucide-react';

interface Props {
    status: ProductStatus;
    size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
    const getConfig = () => {
        switch (status) {
            case 'FOR_SALE':
                return {
                    label: 'For Sale',
                    icon: Tag,
                    bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                };
            case 'TRANSFER_PENDING':
                return {
                    label: 'Transfer Pending',
                    icon: Clock,
                    bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400 animate-pulse-slow'
                };
            case 'STOLEN':
                return {
                    label: 'STOLEN / FLAGGED',
                    icon: AlertOctagon,
                    bg: 'bg-rose-500/20 border-rose-500/50 text-rose-400 font-bold animate-pulse'
                };
            case 'FLAGGED':
            case 'DISPUTED':
                return {
                    label: 'Disputed',
                    icon: AlertTriangle,
                    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                };
            case 'RECOVERED':
                return {
                    label: 'Recovered',
                    icon: RotateCcw,
                    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                };
            case 'RETIRED':
                return {
                    label: 'Retired',
                    icon: Archive,
                    bg: 'bg-slate-700/30 border-slate-600 text-slate-400'
                };
            case 'ACTIVE':
            default:
                return {
                    label: 'Active Owner',
                    icon: CheckCircle,
                    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                };
        }
    };

    const config = getConfig();
    const Icon = config.icon;
    const py = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${py}`}>
            <Icon size={13} />
            <span>{config.label}</span>
        </span>
    );
};
