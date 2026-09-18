import React, { useState } from 'react';
import type { CloudPlan } from '../types';
import { INITIAL_SERVICES } from '../data/awsServices';
import { Save, CheckCircle, FileText, Users } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Planificación Cloud</h1>
        <p className="text-textSec text-sm">Registra una propuesta de solución en la nube.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 bg-cards p-6 border border-borders rounded-2xl shadow-xs space-y-4 h-fit">
          <h2 className="text-base font-bold text-textMain">Registrar Propuesta Cloud</h2>

          <div>
            <label className="text-xs font-semibold text-textSec block mb-1">Nombre de la Solución</label>
            <input
              type="text"
              required
              value={form.solutionName}
              onChange={(e) => setForm({ ...form, solutionName: e.target.value })}
              className="w-full border border-borders p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              placeholder="Ej: CloudOps Portal"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-textSec block mb-1">Tipo de Aplicación</label>
            <select
              required
              value={form.appType}
              onChange={(e) => setForm({ ...form, appType: e.target.value })}
              className="w-full border border-borders p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
            >
              {APP_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-textSec block mb-1">Región</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full border border-borders p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
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
                className="w-full border border-borders p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              >
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-textSec block mb-1 flex items-center gap-1.5">
              <Users size={13} /> Usuarios Estimados
            </label>
            <input
              type="number"
              min={1}
              required
              value={form.estimatedUsers}
              onChange={(e) => setForm({ ...form, estimatedUsers: Number(e.target.value) })}
              className="w-full border border-borders p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-textSec block mb-1">Servicios Cloud Seleccionados</label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((name) => {
                const active = form.selectedServices.includes(name);
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => toggleService(name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      active
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
            <label className="text-xs font-semibold text-textSec block mb-1">Objetivo de Migración</label>
            <input
              type="text"
              value={form.migrationGoal}
              onChange={(e) => setForm({ ...form, migrationGoal: e.target.value })}
              className="w-full border border-borders p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-textSec block mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-borders p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-bgMain"
              rows={3}
            />
          </div>

          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <Save size={18} /> Guardar Propuesta
          </button>
        </form>

        {/* Lista de Registros */}
        <div className="lg:col-span-2 space-y-4">
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