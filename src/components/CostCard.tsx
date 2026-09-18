import React from 'react';
import { DollarSign, Trash2 } from 'lucide-react';
import type { CostItem } from '../types';

interface CostCardProps {
  item: CostItem;
  onDelete?: (id: string) => void;
}

export const CostCard: React.FC<CostCardProps> = ({ item, onDelete }) => (
  <div className="bg-cards border border-borders rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
    <div className="flex items-center gap-3 min-w-0">
      <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-costs rounded-xl shrink-0">
        <DollarSign size={20} />
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-sm text-textMain truncate">{item.serviceName}</h4>
        <span className="text-xs text-textSec">
          {item.quantity} unidad(es) · {item.hoursPerMonth} hrs/mes · ${item.costPerHour}/hr
        </span>
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <div className="text-right">
        <p className="font-bold text-sm text-costs">${item.monthlyCost.toFixed(2)}/mes</p>
        <p className="text-xs text-textSec">${item.annualCost.toFixed(2)}/año</p>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-xl text-textSec hover:text-alerts hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          title="Eliminar estimación"
          aria-label={`Eliminar ${item.serviceName}`}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  </div>
);