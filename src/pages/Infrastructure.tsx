import React from 'react';
import { MOCK_REGIONS } from '../data/awsServices';
import { RegionCard } from '../components/RegionCard';

export const InfrastructureView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Infraestructura Global AWS</h1>
        <p className="text-textSec text-sm">Visualización de Regiones y despliegue de componentes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_REGIONS.map((region) => (
          <RegionCard key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
};