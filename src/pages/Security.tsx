import React from 'react';
import { MOCK_SECURITY_CHECKS } from '../data/awsServices';
import { SecurityCard } from '../components/SecurityCard';
import { ShieldCheck, Lock } from 'lucide-react';

export const SecurityView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Seguridad e IAM</h1>
        <p className="text-textSec text-sm">Modelo de responsabilidad compartida y control de accesos.</p>
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
          {MOCK_SECURITY_CHECKS.map((item) => (
            <SecurityCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};