import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DonutSlice {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutSlice[];
  title?: string;
}

const PALETTE = [
  '#2563EB',
  '#F59E0B',
  '#16A34A',
  '#DC2626',
  '#7C3AED',
  '#0891B2',
  '#64748B',
];

const SIZE = 220;
const RADIUS = 90;
const INNER_RADIUS = RADIUS - 32;

export const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  const active = hovered !== null ? data[hovered] : null;

  // Clave estable: solo cambia cuando realmente cambian labels o valores
  const dataKey = data.map((d) => `${d.label}:${d.value}`).join('|');

  // Dibuja el gráfico solo cuando cambian los datos reales
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${SIZE} ${SIZE}`)
      .attr('width', SIZE)
      .attr('height', SIZE);

    const g = svg
      .append('g')
      .attr('transform', `translate(${SIZE / 2},${SIZE / 2})`);

    const pie = d3
      .pie<DonutSlice>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<DonutSlice>>()
      .innerRadius(INNER_RADIUS)
      .outerRadius(RADIUS);

    const arcHover = d3
      .arc<d3.PieArcDatum<DonutSlice>>()
      .innerRadius(INNER_RADIUS - 2)
      .outerRadius(RADIUS + 6);

    const arcs = g
      .selectAll<SVGPathElement, d3.PieArcDatum<DonutSlice>>('path')
      .data(pie(data))
      .join('path')
      .attr('fill', (_d, i) => PALETTE[i % PALETTE.length])
      .attr('stroke', 'var(--color-cards)')
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer')
      // Path final desde el inicio (evita attrTween y el error de arc flag)
      .attr('d', (d) => arc(d) ?? '')
      .attr('opacity', 0);

    // Entrada suave solo con opacity (sin interpolar el path)
    arcs
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('opacity', 1);

    arcs
      .on('mouseenter', function (_event, d) {
        const idx = data.findIndex((s) => s.label === d.data.label);
        setHovered(idx >= 0 ? idx : null);

        d3.select(this)
          .interrupt()
          .transition()
          .duration(150)
          .attr('d', arcHover(d) ?? '');
      })
      .on('mouseleave', function (_event, d) {
        setHovered(null);

        d3.select(this)
          .interrupt()
          .transition()
          .duration(150)
          .attr('d', arc(d) ?? '');
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey]);

  // Solo opacidad en hover desde la leyenda (sin tocar el path aquí)
  useEffect(() => {
    if (!svgRef.current) return;

    const paths = d3
      .select(svgRef.current)
      .selectAll<SVGPathElement, d3.PieArcDatum<DonutSlice>>('path');

    paths.each(function (_d, i) {
      d3.select(this)
        .interrupt()
        .transition()
        .duration(150)
        .attr('opacity', hovered === null || hovered === i ? 1 : 0.35);
    });
  }, [hovered, dataKey]);

  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-10">
      {/* Gráfico más grande */}
      <div
        className="relative shrink-0"
        style={{ width: SIZE, height: SIZE }}
      >
        <svg ref={svgRef} />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
          <span className="text-xs text-textSec truncate max-w-[120px] text-center">
            {active ? active.label : 'Total'}
          </span>
          <span className="text-xl font-bold text-textMain mt-0.5">
            ${active ? active.value.toFixed(0) : total.toFixed(0)}
          </span>
          {active && (
            <span className="text-[11px] text-textSec mt-0.5">
              {((active.value / total) * 100).toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Leyenda compacta */}
      <div className="flex-1 w-full min-w-0 space-y-1.5">
        {title && (
          <h3 className="text-sm font-bold text-textMain mb-3">{title}</h3>
        )}

        {data.map((slice, i) => (
          <div
            key={`${slice.label}-${i}`}
            className={`flex items-center justify-between gap-3 text-xs px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
              hovered === i ? 'bg-bgMain' : 'hover:bg-bgMain/60'
            }`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="flex items-center gap-2.5 text-textSec min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform"
                style={{
                  backgroundColor: PALETTE[i % PALETTE.length],
                  transform: hovered === i ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              <span className="truncate">{slice.label}</span>
            </span>

            <span className="font-semibold text-textMain whitespace-nowrap shrink-0">
              ${slice.value.toFixed(2)}
              <span className="text-textSec font-normal ml-1">
                ({((slice.value / total) * 100).toFixed(0)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};