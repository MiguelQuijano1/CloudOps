import React from 'react';
import { DollarSign } from 'lucide-react';
import type { CostItem } from '../types';

interface CostCardProps {
  item: CostItem;
}

export const CostCard: React.FC<CostCardProps> = ({ item }) => (
  <div className="bg-cards border border-borders rounded-2xl p-5 shadow-xs flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-amber-50 text-costs rounded-xl">
        <DollarSign size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-sm text-textMain">{item.serviceName}</h4>
        <span className="text-xs text-textSec">
          {item.quantity} unidad(es) · {item.hoursPerMonth} hrs/mes · ${item.costPerHour}/hr
        </span>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-sm text-costs">${item.monthlyCost.toFixed(2)}/mes</p>
      <p className="text-xs text-textSec">${item.annualCost.toFixed(2)}/año</p>
    </div>
  </div>
);