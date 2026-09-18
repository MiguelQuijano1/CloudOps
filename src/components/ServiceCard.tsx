import React from 'react';
import { Server, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { AWSService } from '../types';

interface ServiceCardProps {
  service: AWSService;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-cards border border-borders rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between text-left w-full card-hover animate-fade-in group"
  >
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{service.category}</span>
        <StatusBadge status={service.status} />
      </div>
      <h3 className="font-bold text-textMain text-lg flex items-center gap-2">
        <Server size={18} className="text-primary" /> {service.name}
      </h3>
      <p className="text-xs text-textSec leading-relaxed line-clamp-2">{service.description}</p>
    </div>

    <div className="pt-3 border-t border-borders space-y-1">
      <span className="text-[11px] text-textSec font-semibold block">Función Principal:</span>
      <p className="text-xs text-textMain font-medium">{service.mainFunction}</p>
      <div className="flex items-center justify-between pt-1">
        {service.monthlyCost > 0 ? (
          <p className="text-xs text-costs font-bold">${service.monthlyCost}/mes</p>
        ) : (
          <p className="text-xs text-textSec">Incluido</p>
        )}
        <span className="text-[11px] text-primary font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          Ver detalle <ChevronRight size={14} />
        </span>
      </div>
    </div>
  </button>
);