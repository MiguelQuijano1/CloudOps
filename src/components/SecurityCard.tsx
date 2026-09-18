import React from 'react';
import { StatusBadge } from './StatusBadge';
import type { SecurityItem } from '../types';

interface SecurityCardProps {
  item: SecurityItem;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ item }) => (
  <div className="p-4 bg-bgMain rounded-xl border border-borders flex items-center justify-between">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-textSec">{item.category}</span>
        <span className="text-xs text-borders">•</span>
        <h4 className="font-semibold text-sm text-textMain">{item.title}</h4>
      </div>
      <p className="text-xs text-textSec">{item.description}</p>
    </div>
    <StatusBadge status={item.status} />
  </div>
);