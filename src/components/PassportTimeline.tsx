import React from 'react';
import { LifecycleEvent } from '../types';
import { ShoppingBag, Wrench, ShieldCheck, Tag, ArrowRightLeft, AlertOctagon, RotateCcw, Award } from 'lucide-react';

interface Props {
    events: LifecycleEvent[];
    onOpenMSTExplorer?: (txHash: string) => void;
}

export const PassportTimeline: React.FC<Props> = ({ events, onOpenMSTExplorer }) => {
    const getEventIcon = (type: LifecycleEvent['eventType']) => {
        switch (type) {
            case 'PURCHASED':
                return <ShoppingBag size={14} className="text-cyan-400" />;
            case 'SERVICED':
                return <Wrench size={14} className="text-amber-400" />;
            case 'INSPECTED':
                return <Award size={14} className="text-purple-400" />;
            case 'LISTED':
                return <Tag size={14} className="text-blue-400" />;
            case 'TRANSFERRED':
            case 'SOLD':
                return <ArrowRightLeft size={14} className="text-emerald-400" />;
            case 'STOLEN':
            case 'FLAGGED':
            case 'DISPUTED':
                return <AlertOctagon size={14} className="text-rose-400" />;
            case 'RECOVERED':
                return <RotateCcw size={14} className="text-emerald-400" />;
            default:
                return <ShieldCheck size={14} className="text-cyan-400" />;
        }
    };

    return (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/80 before:via-purple-500/50 before:to-slate-800">
            {events.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center group-hover:border-cyan-400 transition-colors shadow-sm">
                        {getEventIcon(evt.eventType)}
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-slate-100">{evt.title}</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                        {evt.eventType}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{evt.description}</p>
                            </div>

                            <div className="text-right">
                                <span className="text-[10px] font-mono text-slate-500 block">
                                    {new Date(evt.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-[9px] font-mono text-slate-600 block">
                                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        {/* Actor & MST Tx Footprint */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                            <div className="text-slate-400 flex items-center gap-1">
                                <span className="text-slate-500">Actor:</span>
                                <span className="text-cyan-300 font-sans">{evt.actorName}</span>
                                <span className="text-[9px] text-slate-500">({evt.actorDid.slice(0, 16)}...)</span>
                            </div>

                            {evt.mstTxHash && (
                                <button
                                    onClick={() => onOpenMSTExplorer && onOpenMSTExplorer(evt.mstTxHash)}
                                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-[10px]"
                                >
                                    <span>MST Block #{evt.blockNumber || 18492041}</span>
                                    <span className="text-[9px] opacity-75">({evt.mstTxHash.slice(0, 10)}...)</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
