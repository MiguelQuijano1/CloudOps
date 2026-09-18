import React from 'react';

interface DonutSlice {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutSlice[];
  title?: string;
}

const PALETTE = ['#2563EB', '#F59E0B', '#16A34A', '#DC2626', '#7C3AED', '#0891B2', '#64748B'];

/**
 * Gráfico de dona en SVG (sin dependencias externas).
 * Se usa en el módulo de Costos para representar la distribución del gasto por servicio.
 */
export const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 160 160" width={160} height={160}>
        <g transform="translate(80,80) rotate(-90)">
          <circle r={radius} fill="none" stroke="var(--color-borders)" strokeWidth={22} />
          {data.map((slice, i) => {
            const fraction = slice.value / total;
            const dash = fraction * circumference;
            const gapLen = circumference - dash;
            const circle = (
              <circle
                key={slice.label}
                r={radius}
                fill="none"
                stroke={PALETTE[i % PALETTE.length]}
                strokeWidth={22}
                strokeDasharray={`${dash} ${gapLen}`}
                strokeDashoffset={-offsetAcc}
              />
            );
            offsetAcc += dash;
            return circle;
          })}
        </g>
        <text x="80" y="76" textAnchor="middle" fontSize="12" fill="var(--color-textSec)">
          Total
        </text>
        <text x="80" y="94" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--color-textMain)">
          ${total.toFixed(0)}
        </text>
      </svg>

      <div className="flex-1 w-full space-y-2">
        {title && <h3 className="text-sm font-bold text-textMain mb-2">{title}</h3>}
        {data.map((slice, i) => (
          <div key={slice.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-textSec">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
              />
              {slice.label}
            </span>
            <span className="font-semibold text-textMain">
              ${slice.value.toFixed(2)} ({((slice.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};