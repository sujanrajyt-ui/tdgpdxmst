import React, { useState } from 'react';
import { ProductPassport, User } from '../types';
import { AppStore } from '../core/store';
import { VerificationBadge } from '../components/VerificationBadge';
import { StatusBadge } from '../components/StatusBadge';
import { PassportTimeline } from '../components/PassportTimeline';
import { AIInspectorWidget } from '../components/AIInspectorWidget';
import { QRModal } from '../components/QRModal';
import { Shield, QrCode, ArrowRightLeft, Tag, Wrench, Award, AlertOctagon, CheckCircle2, Cpu, FileText, Lock, Calendar, ExternalLink } from 'lucide-react';

interface Props {
    passportId: string;
    currentUser: User;
    onNavigate: (view: string, param?: string) => void;
    onOpenMSTExplorer: (txHash?: string) => void;
}

export const PassportDetailView: React.FC<Props> = ({
    passportId,
    currentUser,
    onNavigate,
    onOpenMSTExplorer
}) => {
    const [showQrModal, setShowQrModal] = useState(false);
    const passport = AppStore.getPassportById(passportId) || AppStore.getPassports()[0];

    const isOwner = passport.currentOwnerId === currentUser.id;
    const isStolen = passport.currentStatus === 'STOLEN';
    const isForSale = passport.currentStatus === 'FOR_SALE';

    const activeListing = AppStore.getListings().find(l => l.passportId === passport.passportId && l.status !== 'SOLD');

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Top Breadcrumb & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 zayq-glass-card rounded-2xl p-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                            {passport.passportId}
                        </span>
                        <span className="text-xs font-mono text-slate-400">MST Registered Passport</span>
                    </div>
                    <h1 className="text-xl font-extrabold text-white font-sans mt-0.5">{passport.model}</h1>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setShowQrModal(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700 font-medium"
                    >
                        <QrCode size={15} className="text-cyan-400" />
                        <span>Generate Passport QR</span>
                    </button>

                    {isOwner && !isForSale && !isStolen && (
                        <button
                            onClick={() => onNavigate('create-listing', passport.passportId)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-900/30"
                        >
                            <Tag size={15} />
                            <span>List on Marketplace</span>
                        </button>
                    )}

                    {activeListing && (
                        <button
                            onClick={() => onNavigate('listing-detail', activeListing.id)}
                            className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold text-xs px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                            <Tag size={15} />
                            <span>View Marketplace Listing</span>
                        </button>
                    )}

                    {!isOwner && !isStolen && (
                        <button
                            onClick={() => onNavigate('stolen-dispute', passport.passportId)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                            <AlertOctagon size={15} />
                            <span>Report Theft / Dispute</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Images, Overview & Verification Badges) */}
                <div className="space-y-6">
                    {/* Main Image */}
                    <div className="zayq-glass-card rounded-2xl overflow-hidden relative group">
                        <img
                            src={passport.imageUrl}
                            alt={passport.model}
                            className="w-full h-64 object-cover bg-slate-950"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                            <VerificationBadge level={passport.verificationLevel} size="md" />
                            <StatusBadge status={passport.currentStatus} />
                        </div>
                    </div>

                    {/* Device Identifiers Box (NO NFC) */}
                    <div className="zayq-glass-card rounded-2xl p-5 space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="font-bold text-white font-sans">Cryptographic Product Identity</span>
                            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                Pure Identity (No NFC)
                            </span>
                        </div>

                        <div className="space-y-2 text-slate-300">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Category:</span>
                                <span>{passport.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Brand / Model:</span>
                                <span className="text-white font-sans font-medium">{passport.brand} ({passport.releaseYear})</span>
                            </div>

                            {passport.identifier.serialNumber && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Serial Number:</span>
                                    <span className="text-cyan-300 font-bold">{passport.identifier.serialNumber}</span>
                                </div>
                            )}

                            {passport.identifier.imei && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">IMEI Identifier:</span>
                                    <span className="text-cyan-300 font-bold">{passport.identifier.imei}</span>
                                </div>
                            )}

                            {passport.identifier.serviceTag && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Service Tag / Frame:</span>
                                    <span className="text-cyan-300 font-bold">{passport.identifier.serviceTag}</span>
                                </div>
                            )}

                            <div className="pt-2 border-t border-slate-800/80">
                                <span className="text-slate-500 block text-[10px]">On-Chain Privacy Hash:</span>
                                <span className="text-[10px] text-slate-400 break-all">{passport.identifier.hashedIdentifier}</span>
                            </div>
                        </div>
                    </div>

                    {/* Current Owner Card */}
                    <div className="zayq-glass-card rounded-2xl p-5 space-y-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">Current Verified Owner</span>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-white text-base font-sans">{passport.currentOwnerName}</h4>
                                <p className="text-xs font-mono text-cyan-400 mt-0.5">{passport.currentOwnerDid}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold">
                                {passport.currentOwnerName.charAt(0)}
                            </div>
                        </div>
                    </div>

                    {/* AI Inspector & Fraud Risk Engine */}
                    <AIInspectorWidget
                        riskLevel={passport.riskLevel}
                        riskScore={passport.riskScore}
                        riskSignals={passport.riskSignals}
                        conditionReport={passport.conditionReport}
                    />
                </div>

                {/* Right 2 Columns (Timeline, Service Records, Inspection & Attestations) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Layered Verification Claims Grid */}
                    <div className="zayq-glass-card rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                                <Shield size={18} className="text-cyan-400" />
                                <span>Layered Attestations & Claims</span>
                            </h3>
                            <span className="text-xs text-slate-400 font-mono">
                                {passport.attestations.length} Active On-Chain Claims
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-200">Identity Claim</span>
                                    <span className="text-[10px] text-cyan-400 font-mono">VERIFIED</span>
                                </div>
                                <p className="text-slate-400 text-[11px]">Category serial hash verified against platform registry.</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-200">Ownership Claim</span>
                                    <span className="text-[10px] text-emerald-400 font-mono">INVOICE MATCHED</span>
                                </div>
                                <p className="text-slate-400 text-[11px]">Tax invoice evidence hash anchored on MST.</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-200">Inspection Claim</span>
                                    <span className="text-[10px] text-purple-400 font-mono">
                                        {passport.inspectionRecords[0] ? 'TECHCERT 9.8/10' : 'NO RECORD'}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-[11px]">42-point hardware diagnostic test passed.</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-200">Warranty Claim</span>
                                    <span className="text-[10px] text-amber-400 font-mono">
                                        {passport.warrantyRecord?.status || 'N/A'}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-[11px]">
                                    {passport.warrantyRecord?.provider || 'No active manufacturer warranty found'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Verified OEM Service Records */}
                    <div className="zayq-glass-card rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                                <Wrench size={18} className="text-amber-400" />
                                <span>Verified Service History ({passport.serviceRecords.length})</span>
                            </h3>

                            <button
                                onClick={() => onNavigate('service-portal', passport.passportId)}
                                className="text-xs text-amber-400 hover:text-amber-300 font-mono hover:underline"
                            >
                                + Add Service Record
                            </button>
                        </div>

                        {passport.serviceRecords.length === 0 ? (
                            <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl border border-slate-800">
                                No verified service records logged yet. Note: Missing history does not imply unserviced.
                            </p>
                        ) : (
                            <div className="space-y-3 font-mono text-xs">
                                {passport.serviceRecords.map((svc) => (
                                    <div key={svc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white font-sans">{svc.serviceType.replace('_', ' ')}</span>
                                                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                                    OEM Verified
                                                </span>
                                            </div>
                                            <span className="text-slate-500 text-[10px]">{new Date(svc.date).toLocaleDateString()}</span>
                                        </div>

                                        <p className="text-slate-300 font-sans text-xs">{svc.description}</p>

                                        {svc.partsReplaced.length > 0 && (
                                            <div className="text-[11px]">
                                                <span className="text-slate-500">Parts Replaced: </span>
                                                <span className="text-cyan-300">{svc.partsReplaced.join(', ')}</span>
                                            </div>
                                        )}

                                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                                            <span className="text-slate-400">By: {svc.serviceCenterName}</span>
                                            <button
                                                onClick={() => onOpenMSTExplorer(svc.mstTxHash)}
                                                className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                                            >
                                                <span>MST Service Anchor</span>
                                                <ExternalLink size={10} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Timeline of Product Identity Events */}
                    <div className="zayq-glass-card rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                                <Calendar size={18} className="text-cyan-400" />
                                <span>Persistent Product Lifecycle Timeline</span>
                            </h3>
                            <span className="text-xs text-slate-400 font-mono">
                                {passport.lifecycleHistory.length} Lifecycle Anchors
                            </span>
                        </div>

                        <PassportTimeline
                            events={passport.lifecycleHistory}
                            onOpenMSTExplorer={onOpenMSTExplorer}
                        />
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            <QRModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                passportId={passport.passportId}
            />
        </div>
    );
};
