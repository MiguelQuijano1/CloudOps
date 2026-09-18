import React, { useState } from 'react';
import { INITIAL_SERVICES } from '../data/awsServices';
import { ServiceCard } from '../components/ServiceCard';
import { Search } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredServices = INITIAL_SERVICES.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || srv.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Catálogo de Servicios AWS</h1>
        <p className="text-textSec text-sm">Servicios integrados en la arquitectura propuesta.</p>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 text-textSec" size={18} />
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cards border border-borders rounded-xl text-sm focus:outline-primary"
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

      {/* Catálogo usando ServiceCard reutilizable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((srv) => (
          <ServiceCard key={srv.id} service={srv} />
        ))}
      </div>
    </div>
  );
};