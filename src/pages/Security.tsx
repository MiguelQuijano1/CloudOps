import React, { useState } from 'react';
import { useCloudData } from '../context/CloudDataContext';
import { SecurityCard } from '../components/SecurityCard';
import { PageHeader } from '../components/PageHeader';
import { MiniStat } from '../components/MiniStat';
import { ShieldCheck, Lock, KeyRound, AlertTriangle, ShieldAlert, Download, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportCsvReport } from '../utils/exportCsv';

export const SecurityView: React.FC = () => {
  const { selectedRegion, addNotification } = useApp();
  const { securityChecks } = useCloudData();
  const [auditing, setAuditing] = useState(false);
  const total = securityChecks.length;
  const correct = securityChecks.filter((c) => c.status === 'correct').length;
  const issues = securityChecks.filter((c) => c.status === 'issue').length;
  const reviews = securityChecks.filter((c) => c.status === 'review').length;
  const score = Math.round((correct / total) * 100);

  const runAudit = () => {
    setAuditing(true);
    window.setTimeout(() => {
      setAuditing(false);
      addNotification({
        title: 'Auditoría IAM completada',
        message:
          issues > 0
            ? `Se detectaron ${issues} hallazgo(s) crítico(s) en políticas IAM. Revisa el panel de abajo.`
            : 'No se encontraron políticas IAM sobre-permisivas en esta pasada.',
        type: issues > 0 ? 'warning' : 'success',
      });
    }, 1200);
  };

  const exportReport = () => {
    exportCsvReport({
      title: 'Reporte de Seguridad, Identidad y Cumplimiento',
      slug: 'seguridad',
      regionId: selectedRegion,
      columns: ['Control', 'Estado', 'Detalle'],
      rows: securityChecks.map((c) => [c.title, c.status, c.description]),
      totals: [
        ['Well-Architected Score', `${score}/100`],
        ['Controles aprobados', `${correct} / ${total}`],
        ['Críticos', issues],
        ['En revisión', reviews],
      ],
    });
    addNotification({
      title: 'Reporte exportado',
      message: `Se descargó el reporte CSV de seguridad para ${selectedRegion}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="AWS Cloud Foundations · CIS AWS Foundations Benchmark v2.0"
        title="Seguridad, Identidad y Cumplimiento"
        description="Modelo de responsabilidad compartida, IAM y auditoría continua de la postura de seguridad."
        badge={{
          label: issues > 0 ? 'Postura: Requiere Atención' : 'Postura: Cumplimiento Alto',
          tone: issues > 0 ? 'alerts' : 'security',
        }}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-cards border border-borders text-textMain rounded-xl text-sm font-semibold hover:bg-bgMain transition-colors"
            >
              <Download size={16} /> Exportar CSV
            </button>
            <button
              onClick={runAudit}
              disabled={auditing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {auditing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {auditing ? 'Auditando…' : 'Auditar Políticas IAM'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MiniStat
          label="Well-Architected Score"
          value={`${score}/100`}
          icon={ShieldCheck}
          tone={score >= 80 ? 'security' : 'costs'}
          footnote={`${correct} de ${total} controles aprobados`}
        />
        <MiniStat label="Cargas Protegidas" value="100%" icon={KeyRound} tone="security" footnote="Cifrado KMS en producción" />
        <MiniStat label="Estado IAM Root" value="MFA Forzado" icon={Lock} tone="security" footnote="Cuenta root asegurada" />
        <MiniStat
          label="Alertas de Seguridad"
          value={`${issues + reviews}`}
          icon={issues > 0 ? ShieldAlert : AlertTriangle}
          tone={issues > 0 ? 'alerts' : 'costs'}
          footnote={`${issues} crítica(s) · ${reviews} en revisión`}
        />
      </div>

      {/* Modelo de Responsabilidad Compartida */}
      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-textMain flex items-center gap-2">
          <ShieldCheck className="text-security" size={20} /> Modelo de Responsabilidad Compartida
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
            <h3 className="font-bold text-security uppercase tracking-wide">Responsabilidad del Cliente</h3>
            <ul className="space-y-1 text-textMain list-disc list-inside">
              <li>Datos de los clientes e identidades IAM</li>
              <li>Configuración del Firewall y red (VPC / Security Groups)</li>
              <li>Encriptación de datos en tránsito y en reposo</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
            <h3 className="font-bold text-primary uppercase tracking-wide">Responsabilidad de AWS</h3>
            <ul className="space-y-1 text-textMain list-disc list-inside">
              <li>Seguridad física de Centros de Datos</li>
              <li>Hardware e infraestructura global</li>
              <li>Software de virtualización y red física</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Panel de Chequeos usando SecurityCard reutilizable */}
      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-textMain flex items-center gap-2">
          <Lock className="text-primary" size={20} /> Auditoría de Seguridad e IAM
        </h2>
        <div className="space-y-3">
          {securityChecks.map((item) => (
            <SecurityCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};