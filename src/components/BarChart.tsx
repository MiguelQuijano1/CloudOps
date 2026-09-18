import React from 'react';

interface BarChartItem {
  label: string;
  value: number;
  colorVar?: string; // css var name, e.g. 'var(--color-primary)'
}

interface BarChartProps {
  data: BarChartItem[];
  title?: string;
  valuePrefix?: string;
}

/**
 * Gráfico de barras simple en SVG (sin dependencias externas).
 * Se usa en el Dashboard para representar la distribución del costo mensual por servicio.
 */
export const BarChart: React.FC<BarChartProps> = ({ data, title, valuePrefix = '$' }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barHeight = 28;
  const gap = 14;
  const chartHeight = data.length * (barHeight + gap);
  const labelWidth = 90;

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-bold text-textMain mb-3">{title}</h3>}
      <svg viewBox={`0 0 400 ${chartHeight}`} className="w-full" style={{ height: chartHeight }}>
        {data.map((item, i) => {
          const barW = (item.value / max) * (400 - labelWidth - 50);
          const y = i * (barHeight + gap);
          return (
            <g key={item.label}>
              <text x={0} y={y + barHeight / 2 + 4} fontSize="11" fill="var(--color-textSec)">
                {item.label.length > 14 ? item.label.slice(0, 13) + '…' : item.label}
              </text>
              <rect
                x={labelWidth}
                y={y}
                width={Math.max(barW, 2)}
                height={barHeight}
                rx={6}
                fill={item.colorVar ?? 'var(--color-primary)'}
              />
              <text
                x={labelWidth + Math.max(barW, 2) + 8}
                y={y + barHeight / 2 + 4}
                fontSize="11"
                fontWeight="700"
                fill="var(--color-textMain)"
              >
                {valuePrefix}
                {item.value.toFixed(0)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};