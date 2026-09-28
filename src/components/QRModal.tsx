import React from 'react';
import { X, QrCode, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    passportId: string;
}

export const QRModal: React.FC<Props> = ({ isOpen, onClose, passportId }) => {
    if (!isOpen) return null;

    const passportUrl = `${window.location.origin}/passport/${passportId}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                    <X size={18} />
                </button>

                <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                        <QrCode size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-white font-sans">Product Passport QR</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{passportId}</p>

                    {/* Render Visual Simulated High-res QR code SVG */}
                    <div className="my-5 p-4 bg-white rounded-xl shadow-inner inline-block mx-auto border-4 border-cyan-500/20 relative">
                        <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Outer boundary position markers */}
                            <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
                            <rect x="8" y="8" width="19" height="19" fill="#ffffff" />
                            <rect x="12" y="12" width="11" height="11" fill="#0f172a" />

                            <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
                            <rect x="73" y="8" width="19" height="19" fill="#ffffff" />
                            <rect x="77" y="12" width="11" height="11" fill="#0f172a" />

                            <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
                            <rect x="8" y="73" width="19" height="19" fill="#ffffff" />
                            <rect x="12" y="77" width="11" height="11" fill="#0f172a" />

                            {/* Internal simulated data matrix pattern */}
                            <rect x="35" y="10" width="6" height="6" fill="#0f172a" />
                            <rect x="45" y="10" width="6" height="6" fill="#0f172a" />
                            <rect x="55" y="10" width="6" height="6" fill="#0f172a" />
                            <rect x="35" y="25" width="6" height="6" fill="#0f172a" />
                            <rect x="50" y="20" width="6" height="6" fill="#0f172a" />

                            <rect x="10" y="35" width="6" height="6" fill="#0f172a" />
                            <rect x="25" y="35" width="6" height="6" fill="#0f172a" />
                            <rect x="40" y="35" width="15" height="6" fill="#0f172a" />
                            <rect x="60" y="35" width="6" height="6" fill="#0f172a" />
                            <rect x="75" y="35" width="15" height="6" fill="#0f172a" />

                            <rect x="10" y="50" width="6" height="6" fill="#0f172a" />
                            <rect x="30" y="45" width="6" height="12" fill="#0f172a" />
                            <rect x="50" y="50" width="12" height="6" fill="#0f172a" />
                            <rect x="70" y="50" width="6" height="6" fill="#0f172a" />
                            <rect x="85" y="50" width="6" height="6" fill="#0f172a" />

                            <rect x="35" y="65" width="10" height="10" fill="#0f172a" />
                            <rect x="55" y="65" width="6" height="6" fill="#0f172a" />
                            <rect x="70" y="65" width="6" height="6" fill="#0f172a" />

                            <rect x="35" y="80" width="6" height="6" fill="#0f172a" />
                            <rect x="48" y="75" width="6" height="12" fill="#0f172a" />
                            <rect x="65" y="80" width="15" height="6" fill="#0f172a" />
                            <rect x="85" y="80" width="6" height="6" fill="#0f172a" />

                            {/* Central Logo Shield */}
                            <circle cx="50" cy="50" r="10" fill="#06b6d4" />
                        </svg>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-left mb-4">
                        <div className="flex items-start gap-2 text-xs text-amber-300">
                            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block">Important Trust Principle</span>
                                <span className="text-[11px] opacity-90 leading-tight block">
                                    This QR code provides rapid URL navigation to <span className="font-mono text-cyan-300">/passport/{passportId}</span>. It is NOT physical authentication proof. Authenticity relies on verified serial hashes + MST attestations.
                                </span>
                            </div>
                        </div>
                    </div>

                    <a
                        href={passportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl text-xs transition-colors"
                    >
                        <span>Open Direct Link</span>
                        <ExternalLink size={13} />
                    </a>
                </div>
            </div>
        </div>
    );
};
