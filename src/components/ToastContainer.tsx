import React from 'react';
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const typeIcon = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
};

const typeStyle = {
    info: 'border-primary/30 text-primary',
    success: 'border-security/30 text-security',
    warning: 'border-costs/30 text-costs',
    error: 'border-alerts/30 text-alerts',
};

export const ToastContainer: React.FC = () => {
    const { toasts, dismissToast } = useApp();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-80">
            {toasts.map((t) => {
                const Icon = typeIcon[t.type];
                return (
                    <div
                        key={t.id}
                        role="status"
                        className={`flex items-center gap-3 bg-cards border ${typeStyle[t.type]} rounded-xl shadow-xs px-4 py-3 animate-slide-down`}
                    >
                        <Icon size={18} className="shrink-0" />
                        <p className="text-xs font-semibold text-textMain flex-1 truncate">{t.title}</p>
                        <button
                            onClick={() => dismissToast(t.id)}
                            className="p-1 rounded-lg text-textSec hover:bg-bgMain transition-colors shrink-0"
                            aria-label="Cerrar"
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};