import React, { useState } from 'react';
import { RegionCard } from '../components/RegionCard';
import { WorldMap } from '../components/WorldMap';
import { RegionDetailModal } from '../components/RegionDetailModal';
import { PageHeader } from '../components/PageHeader';
import { MiniStat } from '../components/MiniStat';
import { useApp } from '../context/AppContext';
import { useCloudData } from '../context/CloudDataContext';
import type { RegionInfo, AWSService } from '../types';
import { Building2, Timer, Globe2, Cable, RefreshCw, Save } from 'lucide-react';

/** Servicios desplegados por región (simulado según el conteo de cada región) */
const REGION_SERVICE_MAP: Record<string, string[]> = {
  'us-east-1': ['EC2', 'S3', 'RDS', 'IAM', 'VPC', 'Route 53', 'CloudFront', 'Lambda', 'DynamoDB', 'Elastic Load Balancing', 'CloudWatch', 'KMS', 'SNS'],
  'us-west-2': ['EC2', 'S3', 'RDS', 'VPC', 'Lambda', 'DynamoDB'],
  'sa-east-1': ['EC2', 'S3'],
  'eu-west-1': ['EC2', 'RDS', 'VPC'],
  'eu-central-1': ['EC2', 'S3', 'RDS', 'VPC', 'Elastic Load Balancing', 'CloudWatch'],
  'ap-southeast-1': ['EC2', 'S3', 'Lambda', 'DynamoDB', 'CloudFront'],
  'ap-northeast-1': ['EC2', 'S3', 'RDS', 'VPC'],
  'ap-south-1': ['EC2', 'S3', 'Lambda'],
};

export const InfrastructureView: React.FC = () => {
  const { selectedRegion, setSelectedRegion, addNotification } = useApp();
  const { regions, services, updateRegionStatus, lastSavedAt } = useCloudData();
  const [detailRegion, setDetailRegion] = useState<RegionInfo | null>(null);
  const [testing, setTesting] = useState(false);

  function servicesForRegion(regionId: string): AWSService[] {
    const names = REGION_SERVICE_MAP[regionId] ?? [];
    return services.filter((s) => names.includes(s.name));
  }

  const handleRegionClick = (region: RegionInfo) => {
    setSelectedRegion(region.id);
    setDetailRegion(region);
  };

  const handleToggleStatus = (region: RegionInfo) => {
    const next = region.status === 'Operational' ? 'Maintenance' : 'Operational';
    updateRegionStatus(region.id, next);
    setDetailRegion((prev) => (prev && prev.id === region.id ? { ...prev, status: next } : prev));
    addNotification({
      title: next === 'Maintenance' ? 'Región en mantenimiento' : 'Región recuperada',
      message: `${region.name} ahora está en estado "${next}". Cambio guardado localmente.`,
      type: next === 'Maintenance' ? 'warning' : 'success',
    });
  };

  const runLatencyTest = () => {
    setTesting(true);
    window.setTimeout(() => {
      setTesting(false);
      addNotification({
        title: 'Test de latencia completado',
        message: `Se midieron ${regions.length} regiones. Latencia promedio simulada: ${(Math.random() * 40 + 15).toFixed(1)} ms.`,
        type: 'success',
      });
    }, 1100);
  };

  const connectedRegions = regions.filter((r) => r.status !== 'Maintenance').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="AWS Well-Architected Framework"
        title="Infraestructura Global y Resiliencia Multirregión"
        description="Topología de alta disponibilidad, conectividad perimetral y mecanismos de auto-recuperación activa."
        badge={{ label: 'SLA Global 99.99%', tone: 'security' }}
        actions={
          <button
            onClick={runLatencyTest}
            disabled={testing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            <RefreshCw size={16} className={testing ? 'animate-spin' : ''} /> {testing ? 'Midiendo...' : 'Ejecutar Test de Latencia'}
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MiniStat label="Zonas de Disponibilidad" value="3 AZs" icon={Building2} footnote="us-east-1 · 1a · 1b · 1c" />
        <MiniStat label="Latencia Inter-AZ" value="< 1.5 ms" icon={Timer} tone="security" footnote="Jitter 0.12ms" />
        <MiniStat
          label="Regiones Conectadas"
          value={`${connectedRegions} de ${regions.length}`}
          icon={Globe2}
          footnote="Prod · DR · PoP Edge"
        />
        <MiniStat label="Backbone Direct Connect" value="10 Gbps" icon={Cable} tone="neutral" footnote="Capacidad 100%" />
      </div>

      <WorldMap regions={regions} selectedRegionId={selectedRegion} onRegionClick={handleRegionClick} />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-textMain">Regiones Desplegadas</h2>
          <p className="text-xs text-textSec mt-0.5">
            Distribución geográfica de cómputo, almacenamiento y puntos de presencia. Haz clic en una
            región para ver el detalle.
          </p>
        </div>
        {lastSavedAt && (
          <span className="flex items-center gap-1.5 text-[11px] text-textSec">
            <Save size={12} className="text-security" /> Guardado localmente · {new Date(lastSavedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {regions.map((region, i) => (
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
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};