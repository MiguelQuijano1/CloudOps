import React, { useMemo, useState } from 'react';
import type { RegionInfo } from '../types';

interface WorldMapProps {
    regions: RegionInfo[];
    selectedRegionId?: string;
    onRegionClick?: (region: RegionInfo) => void;
}

const VIEW_W = 1000;
const VIEW_H = 440;

/** Proyección equirectangular simple: lat/lon -> coordenadas del viewBox. */
function project(lat: number, lon: number) {
    const x = ((lon + 180) / 360) * VIEW_W;
    const y = ((90 - lat) / 180) * VIEW_H;
    return { x, y };
}

/** Siluetas continentales simplificadas (estilo low-poly / dot-matrix), definidas por centro
 *  lat/lon aproximado y tamaño en grados, proyectadas dinámicamente para escalar con cualquier
 *  VIEW_H. Se incluyen masas menores (Groenlandia, Japón, India, Madagascar, Nueva Zelanda...)
 *  para que el mapa se perciba completo y no solo como 4 manchas grandes. */
const CONTINENT_DEFS: { lat: number; lon: number; rxDeg: number; ryDeg: number; rotate?: number }[] = [
    { lat: 63, lon: -155, rxDeg: 15, ryDeg: 11 }, // Alaska
    { lat: 45, lon: -100, rxDeg: 46, ryDeg: 30, rotate: -8 }, // Norteamérica
    { lat: 72, lon: -42, rxDeg: 11, ryDeg: 13 }, // Groenlandia
    { lat: 20, lon: -90, rxDeg: 10, ryDeg: 12 }, // Centroamérica
    { lat: -18, lon: -60, rxDeg: 21, ryDeg: 40, rotate: 8 }, // Sudamérica
    { lat: 54, lon: -4, rxDeg: 5, ryDeg: 6 }, // Reino Unido / Irlanda
    { lat: 61, lon: 16, rxDeg: 8, ryDeg: 11 }, // Escandinavia
    { lat: 48, lon: 15, rxDeg: 18, ryDeg: 12 }, // Europa
    { lat: 3, lon: 20, rxDeg: 26, ryDeg: 41 }, // África
    { lat: -20, lon: 47, rxDeg: 3, ryDeg: 6 }, // Madagascar
    { lat: 22, lon: 45, rxDeg: 14, ryDeg: 11 }, // Medio Oriente
    { lat: 24, lon: 79, rxDeg: 13, ryDeg: 13 }, // India
    { lat: 48, lon: 100, rxDeg: 60, ryDeg: 34 }, // Asia
    { lat: 37, lon: 138, rxDeg: 4, ryDeg: 9, rotate: 20 }, // Japón
    { lat: -25, lon: 135, rxDeg: 21, ryDeg: 13 }, // Oceanía / Australia
    { lat: -41, lon: 174, rxDeg: 3, ryDeg: 6 }, // Nueva Zelanda
];

const STATUS_COLOR: Record<RegionInfo['status'], string> = {
    Operational: '#16A34A',
    Degraded: '#F59E0B',
    Maintenance: '#DC2626',
};

export const WorldMap: React.FC<WorldMapProps> = ({ regions, selectedRegionId, onRegionClick }) => {
    const [hoverId, setHoverId] = useState<string | null>(null);

    const hub = useMemo(() => regions.find((r) => r.isHub) ?? regions[0], [regions]);
    const hubPos = hub ? project(hub.lat, hub.lon) : null;

    const dotGridId = 'worldmap-dot-grid';

    // Líneas de graticula (meridianos/paralelos) muy tenues para reforzar la sensación de "mapa completo".
    const graticuleLons = useMemo(() => Array.from({ length: 7 }, (_, i) => -180 + i * 60), []);
    const graticuleLats = useMemo(() => [-60, -30, 0, 30, 60], []);

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
                        <pattern id={dotGridId} width="7" height="7" patternUnits="userSpaceOnUse">
                            <circle cx="1.1" cy="1.1" r="1.1" fill="#2E4269" />
                        </pattern>
                        <radialGradient id="mapGlow" cx="50%" cy="35%" r="85%">
                            <stop offset="0%" stopColor="#0F1E3D" />
                            <stop offset="100%" stopColor="#060B18" />
                        </radialGradient>
                    </defs>

                    <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#mapGlow)" />

                    {/* Graticula: meridianos y paralelos de referencia, muy tenues */}
                    <g stroke="#1E2E4E" strokeWidth="0.6" opacity="0.55">
                        {graticuleLons.map((lon) => {
                            const p = project(0, lon);
                            return <line key={`m-${lon}`} x1={p.x} y1="0" x2={p.x} y2={VIEW_H} />;
                        })}
                        {graticuleLats.map((lat) => {
                            const p = project(lat, 0);
                            return <line key={`p-${lat}`} x1="0" y1={p.y} x2={VIEW_W} y2={p.y} />;
                        })}
                        <line x1="0" y1={VIEW_H / 2} x2={VIEW_W} y2={VIEW_H / 2} stroke="#2E4269" strokeWidth="0.9" />
                    </g>

                    {/* Continentes estilizados como retículas de puntos (silueta aproximada) */}
                    <g opacity="0.9">
                        {CONTINENT_DEFS.map((c, i) => {
                            const center = project(c.lat, c.lon);
                            const rx = (c.rxDeg / 360) * VIEW_W;
                            const ry = (c.ryDeg / 180) * VIEW_H;
                            return (
                                <ellipse
                                    key={i}
                                    cx={center.x}
                                    cy={center.y}
                                    rx={rx}
                                    ry={ry}
                                    transform={c.rotate ? `rotate(${c.rotate} ${center.x} ${center.y})` : undefined}
                                    fill={`url(#${dotGridId})`}
                                />
                            );
                        })}
                    </g>

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