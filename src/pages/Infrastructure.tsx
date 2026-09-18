import React, { useState } from 'react';
import { MOCK_REGIONS, INITIAL_SERVICES } from '../data/awsServices';
import { RegionCard } from '../components/RegionCard';
import { RegionDetailModal } from '../components/RegionDetailModal';
import { useApp } from '../context/AppContext';
import type { RegionInfo, AWSService } from '../types';

/** Servicios desplegados por región (simulado según el conteo de cada región) */
const REGION_SERVICE_MAP: Record<string, string[]> = {
  'us-east-1': ['EC2', 'S3', 'RDS', 'IAM', 'VPC', 'Route 53', 'CloudFront'],
  'us-west-2': ['EC2', 'S3', 'RDS', 'VPC'],
  'sa-east-1': ['EC2', 'S3'],
  'eu-west-1': ['EC2', 'RDS', 'VPC'],
};

function servicesForRegion(regionId: string): AWSService[] {
  const names = REGION_SERVICE_MAP[regionId] ?? [];
  return INITIAL_SERVICES.filter((s) => names.includes(s.name));
}

export const InfrastructureView: React.FC = () => {
  const { selectedRegion, setSelectedRegion } = useApp();
  const [detailRegion, setDetailRegion] = useState<RegionInfo | null>(null);

  const handleRegionClick = (region: RegionInfo) => {
    setSelectedRegion(region.id);
    setDetailRegion(region);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Infraestructura Global AWS</h1>
        <p className="text-textSec text-sm">
          Visualización de Regiones y despliegue de componentes. Haz clic en una región para ver el
          detalle y seleccionarla.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_REGIONS.map((region, i) => (
          <button
            key={region.id}
            type="button"
            onClick={() => handleRegionClick(region)}
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

      {detailRegion && (
        <RegionDetailModal
          region={detailRegion}
          services={servicesForRegion(detailRegion.id)}
          onClose={() => setDetailRegion(null)}
        />
      )}
    </div>
  );
};