import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';

interface BarChartItem {
  label: string;
  value: number;
  colorVar?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  title?: string;
  valuePrefix?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, valuePrefix = '$' }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const lastWidthRef = useRef(0);

  // Clave estable: solo redibuja cuando cambian labels/valores reales
  const dataKey = useMemo(
    () => data.map((d) => `${d.label}:${d.value}:${d.colorVar ?? ''}`).join('|'),
    [data]
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const svgEl = svgRef.current;

    const draw = () => {
      const width = Math.max(container.clientWidth, 280);
      // Evitar redibujar si el ancho no cambió (el hover no debe disparar redraw)
      if (width === lastWidthRef.current && lastWidthRef.current !== 0) {
        return;
      }
      lastWidthRef.current = width;

      const maxLabelLen = d3.max(data, (d) => d.label.length) ?? 8;
      const margin = {
        top: 4,
        right: 52,
        bottom: 4,
        left: Math.min(20 + maxLabelLen * 7, 110),
      };
      const rowH = 36;
      const height = data.length * rowH + margin.top + margin.bottom;

      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();
      svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      const max = d3.max(data, (d) => d.value) ?? 1;
      const x = d3
        .scaleLinear()
        .domain([0, max * 1.05])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([margin.top, height - margin.bottom])
        .padding(0.28);

      // Fondo de cada fila (track)
      svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', margin.left)
        .attr('y', (d) => y(d.label) ?? 0)
        .attr('width', width - margin.left - margin.right)
        .attr('height', y.bandwidth())
        .attr('rx', 6)
        .attr('fill', 'var(--color-borders)')
        .attr('opacity', 0.45);

      const bars = svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', margin.left)
        .attr('y', (d) => y(d.label) ?? 0)
        .attr('height', y.bandwidth())
        .attr('rx', 6)
        .attr('fill', (d) => d.colorVar ?? 'var(--color-primary)')
        .attr('opacity', 0.95)
        .attr('width', 0)
        .style('cursor', 'pointer');

      bars
        .transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .attr('width', (d) => Math.max(x(d.value) - margin.left, 4));

      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', margin.left - 10)
        .attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('fill', 'var(--color-textSec)')
        .attr('font-size', 12)
        .attr('font-weight', 500)
        .text((d) => d.label);

      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', (d) => x(d.value) + 8)
        .attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('fill', 'var(--color-textMain)')
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('opacity', 0)
        .text((d) => `${valuePrefix}${d.value.toFixed(0)}`)
        .transition()
        .delay(400)
        .duration(300)
        .attr('opacity', 1);

      const tooltip = svg.append('g').attr('opacity', 0).style('pointer-events', 'none');

      tooltip
        .append('rect')
        .attr('rx', 6)
        .attr('height', 26)
        .attr('fill', 'var(--color-sidebar)')
        .attr('opacity', 0.95);

      const tooltipText = tooltip
        .append('text')
        .attr('fill', '#fff')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em');

      bars
        .on('mouseenter', function (_event, d) {
          setHovered(d.label);
          d3.select(this).attr('opacity', 1).attr('filter', 'brightness(1.12)');
        })
        .on('mousemove', function (event, d) {
          const [mx, my] = d3.pointer(event, svgEl);
          const label = `${d.label}: ${valuePrefix}${d.value.toFixed(2)}`;
          tooltipText.text(label);
          const tw = (tooltipText.node()?.getComputedTextLength() ?? 60) + 20;
          let tx = mx - tw / 2;
          if (tx < 4) tx = 4;
          if (tx + tw > width - 4) tx = width - tw - 4;
          tooltip.attr('opacity', 1).attr('transform', `translate(${tx},${my - 34})`);
          tooltip.select('rect').attr('width', tw).attr('x', 0).attr('y', 0);
          tooltipText.attr('x', tw / 2).attr('y', 13);
        })
        .on('mouseleave', function () {
          tooltip.attr('opacity', 0);
          setHovered(null);
          d3.select(this).attr('opacity', 0.95).attr('filter', null);
        });
    };

    // Forzar primer dibujo
    lastWidthRef.current = 0;
    draw();

    const ro = new ResizeObserver(() => {
      // Solo reaccionar a cambios de ancho real
      const width = Math.max(container.clientWidth, 280);
      if (width !== lastWidthRef.current) {
        draw();
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
    // dataKey + valuePrefix: solo redibuja cuando los datos realmente cambian
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, valuePrefix]);

  return (
    <div className="w-full" ref={containerRef}>
      {title && <h3 className="text-sm font-bold text-textMain mb-4">{title}</h3>}
      <div className="w-full flex justify-center">
        <svg ref={svgRef} className="w-full max-w-full overflow-visible" />
      </div>
      {/* Altura reservada para evitar layout shift que dispare ResizeObserver */}
      <p className="text-xs text-textSec mt-3 text-center min-h-[1.25rem]">
        {hovered ? (
          <span className="animate-fade-in">
            Seleccionado: <span className="font-semibold text-textMain">{hovered}</span>
          </span>
        ) : (
          <span className="invisible">Seleccionado: —</span>
        )}
      </p>
    </div>
  );
};