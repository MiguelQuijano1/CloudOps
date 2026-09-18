import React from 'react';
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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

/** Componentes de la arquitectura con su estado simulado */
const ARCHITECTURE_NODES = [
  {
    id: 'internet',
    name: 'Internet',
    subtitle: 'Usuarios',
    icon: Globe,
    status: 'Active' as const,
    color: 'text-primary',
  },
  {
    id: 'route53',
    name: 'Route 53',
    subtitle: 'DNS + Health',
    icon: Cloud,
    status: 'Active' as const,
    color: 'text-primary',
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    subtitle: 'CDN Edge',
    icon: Cloud,
    status: 'Active' as const,
    color: 'text-primary',
  },
  {
    id: 'igw',
    name: 'IGW',
    subtitle: 'Entrada VPC',
    icon: Wifi,
    status: 'Active' as const,
    color: 'text-indigo-500',
  },
  {
    id: 'alb',
    name: 'ALB',
    subtitle: 'Load Balancer',
    icon: Server,
    status: 'Active' as const,
    color: 'text-sky-500',
  },
  {
    id: 'ec2',
    name: 'EC2',
    subtitle: 'Web / API',
    icon: Server,
    status: 'Active' as const,
    color: 'text-amber-500',
  },
  {
    id: 'rds',
    name: 'RDS',
    subtitle: 'PostgreSQL',
    icon: Database,
    status: 'Active' as const,
    color: 'text-security',
  },
];

export const DashboardView: React.FC = () => {
  const { selectedRegion } = useApp();
  const totalCost = INITIAL_SERVICES.reduce((acc, s) => acc + s.monthlyCost, 0);
  const regionInfo = MOCK_REGIONS.find((r) => r.id === selectedRegion);

  const chartData = INITIAL_SERVICES.filter((s) => s.monthlyCost > 0).map((s) => ({
    label: s.name,
    value: s.monthlyCost,
  }));

  const activeNodes = ARCHITECTURE_NODES.filter((n) => n.status === 'Active').length;
  const healthPercent = Math.round((activeNodes / ARCHITECTURE_NODES.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Resumen General CloudOps</h1>
        <p className="text-textSec text-sm">Monitoreo y estado global de la solución en la nube.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="animate-fade-in stagger-1">
          <StatCard
            title="Servicios Activos"
            value={INITIAL_SERVICES.length}
            subtitle="Desplegados en AWS"
            icon={Server}
            iconColorClass="text-primary"
          />
        </div>
        <div className="animate-fade-in stagger-2">
          <StatCard
            title="Región Principal"
            value={selectedRegion}
            subtitle={regionInfo?.name ?? 'Región seleccionada'}
            icon={Globe}
            iconColorClass="text-primary"
          />
        </div>
        <div className="animate-fade-in stagger-3">
          <StatCard
            title="Costo Estimado Mensual"
            value={`$${totalCost.toFixed(2)}`}
            subtitle={`Anual: $${(totalCost * 12).toFixed(2)}`}
            icon={DollarSign}
            iconColorClass="text-costs"
          />
        </div>
        <div className="animate-fade-in stagger-4">
          <StatCard
            title="Estado de Seguridad"
            value="92%"
            subtitle="Cumplimiento global"
            icon={ShieldCheck}
            iconColorClass="text-security"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cards border border-borders rounded-2xl p-6 shadow-xs animate-fade-in stagger-2">
          <BarChart title="Distribución de Costo Mensual por Servicio" data={chartData} />
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

      {/* Estado de la Arquitectura — visual */}
      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-5 animate-fade-in stagger-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-textMain flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              Estado de la Arquitectura
            </h2>
            <p className="text-xs text-textSec mt-1">
              Desplegada en{' '}
              <strong className="text-textMain">{selectedRegion}</strong>
              {regionInfo ? ` (${regionInfo.name})` : ''} · Salud general:{' '}
              <span className="font-semibold text-security">{healthPercent}%</span>
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

        {/* Flujo de nodos */}
        <div className="overflow-x-auto">
          <div className="flex items-stretch gap-2 min-w-[720px] py-2">
            {ARCHITECTURE_NODES.map((node, index) => {
              const Icon = node.icon;
              return (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-[90px]">
                    <div
                      className={`w-full flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-bgMain border-borders transition-shadow hover:shadow-xs`}
                    >
                      <Icon className={node.color} size={22} />
                      <span className="text-xs font-bold text-textMain text-center leading-tight">
                        {node.name}
                      </span>
                      <span className="text-[10px] text-textSec text-center">{node.subtitle}</span>
                      <StatusBadge status={node.status} />
                    </div>
                  </div>
                  {index < ARCHITECTURE_NODES.length - 1 && (
                    <div className="flex items-center shrink-0 self-center">
                      <ArrowRight className="text-textSec" size={16} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Resumen VPC + IAM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-borders">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bgMain border border-borders">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
              <Wifi className="text-indigo-500" size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-textMain">VPC 10.0.0.0/16</p>
              <p className="text-[11px] text-textSec">
                Subred pública 10.0.1.0/24 · Subred privada 10.0.2.0/24
              </p>
            </div>
            <StatusBadge status="Active" />
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bgMain border border-borders">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40">
              <Lock className="text-amber-500" size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-textMain">IAM + Security Groups</p>
              <p className="text-[11px] text-textSec">Roles sin claves en código · NACLs activos</p>
            </div>
            <StatusBadge status="Active" />
          </div>
        </div>
      </div>
    </div>
  );
};