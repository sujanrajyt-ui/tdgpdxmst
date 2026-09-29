import React, { useEffect, useState } from 'react';
import { AppStore } from '../core/store';
import { User } from '../types';
import { MSTAnchorService } from '../core/mst/anchorService';
import { Shield, AlertTriangle, CheckCircle2, FileText, Cpu, AlertOctagon } from 'lucide-react';
import { getAdminReviewQueue, reviewListing, reviewSeller, type AdminReviewQueue } from '../core/api';

interface Props {
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
    onOpenMSTExplorer: () => void;
}

export const AdminConsoleView: React.FC<Props> = ({ currentUser, onNavigate, onOpenMSTExplorer }) => {
    const [reviewQueue, setReviewQueue] = useState<AdminReviewQueue>({ listings: [], sellerApplications: [] });
    const [queueError, setQueueError] = useState('');
    const [queueBusy, setQueueBusy] = useState(false);
    const refreshQueue = async () => {
        try { setReviewQueue(await getAdminReviewQueue()); setQueueError(''); await AppStore.syncFromApi(currentUser.walletAddress); }
        catch (error) { setQueueError(error instanceof Error ? error.message : 'Admin review queue is unavailable.'); }
    };

    useEffect(() => { if (currentUser.role === 'ADMIN') void refreshQueue(); }, [currentUser.role]);

    const passports = AppStore.getPassports();
    const anchors = MSTAnchorService.getAnchors();
    const flaggedPassports = passports.filter(p => p.riskLevel === 'HIGH_RISK' || p.currentStatus === 'STOLEN');
    const listings = AppStore.getListings();
    const realAnchors = anchors.filter(a => a.status === 'CONFIRMED' && !a.simulated);
    const demoAnchors = anchors.filter(a => a.simulated);

    if (currentUser.role !== 'ADMIN') {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="zayq-glass-card rounded-2xl p-8 text-center space-y-4">
                    <Shield size={36} className="mx-auto text-purple-400" />
                    <h1 className="text-xl font-bold text-white">Admin access required</h1>
                    <p className="text-sm text-slate-300">Connect a wallet listed in the API’s ADMIN_WALLETS setting to review marketplace activity.</p>
                    <button onClick={() => onNavigate('marketplace')} className="zayq-btn-primary">Back to marketplace</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="zayq-glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                        <Shield size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-white font-sans">Admin Verification & Telemetry Console</h1>
                            <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                                Platform Root
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">Review manual claims, theft disputes, and MST anchor queues</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onOpenMSTExplorer}
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-mono"
                    >
                        <Cpu size={14} />
                        <span>Open Explorer</span>
                    </button>
                </div>
            </div>

            {/* MST Anchor Queue Telemetry Box */}
            <div className="zayq-glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu size={18} className="text-cyan-400" />
                    <h3 className="font-bold text-sm text-white font-sans">Blockchain Activity & Retry Queue</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Total Anchors Logged</span>
                        <span className="text-white font-bold text-lg">{anchors.length}</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Network confirmed</span>
                        <span className="text-emerald-400 font-bold text-lg">{realAnchors.length}</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Local demo receipts</span>
                        <span className="text-amber-300 font-bold text-lg">{demoAnchors.length}</span>
                    </div>
                </div>
                <p className="text-xs text-slate-400">Network-confirmed counts include mined wallet transactions. Local demo records stay in this browser. Failed wallet actions must be retried by submitting the action again.</p>
            </div>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Product passports', value: passports.length },
                    { label: 'Active listings', value: listings.filter(l => l.status === 'ACTIVE').length },
                    { label: 'Transfers in progress', value: listings.filter(l => l.status === 'PENDING_TRANSFER').length },
                    { label: 'Risk flagged', value: flaggedPassports.length }
                ].map(metric => <div key={metric.label} className="zayq-glass-card rounded-xl p-4"><p className="text-xs text-slate-400">{metric.label}</p><p className="mt-1 text-2xl font-bold text-white">{metric.value}</p></div>)}
            </section>

            <section className="zayq-glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-bold text-white">Seller and listing review</h2><p className="text-xs text-slate-400">Approval is enforced by the API before new listings are public.</p></div><button onClick={() => void refreshQueue()} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200">Refresh</button></div>
                {queueError && <p role="alert" className="text-sm text-amber-300">{queueError}</p>}
                {reviewQueue.sellerApplications.map(application => <div key={application.wallet_address} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-700 p-3">
                    <div><strong className="text-sm text-white">{application.business_name}</strong><p className="text-xs text-slate-400 font-mono break-all">{application.wallet_address}</p></div>
                    <div className="flex gap-2"><button disabled={queueBusy} onClick={async () => { setQueueBusy(true); try { await reviewSeller(application.wallet_address, 'APPROVE'); await refreshQueue(); } catch (error) { setQueueError(error instanceof Error ? error.message : 'Review failed.'); } finally { setQueueBusy(false); } }} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs text-white">Approve seller</button><button disabled={queueBusy} onClick={async () => { setQueueBusy(true); try { await reviewSeller(application.wallet_address, 'REJECT'); await refreshQueue(); } catch (error) { setQueueError(error instanceof Error ? error.message : 'Review failed.'); } finally { setQueueBusy(false); } }} className="rounded-lg border border-rose-800 px-3 py-2 text-xs text-rose-200">Reject</button></div>
                </div>)}
                {reviewQueue.listings.map(listing => <div key={listing.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-700 p-3">
                    <div><strong className="text-sm text-white">{listing.title}</strong><p className="text-xs text-slate-400">{listing.id} · {listing.passportId} · ₹{listing.price.toLocaleString()} · {listing.location}</p></div>
                    <div className="flex gap-2"><button disabled={queueBusy} onClick={async () => { setQueueBusy(true); try { await reviewListing(listing.id, 'APPROVE'); await refreshQueue(); } catch (error) { setQueueError(error instanceof Error ? error.message : 'Review failed.'); } finally { setQueueBusy(false); } }} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs text-white">Publish</button><button disabled={queueBusy} onClick={async () => { setQueueBusy(true); try { await reviewListing(listing.id, 'REJECT'); await refreshQueue(); } catch (error) { setQueueError(error instanceof Error ? error.message : 'Review failed.'); } finally { setQueueBusy(false); } }} className="rounded-lg border border-rose-800 px-3 py-2 text-xs text-rose-200">Reject</button></div>
                </div>)}
                {!queueError && !reviewQueue.listings.length && !reviewQueue.sellerApplications.length && <p className="text-sm text-slate-400">No seller applications or listings are waiting for review.</p>}
            </section>

            {/* Flagged & High Risk Passports */}
            <div className="space-y-4">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                    <AlertOctagon size={18} className="text-rose-400" />
                    <span>Flagged Passports & Active Disputes ({flaggedPassports.length})</span>
                </h3>

                {flaggedPassports.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        Zero high risk anomalies or unhandled theft disputes present.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {flaggedPassports.map((p) => (
                            <div key={p.passportId} className="bg-slate-900 border border-rose-500/40 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-white font-sans">{p.model}</span>
                                        <span className="text-xs font-mono text-cyan-400">{p.passportId}</span>
                                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-mono font-bold">
                                            {p.currentStatus}
                                        </span>
                                    </div>
                                    <p className="text-xs text-rose-300 font-mono mt-1">
                                        Risk Score: {p.riskScore}/100 • Signals: {p.riskSignals.join(' | ')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onNavigate('stolen-dispute', p.passportId)}
                                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg font-mono transition-colors"
                                >
                                    Manage Dispute
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
