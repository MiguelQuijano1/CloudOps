import React, { useState } from 'react';
import { INITIAL_COSTS } from '../data/awsServices';
import type { CostItem } from '../types';
import { CostCard } from '../components/CostCard';
import { BarChart } from '../components/BarChart';
import { DonutChart } from '../components/DonutChart';
import { PageHeader } from '../components/PageHeader';
import { MiniStat } from '../components/MiniStat';
import { DollarSign, Plus, Download, TrendingDown, PiggyBank } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportCsvReport } from '../utils/exportCsv';

const BAR_COLORS = [
  'var(--color-primary)',
  'var(--color-costs)',
  'var(--color-security)',
  'var(--color-alerts)',
  '#7C3AED',
  '#0891B2',
  '#64748B',
  '#EC4899',
];

export const CostsView: React.FC = () => {
  const { selectedRegion, addNotification } = useApp();
  const [costs, setCosts] = useState<CostItem[]>(() => {
    const saved = localStorage.getItem('cloudops_costs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COSTS;
      }
    }
    return INITIAL_COSTS;
  });
  const [serviceName, setServiceName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hoursPerMonth, setHoursPerMonth] = useState(730);
  const [costPerHour, setCostPerHour] = useState(0.05);

  const persistCosts = (next: CostItem[]) => {
    setCosts(next);
    localStorage.setItem('cloudops_costs', JSON.stringify(next));
  };

  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();
    const monthlyCost = quantity * hoursPerMonth * costPerHour;
    const newItem: CostItem = {
      id: Date.now().toString(),
      serviceName: serviceName.trim(),
      quantity,
      hoursPerMonth,
      costPerHour,
      monthlyCost,
      annualCost: monthlyCost * 12,
    };
    persistCosts([...costs, newItem]);
    setServiceName('');
    setQuantity(1);
    setHoursPerMonth(730);
    setCostPerHour(0.05);
    addNotification({
      title: 'Nueva estimación de costo',
      message: `Se añadió ${newItem.serviceName} por $${monthlyCost.toFixed(2)}/mes.`,
      type: 'success',
    });
  };

  const handleDeleteCost = (id: string) => {
    const item = costs.find((c) => c.id === id);
    const next = costs.filter((c) => c.id !== id);
    persistCosts(next);
    if (item) {
      addNotification({
        title: 'Estimación eliminada',
        message: `Se eliminó ${item.serviceName} ($${item.monthlyCost.toFixed(2)}/mes).`,
        type: 'info',
      });
    }
  };

  const totalMonthly = costs.reduce((acc, item) => acc + item.monthlyCost, 0);
  const totalAnnual = totalMonthly * 12;
  const potentialSavings = totalMonthly * 0.18;
  const donutData = costs.map((c) => ({ label: c.serviceName, value: c.monthlyCost }));

  const chartData = costs
    .slice()
    .sort((a, b) => b.monthlyCost - a.monthlyCost)
    .map((c, i) => ({
      label: c.serviceName,
      value: c.monthlyCost,
      colorVar: BAR_COLORS[i % BAR_COLORS.length],
    }));

  const exportReport = () => {
    exportCsvReport({
      title: 'CloudOps – Reporte de Costos',
      slug: 'costos',
      regionId: selectedRegion,
      columns: ['Servicio', 'Cantidad', 'Horas/Mes', 'Costo/Hora', 'Mensual', 'Anual'],
      rows: costs.map((c) => [
        c.serviceName,
        c.quantity,
        c.hoursPerMonth,
        c.costPerHour,
        c.monthlyCost.toFixed(2),
        c.annualCost.toFixed(2),
      ]),
      totals: [
        ['Total Mensual', `$${totalMonthly.toFixed(2)}`],
        ['Total Anual', `$${totalAnnual.toFixed(2)}`],
      ],
    });
    addNotification({
      title: 'Reporte exportado',
      message: `Se descargó el reporte CSV de costos para ${selectedRegion}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="FinOps Engine · AWS Ecosystem"
        title="Estimación de Costos y Economía Cloud"
        description="Simulación actuarial de recursos aprovisionados, compromisos y desglose presupuestario en tiempo real."
        badge={{ label: 'Optimizado con Savings Plans', tone: 'security' }}
        actions={
          <button
            onClick={exportReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Exportar Informe CSV
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MiniStat
          label="Total Mensual Estimado"
          value={`$${totalMonthly.toFixed(2)}`}
          icon={DollarSign}
          tone="costs"
          footnote={`Región: ${selectedRegion}`}
        />
        <MiniStat
          label="Proyección Anual"
          value={`$${totalAnnual.toFixed(2)}`}
          icon={TrendingDown}
          tone="neutral"
          footnote="Amortización simple 12 meses"
        />
        <MiniStat
          label="Ahorro Potencial FinOps"
          value={`-$${potentialSavings.toFixed(2)}`}
          icon={PiggyBank}
          tone="security"
          footnote="Con Reserved Instances (est. -18%)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cards border border-borders rounded-2xl p-6 shadow-xs">
          {chartData.length > 0 ? (
            <BarChart
              title="Distribución de Costos por Servicio (mensual)"
              data={chartData}
              valuePrefix="$"
              orientation="vertical"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSign size={36} className="text-textSec mb-3 opacity-50" />
              <p className="text-sm font-semibold text-textMain">Sin estimaciones de costo</p>
              <p className="text-xs text-textSec mt-1">
                Añade un servicio abajo para ver la distribución en el gráfico.
              </p>
            </div>
          )}
        </div>

        <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs">
          {donutData.length > 0 ? (
            <DonutChart title="Distribución y Desglose Presupuestario" data={donutData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <DollarSign size={28} className="text-textSec mb-2 opacity-40" />
              <p className="text-xs text-textSec">Sin datos para graficar todavía.</p>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleAddCost}
        className="bg-cards border border-borders p-5 rounded-2xl shadow-xs flex flex-wrap gap-4 items-end"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-textSec block mb-1">
            Nombre Servicio/Recurso
          </label>
          <input
            type="text"
            required
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full border border-borders p-2.5 rounded-xl text-sm bg-bgMain text-textMain"
            placeholder="Ej: EC2 t3.large"
          />
        </div>
        <div className="w-32">
          <label className="text-xs font-semibold text-textSec block mb-1">Cantidad</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border border-borders p-2.5 rounded-xl text-sm bg-bgMain text-textMain"
          />
        </div>
        <div className="w-36">
          <label className="text-xs font-semibold text-textSec block mb-1">
            Horas Estimadas/Mes
          </label>
          <input
            type="number"
            min={1}
            max={744}
            value={hoursPerMonth}
            onChange={(e) => setHoursPerMonth(Number(e.target.value))}
            className="w-full border border-borders p-2.5 rounded-xl text-sm bg-bgMain text-textMain"
          />
        </div>
        <div className="w-36">
          <label className="text-xs font-semibold text-textSec block mb-1">Costo / Hora ($)</label>
          <input
            type="number"
            step="0.001"
            min={0}
            value={costPerHour}
            onChange={(e) => setCostPerHour(Number(e.target.value))}
            className="w-full border border-borders p-2.5 rounded-xl text-sm bg-bgMain text-textMain"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Añadir Estimación
        </button>
      </form>

      <div className="space-y-3">
        {costs.length === 0 ? (
          <p className="text-sm text-textSec text-center py-6">
            No hay estimaciones. Usa el formulario para agregar la primera.
          </p>
        ) : (
          costs.map((item) => (
            <CostCard key={item.id} item={item} onDelete={handleDeleteCost} />
          ))
        )}
      </div>
    </div>
  );
};