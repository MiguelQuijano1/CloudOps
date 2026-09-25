import React, { useMemo } from 'react';
import { Activity, Cpu, ArrowDownUp, Timer, Database, AlertTriangle } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { getServiceDescription } from '../data/serviceInfo';

interface MetricDef {
    key: string;
    label: string;
    namespace: string;
    unit: string;
    icon: React.ElementType;
    base: number;
    variance: number;
    tone: 'primary' | 'security' | 'costs' | 'alerts';
    decimals?: number;
}

const METRICS: MetricDef[] = [
    { key: 'cpu', label: 'CPUUtilization', namespace: 'AWS/EC2', unit: '%', icon: Cpu, base: 34, variance: 14, tone: 'primary' },
    { key: 'netIn', label: 'NetworkIn', namespace: 'AWS/EC2', unit: 'MB/s', icon: ArrowDownUp, base: 12.4, variance: 5, tone: 'primary', decimals: 1 },
    { key: 'conn', label: 'DatabaseConnections', namespace: 'AWS/RDS', unit: 'conn', icon: Database, base: 48, variance: 20, tone: 'security' },
    { key: 'latency', label: 'TargetResponseTime p99', namespace: 'AWS/ApplicationELB', unit: 'ms', icon: Timer, base: 118, variance: 40, tone: 'costs', decimals: 0 },
    { key: 'requests', label: 'RequestCount', namespace: 'AWS/ApplicationELB', unit: 'req/min', icon: Activity, base: 2400, variance: 600, tone: 'primary', decimals: 0 },
    { key: 'errors', label: '5xxErrorRate', namespace: 'AWS/ApplicationELB', unit: '%', icon: AlertTriangle, base: 0.18, variance: 0.15, tone: 'alerts', decimals: 2 },
];

const TONE_TEXT: Record<string, string> = {
    primary: 'text-primary',
    security: 'text-security',
    costs: 'text-costs',
    alerts: 'text-alerts',
};
const TONE_BG: Record<string, string> = {
    primary: 'bg-blue-50 dark:bg-blue-950/40',
    security: 'bg-emerald-50 dark:bg-emerald-950/40',
    costs: 'bg-amber-50 dark:bg-amber-950/40',
    alerts: 'bg-red-50 dark:bg-red-950/40',
};
const TONE_STROKE: Record<string, string> = {
    primary: '#2563EB',
    security: '#16A34A',
    costs: '#F59E0B',
    alerts: '#DC2626',
};

/** Genera 24 puntos pseudo-aleatorios pero deterministas (seed por string) para simular datapoints de CloudWatch. */
function seededSeries(seed: string, base: number, variance: number, degraded: boolean): number[] {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const points: number[] = [];
    for (let i = 0; i < 24; i++) {
        h = (h * 1103515245 + 12345) >>> 0;
        const rand = (h % 1000) / 1000;
        const wave = Math.sin(i / 3 + (h % 7)) * 0.5 + 0.5;
        let v = base + (rand - 0.5) * variance * 1.4 + (wave - 0.5) * variance * 0.6;
        if (degraded) v += variance * 0.9;
        points.push(Math.max(0, v));
    }
    return points;
}

function sparklinePath(points: number[], w: number, h: number): string {
    const max = Math.max(...points, 0.001);
    const min = Math.min(...points);
    const range = max - min || 1;
    return points
        .map((p, i) => {
            const x = (i / (points.length - 1)) * w;
            const y = h - ((p - min) / range) * h;
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
}

interface CloudWatchMetricsProps {
    regionId: string;
    degraded?: boolean;
}

export const CloudWatchMetrics: React.FC<CloudWatchMetricsProps> = ({ regionId, degraded = false }) => {
    const series = useMemo(
        () =>
            METRICS.map((m) => ({
                ...m,
                data: seededSeries(`${regionId}-${m.key}`, m.base, m.variance, degraded),
            })),
        [regionId, degraded]
    );

    return (
        <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h2 className="text-base font-bold text-textMain flex items-center gap-2">
                        <Activity size={18} className="text-primary" />
                        Métricas CloudWatch en Tiempo Real
                    </h2>
                    <p className="text-xs text-textSec mt-0.5">
                        Namespaces <code>AWS/EC2</code>, <code>AWS/RDS</code> y <code>AWS/ApplicationELB</code> · región{' '}
                        <strong className="text-textMain">{regionId}</strong> · período 5 min
                    </p>
                </div>
                <span className="text-[11px] font-semibold text-textSec flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-security animate-pulse" /> Streaming activo
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {series.map((m) => {
                    const Icon = m.icon;
                    const last = m.data[m.data.length - 1];
                    const prev = m.data[m.data.length - 2];
                    const delta = prev ? ((last - prev) / prev) * 100 : 0;
                    const path = sparklinePath(m.data, 140, 36);
                    const description = getServiceDescription(m.label) ?? `Métrica de ${m.namespace}.`;
                    return (
                        <div key={m.key} className="p-4 rounded-xl border border-borders bg-bgMain">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <InfoTooltip text={description}>
                                        <div className={`p-1.5 rounded-lg shrink-0 cursor-help ${TONE_BG[m.tone]} ${TONE_TEXT[m.tone]}`}>
                                            <Icon size={14} />
                                        </div>
                                    </InfoTooltip>
                                    <div className="min-w-0">
                                        <InfoTooltip text={description} className="max-w-full">
                                            <p className="text-[11px] font-bold text-textMain truncate cursor-help">{m.label}</p>
                                        </InfoTooltip>
                                        <p className="text-[10px] text-textSec truncate">{m.namespace}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold shrink-0 ${delta >= 0 ? 'text-alerts' : 'text-security'}`}>
                                    {delta >= 0 ? '+' : ''}
                                    {delta.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex items-end justify-between gap-2">
                                <p className="text-xl font-bold text-textMain leading-none">
                                    {last.toFixed(m.decimals ?? 1)}
                                    <span className="text-xs font-semibold text-textSec ml-1">{m.unit}</span>
                                </p>
                                <svg width="90" height="30" viewBox="0 0 140 36" preserveAspectRatio="none" className="shrink-0">
                                    <path d={path} fill="none" stroke={TONE_STROKE[m.tone]} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};