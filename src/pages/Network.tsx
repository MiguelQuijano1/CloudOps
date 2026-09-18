import React from 'react';
import {
  Globe,
  Shield,
  Cpu,
  Database,
  ArrowRight,
  Layers,
  Server,
  HardDrive,
  Lock,
  Cloud,
  Wifi,
} from 'lucide-react';

export const NetworkView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Arquitectura de Red (VPC)</h1>
        <p className="text-textSec text-sm">
          Flujo de tráfico, subredes y componentes de la infraestructura AWS.
        </p>
      </div>

      {/* Diagrama principal */}
      <div className="bg-cards border border-borders rounded-2xl p-5 sm:p-6 shadow-xs overflow-x-auto">
        <div className="min-w-[920px] space-y-6 py-4">
          {/* Fila superior: Internet → Edge → IGW */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex flex-col items-center gap-2 p-4 bg-bgMain rounded-xl border border-borders w-28 shrink-0">
              <Globe className="text-primary" size={28} />
              <span className="text-xs font-bold text-textMain text-center">INTERNET</span>
            </div>

            <ArrowRight className="text-textSec shrink-0" size={18} />

            <div className="flex flex-col gap-2 shrink-0">
              <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-center min-w-[120px]">
                <span className="text-xs font-bold text-primary block">Route 53</span>
                <span className="text-[10px] text-textSec">DNS + Health Checks</span>
              </div>
              <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-center min-w-[120px]">
                <span className="text-xs font-bold text-primary block">CloudFront</span>
                <span className="text-[10px] text-textSec">CDN Global (Edge)</span>
              </div>
            </div>

            <ArrowRight className="text-textSec shrink-0" size={18} />

            <div className="flex flex-col items-center gap-1.5 px-4 py-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl shrink-0">
              <Wifi className="text-indigo-500" size={22} />
              <span className="text-xs font-bold text-textMain">Internet Gateway</span>
              <span className="text-[10px] text-textSec">Entrada a la VPC</span>
            </div>
          </div>

          {/* VPC Boundary */}
          <div className="bg-sidebar text-white rounded-2xl p-5 border-2 border-dashed border-primary/70 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-2">
                <Layers size={16} />
                Virtual Private Cloud — 10.0.0.0/16
              </span>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <Shield className="text-security" size={16} />
                Security Groups + NACLs
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subred Pública */}
              <div className="bg-slate-800/90 border border-slate-600 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">
                    Subred Pública · 10.0.1.0/24
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Acceso público
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-700/70 p-3 rounded-lg border border-slate-600">
                  <Server className="text-sky-400 shrink-0" size={20} />
                  <div>
                    <span className="text-xs font-bold block">Application Load Balancer</span>
                    <span className="text-[10px] text-slate-400">HTTP/HTTPS · terminación TLS</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-700/70 p-3 rounded-lg border border-slate-600">
                  <Cpu className="text-amber-400 shrink-0" size={20} />
                  <div>
                    <span className="text-xs font-bold block">EC2 · Web / API</span>
                    <span className="text-[10px] text-slate-400">Frontend + API (Auto Scaling)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-700/70 p-3 rounded-lg border border-slate-600">
                  <Cloud className="text-violet-400 shrink-0" size={20} />
                  <div>
                    <span className="text-xs font-bold block">NAT Gateway</span>
                    <span className="text-[10px] text-slate-400">Salida a Internet (subred privada)</span>
                  </div>
                </div>
              </div>

              {/* Subred Privada */}
              <div className="bg-slate-800/90 border border-slate-600 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wide">
                    Subred Privada · 10.0.2.0/24
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Sin IP pública
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-700/70 p-3 rounded-lg border border-slate-600">
                  <Cpu className="text-orange-400 shrink-0" size={20} />
                  <div>
                    <span className="text-xs font-bold block">EC2 · App / Workers</span>
                    <span className="text-[10px] text-slate-400">Lógica de negocio (solo red interna)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-700/70 p-3 rounded-lg border border-slate-600">
                  <Database className="text-security shrink-0" size={20} />
                  <div>
                    <span className="text-xs font-bold block">RDS PostgreSQL</span>
                    <span className="text-[10px] text-slate-400">Multi-AZ · solo subred privada</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-700/70 p-3 rounded-lg border border-slate-600">
                  <HardDrive className="text-cyan-400 shrink-0" size={20} />
                  <div>
                    <span className="text-xs font-bold block">S3 (vía endpoint VPC)</span>
                    <span className="text-[10px] text-slate-400">Objetos / backups sin salir a Internet</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie VPC: IAM */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
              <Lock className="text-amber-400" size={16} />
              <span className="text-[11px] text-slate-300">
                <strong className="text-white">IAM</strong> — roles y políticas para EC2, RDS, S3 y CloudFront (sin claves en código)
              </span>
            </div>
          </div>

          {/* Leyenda de flujo */}
          <div className="flex flex-wrap gap-4 justify-center text-[11px] text-textSec">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Tráfico entrante (usuarios)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Subred pública
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Subred privada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-security" />
              Datos / persistencia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};