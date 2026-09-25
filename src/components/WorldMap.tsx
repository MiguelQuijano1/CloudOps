import React, { useMemo, useState } from 'react';
import type { RegionInfo } from '../types';
import { WORLD_LAND_PATH_D } from '../data/worldLandPath';

interface WorldMapProps {
    regions: RegionInfo[];
    selectedRegionId?: string;
    onRegionClick?: (region: RegionInfo) => void;
}

const VIEW_W = 1000;
const VIEW_H = 440;

// Recorte de latitud: se excluye la Antártida (y casi todo el círculo polar ártico)
// para no desperdiciar espacio vertical con zonas vacías. Debe coincidir exactamente
// con el recorte usado al generar WORLD_LAND_PATH_D (ver src/data/worldLandPath.ts).
const LAT_MAX = 80;
const LAT_MIN = -60;

/** Proyección equirectangular recortada: lat/lon -> coordenadas del viewBox. */
function project(lat: number, lon: number) {
    const x = ((lon + 180) / 360) * VIEW_W;
    const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_H;
    return { x, y };
}

const STATUS_COLOR: Record<RegionInfo['status'], string> = {
    Operational: '#16A34A',
    Degraded: '#F59E0B',
    Maintenance: '#DC2626',
};

export const WorldMap: React.FC<WorldMapProps> = ({ regions, selectedRegionId, onRegionClick }) => {
    const [hoverId, setHoverId] = useState<string | null>(null);

    const hub = useMemo(() => regions.find((r) => r.isHub) ?? regions[0], [regions]);
    const hubPos = hub ? project(hub.lat, hub.lon) : null;

    return (
        <div className="bg-cards border border-borders rounded-2xl p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                    <h2 className="text-base font-bold text-textMain">Mapa Global de Infraestructura</h2>
                    <p className="text-xs text-textSec mt-0.5">
                        Ubicación física de las {regions.length} regiones AWS activas y enlaces de backbone hacia el hub primario ({hub?.name}).
                    </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-semibold text-textSec">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-security" /> Operacional
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-costs" /> Degradado
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-alerts" /> Mantenimiento
                    </span>
                </div>
            </div>

            <div className="relative w-full aspect-[1000/440] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-full block" role="img" aria-label="Mapa global de regiones desplegadas">
                    <defs>
                        <radialGradient id="mapGlow" cx="50%" cy="35%" r="85%">
                            <stop offset="0%" stopColor="#0B1830" />
                            <stop offset="100%" stopColor="#050B18" />
                        </radialGradient>
                        {/* Degradado tipo "globo iluminado" para el relleno de los continentes,
                            más claro arriba-izquierda (simulando luz) y más oscuro/azulado hacia abajo. */}
                        <linearGradient id="landGradient" x1="0%" y1="0%" x2="55%" y2="100%">
                            <stop offset="0%" stopColor="#6FA3C4" />
                            <stop offset="45%" stopColor="#4C87AC" />
                            <stop offset="100%" stopColor="#2F6486" />
                        </linearGradient>
                        <filter id="landShadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000814" floodOpacity="0.45" />
                        </filter>
                    </defs>

                    <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#mapGlow)" />

                    {/* Continentes con silueta geográfica real (land-110m, proyección equirectangular),
                        con relleno degradado tipo globo iluminado y borde de costa sutil. */}
                    <path
                        d={WORLD_LAND_PATH_D}
                        fill="url(#landGradient)"
                        stroke="#8FC2DE"
                        strokeOpacity="0.55"
                        strokeWidth="0.7"
                        filter="url(#landShadow)"
                    />

                    {/* Líneas de backbone: hub -> cada región */}
                    {hubPos &&
                        regions
                            .filter((r) => r.id !== hub?.id)
                            .map((r) => {
                                const p = project(r.lat, r.lon);
                                const midX = (hubPos.x + p.x) / 2;
                                const midY = Math.min(hubPos.y, p.y) - 55;
                                const path = `M ${hubPos.x} ${hubPos.y} Q ${midX} ${midY} ${p.x} ${p.y}`;
                                const isDown = r.status !== 'Operational';
                                return (
                                    <g key={r.id}>
                                        <path d={path} fill="none" stroke={isDown ? '#DC2626' : '#2563EB'} strokeOpacity="0.35" strokeWidth="1.5" />
                                        <path
                                            d={path}
                                            fill="none"
                                            stroke={isDown ? '#F87171' : '#60A5FA'}
                                            strokeWidth="1.5"
                                            strokeDasharray="4 7"
                                            className="map-flow-line"
                                        />
                                    </g>
                                );
                            })}

                    {/* Marcadores de región */}
                    {regions.map((r) => {
                        const p = project(r.lat, r.lon);
                        const color = STATUS_COLOR[r.status];
                        const active = hoverId === r.id || selectedRegionId === r.id;

                        // Anti-colisión simple de etiquetas según cercanía a los bordes del mapa.
                        const flipLeft = p.x > VIEW_W - 140;
                        const flipDown = p.y < 46;
                        const textAnchor = flipLeft ? 'end' : 'start';
                        const xOffset = flipLeft ? -10 : 10;
                        const yName = flipDown ? 24 : -14;
                        const yId = flipDown ? 36 : -2;
                        const yInfo = flipDown ? 48 : 12;

                        return (
                            <g
                                key={r.id}
                                transform={`translate(${p.x} ${p.y})`}
                                onMouseEnter={() => setHoverId(r.id)}
                                onMouseLeave={() => setHoverId(null)}
                                onClick={() => onRegionClick?.(r)}
                                style={{ cursor: onRegionClick ? 'pointer' : 'default' }}
                            >
                                <circle r="10" fill={color} opacity="0.18" className="map-pulse" />
                                {r.isHub && <circle r="14" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />}
                                <circle r={active ? 6 : 5} fill={color} stroke="#020617" strokeWidth="2" />
                                <text
                                    x={xOffset}
                                    y={yName}
                                    textAnchor={textAnchor}
                                    fontSize="11"
                                    fontWeight="700"
                                    fill={active ? '#FFFFFF' : '#E2E8F0'}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {r.name}
                                </text>
                                <text x={xOffset} y={yId} textAnchor={textAnchor} fontSize="9.5" fontFamily="monospace" fill="#7C93B8">
                                    {r.id}
                                </text>
                                <text x={xOffset} y={yInfo} textAnchor={textAnchor} fontSize="9" fill="#64748B" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {r.deployedServicesCount} servicios · {r.location}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {regions.map((r) => (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => onRegionClick?.(r)}
                        onMouseEnter={() => setHoverId(r.id)}
                        onMouseLeave={() => setHoverId(null)}
                        className={`text-left p-3 rounded-xl border transition-colors ${selectedRegionId === r.id || hoverId === r.id
                            ? 'border-primary bg-blue-50 dark:bg-blue-950/30'
                            : 'border-borders bg-bgMain'
                            }`}
                    >
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[r.status] }} />
                            <span className="text-[11px] font-bold text-textMain truncate">{r.name}</span>
                        </div>
                        <p className="text-[10px] text-textSec">{r.location} · {r.id}</p>
                        <p className="text-[10px] text-textSec mt-0.5">{r.deployedServicesCount} servicios{r.isHub ? ' · Hub' : ''}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};