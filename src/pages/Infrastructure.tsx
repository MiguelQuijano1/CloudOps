import React, { useState } from 'react';
import { MOCK_REGIONS, INITIAL_SERVICES } from '../data/awsServices';
import { RegionCard } from '../components/RegionCard';
import { RegionDetailModal } from '../components/RegionDetailModal';
import { PageHeader } from '../components/PageHeader';
import { MiniStat } from '../components/MiniStat';
import { useApp } from '../context/AppContext';
import type { RegionInfo, AWSService } from '../types';
import { Building2, Timer, Globe2, Cable, RefreshCw } from 'lucide-react';

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

  const connectedRegions = MOCK_REGIONS.filter((r) => r.status !== 'Maintenance').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="AWS Well-Architected Framework"
        title="Infraestructura Global y Resiliencia Multirregión"
        description="Topología de alta disponibilidad, conectividad perimetral y mecanismos de auto-recuperación activa."
        badge={{ label: 'SLA Global 99.99%', tone: 'security' }}
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            <RefreshCw size={16} /> Ejecutar Test de Latencia
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MiniStat label="Zonas de Disponibilidad" value="3 AZs" icon={Building2} footnote="us-east-1 · 1a · 1b · 1c" />
        <MiniStat label="Latencia Inter-AZ" value="< 1.5 ms" icon={Timer} tone="security" footnote="Jitter 0.12ms" />
        <MiniStat
          label="Regiones Conectadas"
          value={`${connectedRegions} Regiones`}
          icon={Globe2}
          footnote="Prod · DR · PoP Edge"
        />
        <MiniStat label="Backbone Direct Connect" value="10 Gbps" icon={Cable} tone="neutral" footnote="Capacidad 100%" />
      </div>

      <div>
        <h2 className="text-base font-bold text-textMain">Regiones Desplegadas</h2>
        <p className="text-xs text-textSec mt-0.5 mb-4">
          Distribución geográfica de cómputo, almacenamiento y puntos de presencia. Haz clic en una
          región para ver el detalle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_REGIONS.map((region, i) => (
          <button
            key={region.id}
            type="button"
            onClick={() => handleRegionClick(region)}
            className={`text-left rounded-2xl transition-all ${selectedRegion === region.id
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