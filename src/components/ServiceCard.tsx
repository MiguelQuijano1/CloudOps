import React from 'react';
import { Server } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { AWSService } from '../types';

interface ServiceCardProps {
  service: AWSService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <div className="bg-cards border border-borders rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{service.category}</span>
        <StatusBadge status={service.status} />
      </div>
      <h3 className="font-bold text-textMain text-lg flex items-center gap-2">
        <Server size={18} className="text-primary" /> {service.name}
      </h3>
      <p className="text-xs text-textSec leading-relaxed">{service.description}</p>
    </div>

    <div className="pt-3 border-t border-borders space-y-1">
      <span className="text-[11px] text-textSec font-semibold block">Función Principal:</span>
      <p className="text-xs text-textMain font-medium">{service.mainFunction}</p>
      {service.monthlyCost > 0 && (
        <p className="text-xs text-costs font-bold pt-1">${service.monthlyCost}/mes</p>
      )}
    </div>
  </div>
);