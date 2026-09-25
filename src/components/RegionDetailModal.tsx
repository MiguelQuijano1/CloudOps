import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Globe,
  Server,
  MapPin,
  Activity,
  DollarSign,
  Layers,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { RegionInfo, AWSService } from '../types';

interface RegionDetailModalProps {
  region: RegionInfo;
  services: AWSService[];
  onClose: () => void;
  /** Si se provee, permite simular un incidente/recuperación de la región (persistido en local). */
  onToggleStatus?: (region: RegionInfo) => void;
}

export const RegionDetailModal: React.FC<RegionDetailModalProps> = ({
  region,
  services,
  onClose,
  onToggleStatus,
}) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const totalCost = services.reduce((acc, s) => acc + s.monthlyCost, 0);
  const activeCount = services.filter((s) => s.status === 'Active').length;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.55)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-cards border border-borders rounded-2xl shadow-xs w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-borders sticky top-0 bg-cards z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Globe size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-textMain">{region.name}</h2>
              <span className="text-xs text-textSec flex items-center gap-1 mt-0.5">
                <MapPin size={12} />
                {region.location} · {region.id}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-textSec hover:bg-bgMain transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={region.status} />
            <span className="text-xs px-2.5 py-1 rounded-lg bg-bgMain border border-borders text-textSec">
              {services.length} servicios
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-bgMain border border-borders text-textSec">
              {activeCount} activos
            </span>
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(region)}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-borders bg-bgMain text-textMain hover:border-primary/50 transition-colors"
              >
                {region.status === 'Operational' ? (
                  <>
                    <Wrench size={13} className="text-costs" /> Simular mantenimiento
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} className="text-security" /> Marcar operativa
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-bgMain border border-borders">
              <span className="text-[11px] text-textSec flex items-center gap-1.5 mb-1">
                <Server size={13} className="text-primary" />
                Desplegados
              </span>
              <span className="text-xl font-bold text-textMain">
                {region.deployedServicesCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-bgMain border border-borders">
              <span className="text-[11px] text-textSec flex items-center gap-1.5 mb-1">
                <DollarSign size={13} className="text-costs" />
                Costo est. / mes
              </span>
              <span className="text-xl font-bold text-textMain">
                ${totalCost.toFixed(0)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-textMain mb-3 flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              Servicios en esta región
            </h3>

            {services.length === 0 ? (
              <p className="text-sm text-textSec">No hay servicios registrados en esta región.</p>
            ) : (
              <div className="space-y-2">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl border border-borders bg-bgMain"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-textMain">{srv.name}</span>
                        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
                          {srv.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-textSec mt-1 leading-snug">
                        {srv.mainFunction}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-textMain block">
                        ${srv.monthlyCost.toFixed(0)}
                        <span className="text-textSec font-normal">/mes</span>
                      </span>
                      <span className="text-[10px] text-textSec flex items-center justify-end gap-1 mt-0.5">
                        <Activity size={10} />
                        {srv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};