import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Server, DollarSign, Tag, Activity, Layers } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { AWSService } from '../types';

interface ServiceDetailModalProps {
  service: AWSService;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
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

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.55)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-cards border border-borders rounded-2xl shadow-xs w-full max-w-lg max-h-[90vh] overflow-y-auto modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-borders sticky top-0 bg-cards z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Server size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-textMain">{service.name}</h2>
              <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                {service.category}
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
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={service.status} />
            {service.monthlyCost > 0 && (
              <span className="text-xs font-bold text-costs bg-bgMain px-2.5 py-1 rounded-full border border-borders">
                ${service.monthlyCost}/mes
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-textSec uppercase mb-1.5 flex items-center gap-1.5">
              <Layers size={13} /> Descripción
            </h3>
            <p className="text-sm text-textMain leading-relaxed">{service.description}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-textSec uppercase mb-1.5 flex items-center gap-1.5">
              <Activity size={13} /> Función principal
            </h3>
            <p className="text-sm text-textMain font-medium">{service.mainFunction}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-bgMain border border-borders rounded-xl p-3">
              <span className="text-[11px] text-textSec font-semibold flex items-center gap-1 mb-1">
                <Tag size={12} /> Categoría
              </span>
              <p className="text-sm font-bold text-textMain">{service.category}</p>
            </div>
            <div className="bg-bgMain border border-borders rounded-xl p-3">
              <span className="text-[11px] text-textSec font-semibold flex items-center gap-1 mb-1">
                <DollarSign size={12} /> Costo mensual
              </span>
              <p className="text-sm font-bold text-costs">
                {service.monthlyCost > 0 ? `$${service.monthlyCost.toFixed(2)}` : 'Incluido / $0'}
              </p>
            </div>
          </div>

          <div className="bg-bgMain border border-borders rounded-xl p-3">
            <span className="text-[11px] text-textSec font-semibold block mb-1">ID del servicio</span>
            <code className="text-xs text-textMain">{service.id}</code>
          </div>
        </div>

        <div className="p-5 border-t border-borders flex justify-end sticky bottom-0 bg-cards">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};