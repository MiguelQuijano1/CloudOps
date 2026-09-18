import React from 'react';
import { StatCard } from '../components/StatCard';
import { SecurityCard } from '../components/SecurityCard';
import { BarChart } from '../components/BarChart';
import { MOCK_SECURITY_CHECKS, INITIAL_SERVICES, MOCK_REGIONS } from '../data/awsServices';
import { Server, Globe, DollarSign, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const { selectedRegion } = useApp();
  const totalCost = INITIAL_SERVICES.reduce((acc, s) => acc + s.monthlyCost, 0);
  const regionInfo = MOCK_REGIONS.find((r) => r.id === selectedRegion);

  const chartData = INITIAL_SERVICES.filter((s) => s.monthlyCost > 0).map((s) => ({
    label: s.name,
    value: s.monthlyCost,
  }));

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

      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4 animate-fade-in stagger-4">
        <h2 className="text-base font-bold text-textMain">Estado de la Arquitectura</h2>
        <p className="text-xs text-textSec">
          Arquitectura desplegada en <strong className="text-textMain">{selectedRegion}</strong>
          {regionInfo ? ` (${regionInfo.name})` : ''}: INTERNET → Route 53 → CloudFront → VPC → EC2 /
          RDS. Consulta el módulo de Arquitectura de Red para la representación visual completa.
        </p>
      </div>
    </div>
  );
};