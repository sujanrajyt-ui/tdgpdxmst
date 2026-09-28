import React from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, Eye, Cpu } from 'lucide-react';
import { RiskLevel, ConditionReport } from '../types';

interface Props {
    riskLevel: RiskLevel;
    riskScore: number;
    riskSignals: string[];
    conditionReport?: ConditionReport;
}

export const AIInspectorWidget: React.FC<Props> = ({
    riskLevel,
    riskScore,
    riskSignals,
    conditionReport
}) => {
    const getRiskBadge = () => {
        switch (riskLevel) {
            case 'HIGH_RISK':
                return {
                    label: 'High Risk Detected',
                    bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
                    bar: 'bg-rose-500'
                };
            case 'REVIEW_REQUIRED':
                return {
                    label: 'Review Recommended',
                    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
                    bar: 'bg-amber-500'
                };
            case 'LOW_RISK':
            default:
                return {
                    label: 'Low Risk Profile',
                    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                    bar: 'bg-emerald-500'
                };
        }
    };

    const badge = getRiskBadge();

    return (
        <div className="zayq-glass-card rounded-xl p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                        <Sparkles size={15} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                            <span>AI Fraud & Risk Engine</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Assistive AI
                            </span>
                        </h4>
                        <p className="text-[10px] text-slate-400">Automated serial duplicate & risk anomaly detection</p>
                    </div>
                </div>

                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${badge.bg}`}>
                    {badge.label}
                </span>
            </div>

            {/* Risk Score Bar */}
            <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-400">
                    <span>Risk Index: {riskScore} / 100</span>
                    <span>{riskScore < 25 ? 'Low Anomaly' : riskScore < 60 ? 'Moderate Anomaly' : 'High Anomaly'}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${badge.bar}`}
                        style={{ width: `${Math.max(5, riskScore)}%` }}
                    />
                </div>
            </div>

            {/* Signals List */}
            {riskSignals.length > 0 && (
                <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-slate-300 block">Evaluated Risk Signals:</span>
                    {riskSignals.map((sig, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                            {sig.includes('CRITICAL') ? (
                                <AlertTriangle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                            ) : (
                                <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                            )}
                            <span className="text-[11px] font-sans leading-tight">{sig}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Condition Observations */}
            {conditionReport && conditionReport.aiObservationNotes && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <Eye size={13} className="text-cyan-400" />
                            <span>Visible Condition Observation</span>
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">Vision AI Engine</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 block">Display Screen</span>
                            <span className="text-cyan-300 font-bold">{conditionReport.display}</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 block">Body / Scratches</span>
                            <span className="text-cyan-300 font-bold">{conditionReport.body}</span>
                        </div>
                        {conditionReport.batteryHealthPct && (
                            <div className="bg-slate-950 p-2 rounded border border-slate-800 col-span-2">
                                <span className="text-[10px] text-slate-500 block">Battery Health Capacity</span>
                                <span className="text-emerald-400 font-bold">{conditionReport.batteryHealthPct}% Verified Capacity</span>
                            </div>
                        )}
                    </div>

                    <p className="text-[10px] text-slate-500 italic">
                        * Note: AI provides automated observations to flag potential anomalies. AI does NOT unilaterally certify physical authenticity.
                    </p>
                </div>
            )}
        </div>
    );
};
