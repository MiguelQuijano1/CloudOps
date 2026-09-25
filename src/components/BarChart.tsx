import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { getServiceDescription } from '../data/serviceInfo';

interface BarChartItem {
  label: string;
  value: number;
  colorVar?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  title?: string;
  valuePrefix?: string;
  /** horizontal = barras acostadas | vertical = barras de pie */
  orientation?: 'horizontal' | 'vertical';
}

function truncateLabel(label: string, maxChars: number): string {
  if (label.length <= maxChars) return label;
  return label.slice(0, Math.max(maxChars - 1, 4)) + '…';
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  valuePrefix = '$',
  orientation = 'horizontal',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const lastSizeRef = useRef({ w: 0, h: 0 });

  const dataKey = useMemo(
    () =>
      data.map((d) => `${d.label}:${d.value}:${d.colorVar ?? ''}`).join('|') +
      `|${orientation}`,
    [data, orientation]
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const svgEl = svgRef.current;

    const draw = () => {
      const width = Math.max(container.clientWidth, 320);

      if (orientation === 'vertical') {
        drawVertical(width);
      } else {
        drawHorizontal(width);
      }
    };

    const drawVertical = (width: number) => {
      const margin = { top: 36, right: 20, bottom: 72, left: 52 };
      const height = Math.max(280, Math.min(container.clientHeight || 320, 400));

      if (
        width === lastSizeRef.current.w &&
        height === lastSizeRef.current.h &&
        lastSizeRef.current.w !== 0
      ) {
        return;
      }
      lastSizeRef.current = { w: width, h: height };

      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();
      svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      const max = d3.max(data, (d) => d.value) ?? 1;

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.28);

      const y = d3
        .scaleLinear()
        .domain([0, max * 1.12])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const yTicks = y.ticks(5);
      svg
        .append('g')
        .selectAll('line')
        .data(yTicks)
        .join('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', 'var(--color-borders)')
        .attr('stroke-opacity', 0.7)
        .attr('stroke-dasharray', '3,3');

      svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickFormat((d) => `${valuePrefix}${d3.format('~s')(d as number)}`)
            .tickSize(0)
        )
        .call((g) => g.select('.domain').attr('stroke', 'var(--color-borders)'))
        .call((g) =>
          g
            .selectAll('text')
            .attr('fill', 'var(--color-textSec)')
            .attr('font-size', 11)
            .attr('font-family', 'Inter, system-ui, sans-serif')
            .attr('dx', -4)
        );

      const bars = svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d) => x(d.label) ?? 0)
        .attr('width', x.bandwidth())
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('fill', (d) => d.colorVar ?? 'var(--color-primary)')
        .attr('opacity', 0.95)
        .style('cursor', 'pointer');

      bars
        .transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .attr('y', (d) => y(d.value))
        .attr('height', (d) => Math.max(height - margin.bottom - y(d.value), 2));

      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', (d) => (x(d.label) ?? 0) + x.bandwidth() / 2)
        .attr('y', (d) => y(d.value) - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--color-textMain)')
        .attr('font-size', 11)
        .attr('font-weight', 700)
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .attr('opacity', 0)
        .text(
          (d) =>
            `${valuePrefix}${d.value >= 1000 ? d3.format('.2s')(d.value) : d.value.toFixed(0)}`
        )
        .transition()
        .delay(450)
        .duration(300)
        .attr('opacity', 1);

      const maxLabelChars = Math.max(6, Math.floor(x.bandwidth() / 7));
      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', (d) => (x(d.label) ?? 0) + x.bandwidth() / 2)
        .attr('y', height - margin.bottom + 16)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--color-textSec)')
        .attr('font-size', 11)
        .attr('font-weight', 500)
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .each(function (d) {
          const text = d3.select(this);
          const truncated = truncateLabel(d.label, maxLabelChars);
          if (d.label.length > maxLabelChars + 2) {
            text
              .attr(
                'transform',
                `rotate(-28, ${(x(d.label) ?? 0) + x.bandwidth() / 2}, ${height - margin.bottom + 16})`
              )
              .attr('text-anchor', 'end')
              .attr('dx', 4)
              .attr('dy', 4);
          }
          text.text(truncated);
          text.append('title').text(d.label);
        });

      const tooltip = svg.append('g').attr('opacity', 0).style('pointer-events', 'none');
      tooltip
        .append('rect')
        .attr('rx', 6)
        .attr('fill', 'var(--color-sidebar)')
        .attr('opacity', 0.97);
      const tooltipTitle = tooltip
        .append('text')
        .attr('fill', '#fff')
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .attr('text-anchor', 'middle');
      const tooltipDesc = tooltip
        .append('text')
        .attr('fill', '#fff')
        .attr('font-size', 10)
        .attr('font-weight', 400)
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .attr('text-anchor', 'middle')
        .attr('opacity', 0.85);

      bars
        .on('mouseenter', function (_event, d) {
          setHovered(d.label);
          d3.select(this).attr('opacity', 1).attr('filter', 'brightness(1.12)');
        })
        .on('mousemove', function (event, d) {
          const [mx, my] = d3.pointer(event, svgEl);
          const titleLine = `${d.label}: ${valuePrefix}${d.value.toFixed(2)}`;
          const descRaw = getServiceDescription(d.label);
          const descLine = descRaw && descRaw.length > 58 ? descRaw.slice(0, 57) + '…' : descRaw;
          tooltipTitle.text(titleLine);
          tooltipDesc.text(descLine ?? '');
          const titleW = tooltipTitle.node()?.getComputedTextLength() ?? 60;
          const descW = descLine ? tooltipDesc.node()?.getComputedTextLength() ?? 0 : 0;
          const tw = Math.max(titleW, descW) + 20;
          const th = descLine ? 44 : 28;
          let tx = mx - tw / 2;
          if (tx < 4) tx = 4;
          if (tx + tw > width - 4) tx = width - tw - 4;
          tooltip.attr('opacity', 1).attr('transform', `translate(${tx},${my - th - 8})`);
          tooltip.select('rect').attr('width', tw).attr('height', th).attr('x', 0).attr('y', 0);
          if (descLine) {
            tooltipTitle.attr('x', tw / 2).attr('y', 17);
            tooltipDesc.attr('x', tw / 2).attr('y', 33);
          } else {
            tooltipTitle.attr('x', tw / 2).attr('y', th / 2 + 4);
          }
        })
        .on('mouseleave', function () {
          tooltip.attr('opacity', 0);
          setHovered(null);
          d3.select(this).attr('opacity', 0.95).attr('filter', null);
        });
    };

    const drawHorizontal = (width: number) => {
      const maxLabelLen = d3.max(data, (d) => d.label.length) ?? 10;
      const leftMargin = Math.min(Math.max(maxLabelLen * 7.2 + 16, 120), 200);
      const rightMargin = 64;
      const margin = { top: 8, right: rightMargin, bottom: 8, left: leftMargin };
      const maxChars = Math.floor((leftMargin - 16) / 7);
      const rowH = 42;
      const height = data.length * rowH + margin.top + margin.bottom;

      if (
        width === lastSizeRef.current.w &&
        height === lastSizeRef.current.h &&
        lastSizeRef.current.w !== 0
      ) {
        return;
      }
      lastSizeRef.current = { w: width, h: height };

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
        .domain([0, max * 1.08])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([margin.top, height - margin.bottom])
        .padding(0.32);

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
        .attr('opacity', 0.4);

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
        .attr('x', margin.left - 12)
        .attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('fill', 'var(--color-textSec)')
        .attr('font-size', 12)
        .attr('font-weight', 500)
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .text((d) => truncateLabel(d.label, maxChars))
        .append('title')
        .text((d) => d.label);

      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', (d) => {
          const barEnd = x(d.value);
          const spaceRight = width - margin.right - barEnd;
          if (spaceRight < 48 && barEnd - margin.left > 56) return barEnd - 8;
          return barEnd + 8;
        })
        .attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', (d) => {
          const barEnd = x(d.value);
          const spaceRight = width - margin.right - barEnd;
          if (spaceRight < 48 && barEnd - margin.left > 56) return 'end';
          return 'start';
        })
        .attr('fill', (d) => {
          const barEnd = x(d.value);
          const spaceRight = width - margin.right - barEnd;
          if (spaceRight < 48 && barEnd - margin.left > 56) return '#fff';
          return 'var(--color-textMain)';
        })
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('font-family', 'Inter, system-ui, sans-serif')
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
        .attr('fill', 'var(--color-sidebar)')
        .attr('opacity', 0.97);
      const tooltipTitle = tooltip
        .append('text')
        .attr('fill', '#fff')
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .attr('text-anchor', 'middle');
      const tooltipDesc = tooltip
        .append('text')
        .attr('fill', '#fff')
        .attr('font-size', 10)
        .attr('font-weight', 400)
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .attr('text-anchor', 'middle')
        .attr('opacity', 0.85);

      bars
        .on('mouseenter', function (_event, d) {
          setHovered(d.label);
          d3.select(this).attr('opacity', 1).attr('filter', 'brightness(1.12)');
        })
        .on('mousemove', function (event, d) {
          const [mx, my] = d3.pointer(event, svgEl);
          const titleLine = `${d.label}: ${valuePrefix}${d.value.toFixed(2)}`;
          const descRaw = getServiceDescription(d.label);
          const descLine = descRaw && descRaw.length > 58 ? descRaw.slice(0, 57) + '…' : descRaw;
          tooltipTitle.text(titleLine);
          tooltipDesc.text(descLine ?? '');
          const titleW = tooltipTitle.node()?.getComputedTextLength() ?? 60;
          const descW = descLine ? tooltipDesc.node()?.getComputedTextLength() ?? 0 : 0;
          const tw = Math.max(titleW, descW) + 20;
          const th = descLine ? 44 : 28;
          let tx = mx - tw / 2;
          if (tx < 4) tx = 4;
          if (tx + tw > width - 4) tx = width - tw - 4;
          tooltip.attr('opacity', 1).attr('transform', `translate(${tx},${my - th - 8})`);
          tooltip.select('rect').attr('width', tw).attr('height', th).attr('x', 0).attr('y', 0);
          if (descLine) {
            tooltipTitle.attr('x', tw / 2).attr('y', 17);
            tooltipDesc.attr('x', tw / 2).attr('y', 33);
          } else {
            tooltipTitle.attr('x', tw / 2).attr('y', th / 2 + 4);
          }
        })
        .on('mouseleave', function () {
          tooltip.attr('opacity', 0);
          setHovered(null);
          d3.select(this).attr('opacity', 0.95).attr('filter', null);
        });
    };

    lastSizeRef.current = { w: 0, h: 0 };
    draw();

    const ro = new ResizeObserver(() => {
      const width = Math.max(container.clientWidth, 320);
      if (width !== lastSizeRef.current.w) {
        lastSizeRef.current = { w: 0, h: 0 };
        draw();
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, valuePrefix]);

  return (
    <div className="w-full" ref={containerRef}>
      {title && (
        <h3 className="text-sm font-bold text-textMain mb-4 text-left">{title}</h3>
      )}
      <div className="w-full flex justify-center overflow-x-auto">
        <svg ref={svgRef} className="w-full min-w-[280px] overflow-visible" />
      </div>
      <p className="text-xs text-textSec mt-3 text-center min-h-[1.25rem]">
        {hovered ? (
          <span className="animate-fade-in">
            Seleccionado:{' '}
            <span className="font-semibold text-textMain">{hovered}</span>
          </span>
        ) : (
          <span className="invisible">Seleccionado: —</span>
        )}
      </p>
    </div>
  );
};