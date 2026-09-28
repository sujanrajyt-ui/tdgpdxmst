import React from 'react';

interface EyebrowProps {
    children: React.ReactNode;
    tone?: 'cyan' | 'purple' | 'amber' | 'rose';
}

const toneMap = {
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
};

export const ZayqEyebrow: React.FC<EyebrowProps> = ({ children, tone = 'cyan' }) => (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-zayq uppercase ${toneMap[tone]}`}>
        {children}
    </div>
);

interface PageHeaderProps {
    eyebrow?: React.ReactNode;
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export const ZayqPageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description, actions }) => (
    <div className="zayq-glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 space-y-2">
            {eyebrow}
            <h1 className="text-2xl font-black text-white tracking-tight font-sans">{title}</h1>
            {description && <p className="text-xs text-slate-400 font-mono">{description}</p>}
        </div>
        {actions && <div className="relative z-10 flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
);

export const ZayqCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`zayq-glass-card rounded-2xl ${className}`}>{children}</div>
);
