import React, { useState } from 'react';
import type { CloudPlan } from '../types';
import { INITIAL_SERVICES } from '../data/awsServices';
import { Save, CheckCircle, FileText, Users, History, Share2, Layers, Gauge, Clock } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

const AVAILABILITY_OPTIONS = ['99.0%', '99.5%', '99.9%', '99.99%'];
const SERVICE_OPTIONS = INITIAL_SERVICES.map((s) => s.name);
const APP_TYPE_OPTIONS = [
  'Web Enterprise App',
  'API / Microservicios',
  'Aplicación Móvil Backend',
  'E-commerce',
  'Data Analytics / BI',
  'IoT / Streaming',
  'SaaS Multi-tenant',
  'Sitio Web Estático',
  'Batch / Procesamiento',
  'Otro',
];

export const PlanningView: React.FC = () => {
  const [plans, setPlans] = useState<CloudPlan[]>(() => {
    const saved = localStorage.getItem('cloud_plans');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState<Omit<CloudPlan, 'id' | 'createdAt'>>({
    solutionName: '',
    appType: 'Web Enterprise App',
    description: '',
    region: 'us-east-1',
    estimatedUsers: 5000,
    availability: '99.9%',
    selectedServices: ['EC2', 'S3', 'RDS'],
    migrationGoal: 'Escalabilidad y Reducción de Latencia',
  });

  const toggleService = (name: string) => {
    setForm((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(name)
        ? prev.selectedServices.filter((s) => s !== name)
        : [...prev.selectedServices, name],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: CloudPlan = {
      ...form,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [...plans, newPlan];
    setPlans(updated);
    localStorage.setItem('cloud_plans', JSON.stringify(updated));
    setForm({
      solutionName: '',
      appType: 'Web Enterprise App',
      description: '',
      region: 'us-east-1',
      estimatedUsers: 5000,
      availability: '99.9%',
      selectedServices: ['EC2', 'S3', 'RDS'],
      migrationGoal: '',
    });
  };

  const latestPlan = plans[plans.length - 1];
  const estCostPerUser = 0.09;
  const previewCost = latestPlan
    ? Math.max(120, Math.round(latestPlan.estimatedUsers * estCostPerUser))
    : Math.max(120, Math.round(form.estimatedUsers * estCostPerUser));
  const previewName = latestPlan?.solutionName || form.solutionName || 'Nueva Solución Cloud';
  const previewAvailability = latestPlan?.availability || form.availability;
  const previewServices = latestPlan?.selectedServices || form.selectedServices;
  const previewUsers = latestPlan?.estimatedUsers ?? form.estimatedUsers;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Módulo 2 · Práctica Integrativa"
        title="Planificación y Propuesta de Solución Cloud"
        description="Modelado de capacidad computacional, resiliencia multi-zona y dimensionamiento de servicios gestionados AWS para despliegues empresariales."
        badge={{ label: `${plans.length} propuesta(s) registrada(s)`, tone: 'primary' }}
        actions={
          <>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-cards border border-borders rounded-xl text-sm font-semibold text-textMain hover:bg-bgMain transition-colors">
              <History size={16} className="text-textSec" /> Historial
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-cards border border-borders rounded-xl text-sm font-semibold text-textMain hover:bg-bgMain transition-colors">
              <Share2 size={16} className="text-textSec" /> Compartir
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-cards p-5 border border-borders rounded-2xl shadow-xs space-y-3.5">
          <div className="flex items-center gap-3 pb-3 border-b border-borders">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-primary">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-textMain">Especificación de Carga &amp; Requisitos</h2>
              <p className="text-[11px] text-textSec">Parámetros base para la síntesis de infraestructura</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-textSec block mb-1">Nombre de la Solución</label>
              <input
                type="text"
                required
                value={form.solutionName}
                onChange={(e) => setForm({ ...form, solutionName: e.target.value })}
                className="w-full border border-borders p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
                placeholder="Ej: CloudOps Portal"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-textSec block mb-1">Tipo de Aplicación</label>
              <select
                required
                value={form.appType}
                onChange={(e) => setForm({ ...form, appType: e.target.value })}
                className="w-full border border-borders p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              >
                {APP_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-textSec block mb-1">Región</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full border border-borders p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="sa-east-1">South America (São Paulo)</option>
                <option value="eu-west-1">EU (Ireland)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-textSec block mb-1">Disponibilidad</label>
              <select
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="w-full border border-borders p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              >
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-textSec block mb-1 flex items-center gap-1.5">
                <Users size={12} /> Usuarios Estimados
              </label>
              <input
                type="number"
                min={1}
                required
                value={form.estimatedUsers}
                onChange={(e) => setForm({ ...form, estimatedUsers: Number(e.target.value) })}
                className="w-full border border-borders p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-textSec block mb-1">Objetivo de Migración</label>
              <input
                type="text"
                value={form.migrationGoal}
                onChange={(e) => setForm({ ...form, migrationGoal: e.target.value })}
                className="w-full border border-borders p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-textSec block mb-1.5">Servicios Cloud Seleccionados</label>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_OPTIONS.map((name) => {
                const active = form.selectedServices.includes(name);
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => toggleService(name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${active
                        ? 'bg-primary text-white border-primary'
                        : 'bg-bgMain text-textSec border-borders hover:border-primary/50'
                      }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-textSec block mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-borders p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              rows={2}
            />
          </div>

          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <Save size={16} /> Guardar y Calcular Arquitectura
          </button>
        </form>

        {/* Ficha técnica en vivo */}
        <div className="lg:col-span-1 bg-cards border border-borders rounded-2xl p-5 shadow-xs space-y-4 h-fit animate-fade-in stagger-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
              #ARC-{(plans.length + 982).toString()} · Producción
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-security border border-emerald-200">
              Vista previa
            </span>
          </div>
          <h3 className="text-base font-bold text-textMain leading-snug">{previewName}</h3>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-bgMain border border-borders">
              <span className="text-[9px] font-semibold text-textSec uppercase">Costo Estimado</span>
              <p className="text-base font-bold text-costs mt-0.5">${previewCost}/mes</p>
            </div>
            <div className="p-2.5 rounded-xl bg-bgMain border border-borders">
              <span className="text-[9px] font-semibold text-textSec uppercase">SLA Garantizado</span>
              <p className="text-base font-bold text-security mt-0.5 flex items-center gap-1">
                <CheckCircle size={13} /> {previewAvailability}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-bgMain border border-borders">
              <span className="text-[9px] font-semibold text-textSec uppercase flex items-center gap-1">
                <Users size={10} /> Usuarios
              </span>
              <p className="text-base font-bold text-textMain mt-0.5">{previewUsers.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-bgMain border border-borders">
              <span className="text-[9px] font-semibold text-textSec uppercase flex items-center gap-1">
                <Clock size={10} /> Revisión
              </span>
              <p className="text-xs font-bold text-textMain mt-1">
                {latestPlan?.createdAt ?? new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-textSec flex items-center gap-1.5">
              <Gauge size={12} /> Servicios integrados
            </span>
            <div className="flex flex-wrap gap-1.5">
              {previewServices.length > 0 ? (
                previewServices.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-primary border border-blue-100 dark:border-blue-900"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-textSec">Sin servicios seleccionados aún.</span>
              )}
            </div>
          </div>

          <p className="text-[10px] text-textSec border-t border-borders pt-2.5 leading-relaxed">
            Esta ficha se recalcula en vivo con los valores del formulario hasta que guardes la
            propuesta.
          </p>
        </div>

        {/* Lista de Registros */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-base font-bold text-textMain">Propuestas Almacenadas</h2>
          {plans.length === 0 ? (
            <div className="bg-cards border border-borders p-8 rounded-2xl text-center text-textSec">
              <FileText size={32} className="mx-auto mb-2 text-textSec/50" />
              <p className="text-sm">No hay propuestas registradas. Utiliza el formulario para añadir una nueva.</p>
            </div>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="bg-cards border border-borders p-5 rounded-2xl shadow-xs space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-bold text-textMain text-base">{plan.solutionName}</h3>
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 text-security font-semibold rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                    <CheckCircle size={12} /> {plan.availability}
                  </span>
                </div>
                <p className="text-xs text-textSec">{plan.description}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-borders">
                  <span className="text-[11px] bg-bgMain text-textSec px-2.5 py-1 rounded-lg border border-borders">Región: {plan.region}</span>
                  <span className="text-[11px] bg-bgMain text-textSec px-2.5 py-1 rounded-lg border border-borders">Tipo: {plan.appType}</span>
                  <span className="text-[11px] bg-bgMain text-textSec px-2.5 py-1 rounded-lg border border-borders">
                    Usuarios: {plan.estimatedUsers.toLocaleString()}
                  </span>
                  <span className="text-[11px] bg-bgMain text-textSec px-2.5 py-1 rounded-lg border border-borders">Meta: {plan.migrationGoal}</span>
                </div>
                {plan.selectedServices.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {plan.selectedServices.map((s) => (
                      <span key={s} className="text-[10px] bg-blue-50 text-primary px-2 py-0.5 rounded-md font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};