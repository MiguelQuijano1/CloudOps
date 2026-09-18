import React from 'react';
import { MOCK_REGIONS } from '../data/awsServices';
import { RegionCard } from '../components/RegionCard';
import { useApp } from '../context/AppContext';

export const InfrastructureView: React.FC = () => {
  const { selectedRegion, setSelectedRegion } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Infraestructura Global AWS</h1>
        <p className="text-textSec text-sm">
          Visualización de Regiones y despliegue de componentes. Haz clic en una región para
          seleccionarla.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_REGIONS.map((region, i) => (
          <button
            key={region.id}
            type="button"
            onClick={() => setSelectedRegion(region.id)}
            className={`text-left rounded-2xl transition-all ${
              selectedRegion === region.id
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-bgMain'
                : ''
            } animate-fade-in stagger-${Math.min(i + 1, 4)}`}
          >
            <RegionCard region={region} />
          </button>
        ))}
      </div>
    </div>
  );
};