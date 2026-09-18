import React from 'react';

interface StatusBadgeProps {
  status: 'correct' | 'review' | 'issue' | 'Operational' | 'Degraded' | 'Maintenance' | 'Active' | 'Planned' | 'Inactive';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClass = 'bg-slate-100 text-slate-700';
  let label: string = status;

  if (status === 'correct' || status === 'Operational' || status === 'Active') {
    badgeClass = 'bg-emerald-50 text-security border-emerald-200';
    label = status === 'correct' ? 'Correcto' : status === 'Operational' ? 'Operacional' : 'Activo';
  } else if (status === 'review' || status === 'Degraded' || status === 'Planned') {
    badgeClass = 'bg-amber-50 text-costs border-amber-200';
    label = status === 'review' ? 'Revisar' : status === 'Degraded' ? 'Degradado' : 'Planificado';
  } else if (status === 'issue' || status === 'Maintenance' || status === 'Inactive') {
    badgeClass = 'bg-red-50 text-alerts border-red-200';
    label = status === 'issue' ? 'Problema' : status === 'Maintenance' ? 'Mantenimiento' : 'Inactivo';
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeClass}`}>
      {label}
    </span>
  );
};