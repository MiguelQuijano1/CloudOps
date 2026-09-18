import React, { useState } from 'react';
import { INITIAL_SERVICES } from '../data/awsServices';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { Search } from 'lucide-react';
import type { AWSService } from '../types';

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

      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};