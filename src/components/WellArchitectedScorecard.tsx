import React from 'react';
import { Settings2, ShieldCheck, LifeBuoy, Gauge, DollarSign, Leaf } from 'lucide-react';

interface Pillar {
    key: string;
    label: string;
    icon: React.ElementType;
    score: number;
}

interface WellArchitectedScorecardProps {
    securityScore: number;
    healthPercent: number;
    degraded?: boolean;
}

export const WellArchitectedScorecard: React.FC<WellArchitectedScorecardProps> = ({
    securityScore,
    healthPercent,
    degraded = false,
}) => {
    const pillars: Pillar[] = [
        { key: 'ops', label: 'Excelencia Operacional', icon: Settings2, score: degraded ? 62 : 88 },
        { key: 'sec', label: 'Seguridad', icon: ShieldCheck, score: securityScore },
        { key: 'rel', label: 'Confiabilidad', icon: LifeBuoy, score: healthPercent },
        { key: 'perf', label: 'Eficiencia de Rendimiento', icon: Gauge, score: degraded ? 58 : 84 },
        { key: 'cost', label: 'Optimización de Costos', icon: DollarSign, score: 76 },
        { key: 'sus', label: 'Sostenibilidad', icon: Leaf, score: 70 },
    ];

    const overall = Math.round(pillars.reduce((a, p) => a + p.score, 0) / pillars.length);

    const barColor = (v: number) => (v >= 80 ? 'bg-security' : v >= 60 ? 'bg-costs' : 'bg-alerts');
    const textColor = (v: number) => (v >= 80 ? 'text-security' : v >= 60 ? 'text-costs' : 'text-alerts');

    return (
        <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h2 className="text-base font-bold text-textMain">AWS Well-Architected Framework</h2>
                    <p className="text-xs text-textSec mt-0.5">Evaluación de los 6 pilares sobre la carga de trabajo activa</p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold leading-none ${textColor(overall)}`}>{overall}</p>
                    <p className="text-[10px] font-semibold text-textSec uppercase tracking-wider">Score global</p>
                </div>
            </div>

            <div className="space-y-3">
                {pillars.map((p) => {
                    const Icon = p.icon;
                    return (
                        <div key={p.key} className="flex items-center gap-3">
                            <Icon size={15} className="text-textSec shrink-0" />
                            <span className="text-xs font-semibold text-textMain w-44 shrink-0 truncate">{p.label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-borders overflow-hidden">
                                <div className={`h-full rounded-full ${barColor(p.score)}`} style={{ width: `${p.score}%` }} />
                            </div>
                            <span className={`text-xs font-bold w-9 text-right shrink-0 ${textColor(p.score)}`}>{p.score}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};