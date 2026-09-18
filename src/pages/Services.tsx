import React, { useState } from 'react';
import { INITIAL_SERVICES } from '../data/awsServices';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { Search, Gift } from 'lucide-react';
import type { AWSService } from '../types';

const FREE_TIER = [
  {
    service: 'EC2',
    detail: '750 h/mes t2.micro o t3.micro (12 meses)',
  },
  {
    service: 'RDS',
    detail: '750 h/mes db.t2.micro / db.t3.micro + 20 GB (12 meses)',
  },
  {
    service: 'S3',
    detail: '5 GB estándar + 20 000 GET + 2 000 PUT (12 meses)',
  },
  {
    service: 'CloudFront',
    detail: '1 TB transferencia + 10 M solicitudes/mes (12 meses)',
  },
  {
    service: 'Route 53',
    detail: 'Consultas DNS de zonas alojadas (costo bajo; no full free)',
  },
  {
    service: 'IAM / VPC',
    detail: 'Sin costo adicional (siempre gratuitos)',
  },
];

export const ServicesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedService, setSelectedService] = useState<AWSService | null>(null);

  const filteredServices = INITIAL_SERVICES.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || srv.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Catálogo de Servicios AWS</h1>
        <p className="text-textSec text-sm">Servicios integrados en la arquitectura propuesta.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 text-textSec" size={18} />
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cards border border-borders rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-textMain"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['All', 'Compute', 'Storage', 'Database', 'Security', 'Networking'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-primary text-white'
                  : 'bg-cards text-textSec border border-borders hover:bg-bgMain'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="bg-cards border border-borders rounded-2xl p-10 text-center text-textSec text-sm">
          No se encontraron servicios con esos criterios.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((srv, i) => (
            <div key={srv.id} className={`stagger-${Math.min(i + 1, 5)}`}>
              <ServiceCard service={srv} onClick={() => setSelectedService(srv)} />
            </div>
          ))}
        </div>
      )}

      {/* AWS Free Tier */}
      <div className="bg-cards border border-borders rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Gift size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-textMain">AWS Free Tier (plan gratuito)</h2>
            <p className="text-xs text-textSec">
              Recursos elegibles para prueba o entornos de bajo uso · cuenta nueva (12 meses) salvo indicación.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FREE_TIER.map((item) => (
            <div
              key={item.service}
              className="flex gap-3 p-3.5 rounded-xl border border-borders bg-bgMain hover:border-emerald-500/40 transition-colors"
            >
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 h-fit">
                Free
              </span>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-textMain block">{item.service}</span>
                <span className="text-[11px] text-textSec leading-snug block">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-textSec border-t border-borders pt-3">
          Nota: los límites Free Tier son orientativos según la documentación pública de AWS. En producción
          conviene monitorear Billing y configurar alertas de presupuesto.
        </p>
      </div>

      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};