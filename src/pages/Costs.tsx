import React, { useState } from 'react';
import { INITIAL_COSTS } from '../data/awsServices';
import type { CostItem } from '../types';
import { CostCard } from '../components/CostCard';
import { BarChart } from '../components/BarChart';
import { DollarSign, Plus, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

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

  const chartData = costs
    .slice()
    .sort((a, b) => b.monthlyCost - a.monthlyCost)
    .map((c, i) => ({
      label: c.serviceName,
      value: c.monthlyCost,
      colorVar: BAR_COLORS[i % BAR_COLORS.length],
    }));

  const exportReport = () => {
    const lines = [
      'CloudOps – Reporte de Costos',
      `Región: ${selectedRegion}`,
      `Fecha: ${new Date().toLocaleString()}`,
      '',
      'Servicio,Cantidad,Horas/Mes,Costo/Hora,Mensual,Anual',
      ...costs.map(
        (c) =>
          `"${c.serviceName}",${c.quantity},${c.hoursPerMonth},${c.costPerHour},${c.monthlyCost.toFixed(2)},${c.annualCost.toFixed(2)}`
      ),
      '',
      `Total Mensual,$${totalMonthly.toFixed(2)}`,
      `Total Anual,$${totalAnnual.toFixed(2)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudops-costos-${selectedRegion}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification({
      title: 'Reporte exportado',
      message: `Se descargó el reporte CSV de costos para ${selectedRegion}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Costos y Economía Cloud</h1>
          <p className="text-textSec text-sm">
            Estimación y calculadora de infraestructura AWS · Región: {selectedRegion}
          </p>
        </div>
        <button
          onClick={exportReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cards border border-borders rounded-xl text-sm font-semibold text-textMain hover:bg-bgMain transition-colors"
        >
          <Download size={18} className="text-primary" />
          Exportar reporte CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-cards border border-borders rounded-2xl p-5 shadow-xs flex items-center justify-between card-hover">
          <div>
            <span className="text-textSec text-xs font-semibold uppercase tracking-wide">
              Costo Mensual Total
            </span>
            <h3 className="text-3xl font-bold text-costs mt-1">${totalMonthly.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-costs rounded-xl">
            <DollarSign size={28} />
          </div>
        </div>

        <div className="bg-cards border border-borders rounded-2xl p-5 shadow-xs flex items-center justify-between card-hover">
          <div>
            <span className="text-textSec text-xs font-semibold uppercase tracking-wide">
              Costo Anual Proyectado
            </span>
            <h3 className="text-3xl font-bold text-textMain mt-1">${totalAnnual.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 text-textSec rounded-xl">
            <DollarSign size={28} />
          </div>
        </div>
      </div>

      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs">
        {chartData.length > 0 ? (
          <BarChart
            title="Distribución de Costos por Servicio (mensual)"
            data={chartData}
            valuePrefix="$"
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