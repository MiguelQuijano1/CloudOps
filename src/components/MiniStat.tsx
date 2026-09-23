import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MiniStatProps {
    label: string;
    value: string;
    icon: LucideIcon;
    footnote?: string;
    tone?: 'primary' | 'security' | 'costs' | 'alerts' | 'neutral';
}

const TONE_CLASSES: Record<string, string> = {
    primary: 'bg-blue-50 dark:bg-blue-950/40 text-primary',
    security: 'bg-emerald-50 dark:bg-emerald-950/40 text-security',
    costs: 'bg-amber-50 dark:bg-amber-950/40 text-costs',
    alerts: 'bg-red-50 dark:bg-red-950/40 text-alerts',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-textSec',
};

export const MiniStat: React.FC<MiniStatProps> = ({
    label,
    value,
    icon: Icon,
    footnote,
    tone = 'primary',
}) => (
    <div className="bg-cards border border-borders rounded-2xl p-5 shadow-xs card-hover">
        <div className="flex items-center justify-between mb-2">
            <span className="text-textSec text-xs font-semibold uppercase tracking-wide">{label}</span>
            <div className={`p-1.5 rounded-lg ${TONE_CLASSES[tone]}`}>
                <Icon size={16} />
            </div>
        </div>
        <p className="text-2xl font-bold text-textMain">{value}</p>
        {footnote && <p className="text-xs text-textSec mt-1">{footnote}</p>}
    </div>
);