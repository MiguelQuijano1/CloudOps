import React from 'react';

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
    badge?: {
        label: string;
        tone?: 'security' | 'primary' | 'costs' | 'alerts';
    };
    actions?: React.ReactNode;
}

const TONE_CLASSES: Record<string, string> = {
    security: 'bg-security/10 text-security border-security/20',
    primary: 'bg-primary/10 text-primary border-primary/20',
    costs: 'bg-costs/10 text-costs border-costs/20',
    alerts: 'bg-alerts/10 text-alerts border-alerts/20',
};

export const PageHeader: React.FC<PageHeaderProps> = ({
    eyebrow,
    title,
    description,
    badge,
    actions,
}) => (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1.5">
                {eyebrow}
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-[26px] font-bold text-textMain leading-tight">{title}</h1>
                {badge && (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${TONE_CLASSES[badge.tone ?? 'primary']
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {badge.label}
                    </span>
                )}
            </div>
            {description && (
                <p className="text-textSec text-sm mt-1.5 max-w-2xl leading-relaxed">{description}</p>
            )}
        </div>
        {actions && <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div>}
    </div>
);