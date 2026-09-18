import React from 'react';
import { Globe, Shield, Cpu, Database, ArrowRight, Layers } from 'lucide-react';

export const NetworkView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Arquitectura de Red (VPC)</h1>
        <p className="text-textSec text-sm">Representación del flujo de tráfico e infraestructura de red.</p>
      </div>

      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs overflow-x-auto">
        <div className="min-w-[800px] flex items-center justify-between gap-4 py-8 px-4">
          
          {/* Internet */}
          <div className="flex flex-col items-center gap-2 p-4 bg-bgMain rounded-xl border border-borders w-32 shrink-0">
            <Globe className="text-primary" size={32} />
            <span className="text-xs font-bold text-textMain">INTERNET</span>
          </div>

          <ArrowRight className="text-textSec shrink-0" />

          {/* Route 53 y CloudFront */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-primary block">Route 53</span>
              <span className="text-[10px] text-textSec">DNS Gateway</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-primary block">CloudFront</span>
              <span className="text-[10px] text-textSec">CDN Global</span>
            </div>
          </div>

          <ArrowRight className="text-textSec shrink-0" />

          {/* VPC Boundary */}
          <div className="flex-1 bg-sidebar text-white rounded-2xl p-5 border-2 border-dashed border-primary space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-2">
                <Layers size={16} /> Virtual Private Cloud (VPC 10.0.0.0/16)
              </span>
              <Shield className="text-security" size={18} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Subred Pública */}
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Subred Pública (10.0.1.0/24)</span>
                <div className="flex items-center gap-3 bg-slate-700/60 p-3 rounded-lg border border-slate-600">
                  <Cpu className="text-amber-400" size={20} />
                  <div>
                    <span className="text-xs font-bold block">EC2 Instances</span>
                    <span className="text-[10px] text-slate-400">Web App Frontend/API</span>
                  </div>
                </div>
              </div>

              {/* Subred Privada */}
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Subred Privada (10.0.2.0/24)</span>
                <div className="flex items-center gap-3 bg-slate-700/60 p-3 rounded-lg border border-slate-600">
                  <Database className="text-security" size={20} />
                  <div>
                    <span className="text-xs font-bold block">RDS DB Instance</span>
                    <span className="text-[10px] text-slate-400">PostgreSQL (Privado)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};