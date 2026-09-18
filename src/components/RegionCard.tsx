import React from 'react';
import { Globe, Server } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { RegionInfo } from '../types';

interface RegionCardProps {
  region: RegionInfo;
}

export const RegionCard: React.FC<RegionCardProps> = ({ region }) => (
  <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 text-primary rounded-xl">
          <Globe size={22} />
        </div>
        <div>
          <h3 className="font-bold text-textMain text-base">{region.name}</h3>
          <span className="text-xs text-textSec">{region.location}</span>
        </div>
      </div>
      <StatusBadge status={region.status} />
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-borders text-xs text-textSec">
      <span className="flex items-center gap-1.5 font-medium">
        <Server size={14} className="text-primary" /> Servicios Desplegados:
      </span>
      <span className="font-bold text-textMain text-sm">{region.deployedServicesCount}</span>
    </div>
  </div>
);