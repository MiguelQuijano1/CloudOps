import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, iconColorClass = 'text-primary' }) => (
  <div className="bg-cards border border-borders rounded-2xl p-5 shadow-xs flex items-center justify-between">
    <div>
      <span className="text-textSec text-xs font-semibold uppercase tracking-wider">{title}</span>
      <h3 className="text-2xl font-bold text-textMain mt-1">{value}</h3>
      {subtitle && <p className="text-xs text-textSec mt-1">{subtitle}</p>}
    </div>
    <div className={`p-3 rounded-xl bg-slate-100 ${iconColorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);