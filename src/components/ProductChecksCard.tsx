import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { RiskLevel } from '../types';

interface Props {
    riskLevel: RiskLevel;
    riskScore: number;
    riskSignals: string[];
}

const riskLabels: Record<RiskLevel, string> = {
    HIGH_RISK: 'Needs attention',
    REVIEW_REQUIRED: 'Review recommended',
    LOW_RISK: 'No major flags',
};

export const ProductChecksCard: React.FC<Props> = ({ riskLevel, riskScore, riskSignals }) => {
    const needsAttention = riskLevel === 'HIGH_RISK';
    const needsReview = riskLevel === 'REVIEW_REQUIRED';
    const statusClass = needsAttention
        ? 'border-rose-200 bg-rose-50 text-rose-800'
        : needsReview
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-emerald-200 bg-emerald-50 text-emerald-800';

    return (
        <section className="zayq-glass-card rounded-xl p-5">
            <div className="flex items-center gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-full ${needsAttention ? 'bg-rose-100 text-rose-700' : needsReview ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {needsAttention || needsReview ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">Product checks</h3>
                    <p className="text-xs text-slate-600">Automated record checks; these do not inspect the physical device.</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>{riskLabels[riskLevel]}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
                <span className="text-slate-600">Check score</span>
                <span className="font-semibold text-slate-900">{riskScore} / 100</span>
            </div>
            {riskSignals.length > 0 && (
                <ul className="mt-3 space-y-2">
                    {riskSignals.map((signal, index) => (
                        <li key={`${index}-${signal}`} className="text-xs leading-5 text-slate-600">{signal.replace(/^CRITICAL:\s*/i, '')}</li>
                    ))}
                </ul>
            )}
        </section>
    );
};
