import React, { useMemo } from 'react';
import { StatCard } from '../components/StatCard';
import { SecurityCard } from '../components/SecurityCard';
import { BarChart } from '../components/BarChart';
import { StatusBadge } from '../components/StatusBadge';
import { MOCK_SECURITY_CHECKS, INITIAL_SERVICES, MOCK_REGIONS } from '../data/awsServices';
import {
  Server,
  Globe,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Cloud,
  Database,
  Wifi,
  Layers,
  Lock,
  Activity,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import type { RegionInfo } from '../types';

/** Servicios desplegados por región (misma lógica que Infraestructura) */
const REGION_SERVICE_MAP: Record<string, string[]> = {
  'us-east-1': ['EC2', 'S3', 'RDS', 'IAM', 'VPC', 'Route 53', 'CloudFront'],
  'us-west-2': ['EC2', 'S3', 'RDS', 'VPC'],
  'sa-east-1': ['EC2', 'S3'],
  'eu-west-1': ['EC2', 'RDS', 'VPC'],
};

/** Nodos de arquitectura base; se activan según servicios de la región */
const ARCHITECTURE_NODE_DEFS = [
  {
    id: 'internet',
    name: 'Internet',
    subtitle: 'Usuarios',
    icon: Globe,
    color: 'text-primary',
    alwaysOn: true,
    serviceNames: [] as string[],
  },
  {
    id: 'route53',
    name: 'Route 53',
    subtitle: 'DNS + Health',
    icon: Cloud,
    color: 'text-primary',
    alwaysOn: false,
    serviceNames: ['Route 53'],
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    subtitle: 'CDN Edge',
    icon: Cloud,
    color: 'text-primary',
    alwaysOn: false,
    serviceNames: ['CloudFront'],
  },
  {
    id: 'igw',
    name: 'IGW',
    subtitle: 'Entrada VPC',
    icon: Wifi,
    color: 'text-indigo-500',
    alwaysOn: false,
    serviceNames: ['VPC'],
  },
  {
    id: 'alb',
    name: 'ALB',
    subtitle: 'Load Balancer',
    icon: Server,
    color: 'text-sky-500',
    alwaysOn: false,
    serviceNames: ['EC2', 'VPC'],
  },
  {
    id: 'ec2',
    name: 'EC2',
    subtitle: 'Web / API',
    icon: Server,
    color: 'text-amber-500',
    alwaysOn: false,
    serviceNames: ['EC2'],
  },
  {
    id: 'rds',
    name: 'RDS',
    subtitle: 'PostgreSQL',
    icon: Database,
    color: 'text-security',
    alwaysOn: false,
    serviceNames: ['RDS'],
  },
];

/** Factor de costo simulado por región (us-east-1 = 100%) */
const REGION_COST_FACTOR: Record<string, number> = {
  'us-east-1': 1,
  'us-west-2': 0.95,
  'sa-east-1': 1.15,
  'eu-west-1': 1.05,
};

function isRegionInUse(region: RegionInfo | undefined): boolean {
  if (!region) return false;
  return region.deployedServicesCount > 0 && region.status !== 'Maintenance';
}

function regionUsageLabel(region: RegionInfo | undefined): {
  label: string;
  badgeStatus: 'Active' | 'Inactive' | 'Maintenance';
} {
  if (!region) return { label: 'Desconocida', badgeStatus: 'Inactive' };
  if (region.status === 'Maintenance') {
    return { label: 'En mantenimiento', badgeStatus: 'Maintenance' };
  }
  if (region.deployedServicesCount > 0 && region.status === 'Operational') {
    return { label: 'En uso (Activa)', badgeStatus: 'Active' };
  }
  if (region.status === 'Degraded') {
    return { label: 'Degradada', badgeStatus: 'Inactive' };
  }
  return { label: 'Inactiva', badgeStatus: 'Inactive' };
}

export const DashboardView: React.FC = () => {
  const { selectedRegion } = useApp();

  const regionInfo = MOCK_REGIONS.find((r) => r.id === selectedRegion);
  const serviceNames = REGION_SERVICE_MAP[selectedRegion] ?? [];
  const regionServices = INITIAL_SERVICES.filter((s) => serviceNames.includes(s.name));
  const costFactor = REGION_COST_FACTOR[selectedRegion] ?? 1;

  const totalCost = useMemo(
    () => regionServices.reduce((acc, s) => acc + s.monthlyCost * costFactor, 0),
    [regionServices, costFactor]
  );

  const chartData = useMemo(
    () =>
      regionServices
        .filter((s) => s.monthlyCost > 0)
        .map((s) => ({
          label: s.name,
          value: Math.round(s.monthlyCost * costFactor * 100) / 100,
        })),
    [regionServices, costFactor]
  );

  const architectureNodes = useMemo(() => {
    const regionActive = regionInfo?.status === 'Operational';
    return ARCHITECTURE_NODE_DEFS.map((node) => {
      const hasService =
        node.alwaysOn ||
        node.serviceNames.some((name) => serviceNames.includes(name));
      const status: 'Active' | 'Inactive' =
        regionActive && hasService ? 'Active' : 'Inactive';
      return { ...node, status };
    });
  }, [serviceNames, regionInfo?.status]);

  const activeNodes = architectureNodes.filter((n) => n.status === 'Active').length;
  const healthPercent =
    architectureNodes.length > 0
      ? Math.round((activeNodes / architectureNodes.length) * 100)
      : 0;

  const usage = regionUsageLabel(regionInfo);
  const inUse = isRegionInUse(regionInfo);

  const securityScore =
    regionInfo?.status === 'Maintenance'
      ? 68
      : regionServices.length >= 5
        ? 92
        : regionServices.length >= 3
          ? 85
          : 78;

  return (
    <div className="space-y-6 animate-fade-in" key={selectedRegion}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Resumen General CloudOps</h1>
          <p className="text-textSec text-sm">
            Monitoreo y estado de la solución en{' '}
            <strong className="text-textMain">{regionInfo?.name ?? selectedRegion}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-textSec font-medium">Estado de la región:</span>
          <StatusBadge status={usage.badgeStatus} />
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              inUse
                ? 'bg-emerald-50 text-security border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                : regionInfo?.status === 'Maintenance'
                  ? 'bg-red-50 text-alerts border-red-200 dark:bg-red-950/40 dark:border-red-800'
                  : 'bg-slate-100 text-textSec border-borders dark:bg-slate-800'
            }`}
          >
            {usage.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="animate-fade-in stagger-1">
          <StatCard
            title="Servicios en Región"
            value={regionServices.length}
            subtitle={
              regionServices.length > 0
                ? `Desplegados en ${selectedRegion}`
                : 'Sin servicios desplegados'
            }
            icon={Server}
            iconColorClass="text-primary"
          />
        </div>
        <div className="animate-fade-in stagger-2">
          <StatCard
            title="Región Seleccionada"
            value={selectedRegion}
            subtitle={`${regionInfo?.location ?? '—'} · ${usage.label}`}
            icon={Globe}
            iconColorClass={
              inUse
                ? 'text-security'
                : regionInfo?.status === 'Maintenance'
                  ? 'text-alerts'
                  : 'text-primary'
            }
          />
        </div>
        <div className="animate-fade-in stagger-3">
          <StatCard
            title="Costo Estimado Mensual"
            value={`$${totalCost.toFixed(2)}`}
            subtitle={`Anual: $${(totalCost * 12).toFixed(2)} · factor ${costFactor}x`}
            icon={DollarSign}
            iconColorClass="text-costs"
          />
        </div>
        <div className="animate-fade-in stagger-4">
          <StatCard
            title="Estado de Seguridad"
            value={`${securityScore}%`}
            subtitle={
              regionInfo?.status === 'Maintenance'
                ? 'Reducido por mantenimiento'
                : 'Cumplimiento en región'
            }
            icon={ShieldCheck}
            iconColorClass="text-security"
          />
        </div>
      </div>

      {regionInfo?.status === 'Maintenance' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
          <Activity className="text-costs shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-textMain">
              Región en mantenimiento: {regionInfo.name}
            </p>
            <p className="text-xs text-textSec mt-0.5">
              Los servicios pueden no estar disponibles o presentar latencia elevada. Los nodos de
              arquitectura se muestran como inactivos hasta que la región vuelva a estado
              operacional.
            </p>
          </div>
        </div>
      )}

      {!inUse && regionInfo?.status !== 'Maintenance' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-borders bg-bgMain">
          <Globe className="text-textSec shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-textMain">Región inactiva / sin uso</p>
            <p className="text-xs text-textSec mt-0.5">
              No hay carga de trabajo activa en esta región o el conteo de servicios desplegados es
              cero. Cambia de región en el selector del encabezado para ver otra.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cards border border-borders rounded-2xl p-6 shadow-xs animate-fade-in stagger-2">
          {chartData.length > 0 ? (
            <BarChart
              title={`Distribución de Costo Mensual · ${selectedRegion}`}
              data={chartData}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <DollarSign size={32} className="text-textSec opacity-40 mb-2" />
              <p className="text-sm font-semibold text-textMain">Sin costos en esta región</p>
              <p className="text-xs text-textSec mt-1">
                No hay servicios con costo desplegados en {selectedRegion}.
              </p>
            </div>
          )}
        </div>

        <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4 animate-fade-in stagger-3">
          <h2 className="text-base font-bold text-textMain">Chequeos de Seguridad</h2>
          <div className="space-y-3">
            {MOCK_SECURITY_CHECKS.slice(0, 3).map((item) => (
              <SecurityCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-5 animate-fade-in stagger-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-textMain flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              Estado de la Arquitectura
            </h2>
            <p className="text-xs text-textSec mt-1">
              Región{' '}
              <strong className="text-textMain">{selectedRegion}</strong>
              {regionInfo ? ` (${regionInfo.name})` : ''} ·{' '}
              <span
                className={
                  inUse ? 'font-semibold text-security' : 'font-semibold text-textSec'
                }
              >
                {usage.label}
              </span>
              {' · '}
              Salud:{' '}
              <span
                className={`font-semibold ${
                  healthPercent >= 70
                    ? 'text-security'
                    : healthPercent >= 40
                      ? 'text-costs'
                      : 'text-alerts'
                }`}
              >
                {healthPercent}%
              </span>
              {' · '}
              {activeNodes}/{architectureNodes.length} nodos activos
            </p>
          </div>
          <Link
            to="/network"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Ver diagrama completo
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <div className="flex items-stretch gap-2 min-w-[720px] py-2">
            {architectureNodes.map((node, index) => {
              const Icon = node.icon;
              const isActive = node.status === 'Active';
              return (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-[90px]">
                    <div
                      className={`w-full flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-bgMain border-borders hover:shadow-xs'
                          : 'bg-bgMain/50 border-borders opacity-55'
                      }`}
                    >
                      <Icon
                        className={isActive ? node.color : 'text-textSec'}
                        size={22}
                      />
                      <span className="text-xs font-bold text-textMain text-center leading-tight">
                        {node.name}
                      </span>
                      <span className="text-[10px] text-textSec text-center">
                        {node.subtitle}
                      </span>
                      <StatusBadge status={node.status} />
                    </div>
                  </div>
                  {index < architectureNodes.length - 1 && (
                    <div className="flex items-center shrink-0 self-center">
                      <ArrowRight
                        className={isActive ? 'text-textSec' : 'text-borders'}
                        size={16}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-borders">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bgMain border border-borders">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
              <Wifi className="text-indigo-500" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-textMain">VPC 10.0.0.0/16</p>
              <p className="text-[11px] text-textSec">
                {serviceNames.includes('VPC')
                  ? 'Subred pública 10.0.1.0/24 · privada 10.0.2.0/24'
                  : 'VPC no desplegada en esta región'}
              </p>
            </div>
            <StatusBadge
              status={
                serviceNames.includes('VPC') && regionInfo?.status === 'Operational'
                  ? 'Active'
                  : 'Inactive'
              }
            />
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bgMain border border-borders">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40">
              <Lock className="text-amber-500" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-textMain">IAM + Security Groups</p>
              <p className="text-[11px] text-textSec">
                {serviceNames.includes('IAM')
                  ? 'Roles y políticas activos en la región'
                  : 'IAM global · SG locales según VPC'}
              </p>
            </div>
            <StatusBadge
              status={
                regionInfo?.status === 'Operational' && regionServices.length > 0
                  ? 'Active'
                  : 'Inactive'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};