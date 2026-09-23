import React, { useMemo, useState } from 'react';
import {
  Globe,
  Route,
  Cloud,
  Wifi,
  Network as NetworkIcon,
  Server,
  Database,
  HardDrive,
  Cpu,
  ShieldCheck,
  Activity,
  Search,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MiniStat } from '../components/MiniStat';

interface FlowNode {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  metricLabel: string;
  metricValue: string;
  detail: string;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: 'internet',
    name: 'Internet',
    subtitle: 'Tráfico Público',
    icon: Globe,
    metricLabel: 'Solicitudes',
    metricValue: '4.2k req/s',
    detail: 'Tráfico HTTP/HTTPS entrante desde clientes globales vía Anycast BGP.',
  },
  {
    id: 'route53',
    name: 'Route 53',
    subtitle: 'DNS + Health Checks',
    icon: Route,
    metricLabel: 'Resolución',
    metricValue: '100% OK',
    detail: 'Enrutamiento por latencia y geo-proximidad. TTL 60s, 12/12 endpoints saludables.',
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    subtitle: 'CDN + WAF',
    icon: Cloud,
    metricLabel: 'Cache Hit',
    metricValue: '89.4%',
    detail: 'Distribución edge con AWS Shield y WAF Layer 7 activo en 450+ ubicaciones.',
  },
  {
    id: 'igw',
    name: 'Internet Gateway',
    subtitle: 'Entrada a la VPC',
    icon: Wifi,
    metricLabel: 'Estado',
    metricValue: 'Adjunto',
    detail: 'Punto de entrada/salida de la VPC 10.0.0.0/16 hacia la subred pública.',
  },
  {
    id: 'vpc',
    name: 'VPC Principal',
    subtitle: '10.0.0.0/16',
    icon: NetworkIcon,
    metricLabel: 'Subredes',
    metricValue: '2 activas',
    detail: 'Red virtual aislada con segmentación pública/privada y tablas de ruteo dedicadas.',
  },
];

interface SubnetResource {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  status: 'Active' | 'Inactive';
}

const PUBLIC_RESOURCES: SubnetResource[] = [
  { id: 'alb', name: 'Application Load Balancer', subtitle: 'HTTP/HTTPS · terminación TLS', icon: Server, status: 'Active' },
  { id: 'ec2-web', name: 'EC2 · Web / API', subtitle: 'Frontend + API (Auto Scaling)', icon: Cpu, status: 'Active' },
  { id: 'nat', name: 'NAT Gateway', subtitle: 'Salida a Internet (subred privada)', icon: Cloud, status: 'Active' },
];

const PRIVATE_RESOURCES: SubnetResource[] = [
  { id: 'ec2-app', name: 'EC2 · App / Workers', subtitle: 'Lógica de negocio (solo red interna)', icon: Cpu, status: 'Active' },
  { id: 'rds', name: 'RDS PostgreSQL', subtitle: 'Multi-AZ · solo subred privada', icon: Database, status: 'Active' },
  { id: 's3-endpoint', name: 'S3 (vía endpoint VPC)', subtitle: 'Objetos / backups sin salir a Internet', icon: HardDrive, status: 'Active' },
];

interface SecurityRule {
  id: string;
  sg: string;
  type: 'Inbound' | 'Outbound';
  protocol: string;
  port: string;
  source: string;
  purpose: string;
  status: 'Permitido' | 'Revisión';
}

const SECURITY_RULES: SecurityRule[] = [
  { id: 'r1', sg: 'sg-01ab982e01 (ALB)', type: 'Inbound', protocol: 'TCP', port: '443 (HTTPS)', source: '0.0.0.0/0', purpose: 'Ingreso público de clientes', status: 'Permitido' },
  { id: 'r2', sg: 'sg-0834cfa72 (App)', type: 'Inbound', protocol: 'TCP', port: '8080 (API)', source: 'sg-01ab982e01 (ALB)', purpose: 'Tráfico balanceado hacia workers', status: 'Permitido' },
  { id: 'r3', sg: 'sg-09bb3310f (DB)', type: 'Inbound', protocol: 'TCP', port: '5432 (PostgreSQL)', source: 'sg-0834cfa72 (App)', purpose: 'Acceso exclusivo desde app tier', status: 'Permitido' },
  { id: 'r4', sg: 'sg-0834cfa72 (App)', type: 'Outbound', protocol: 'TCP', port: '443 (HTTPS)', source: '0.0.0.0/0', purpose: 'Descarga de paquetes y llamadas a AWS API', status: 'Permitido' },
  { id: 'r5', sg: 'sg-staging-01', type: 'Inbound', protocol: 'TCP', port: '8080 (API)', source: '0.0.0.0/0', purpose: 'Regla heredada de staging sin restringir', status: 'Revisión' },
];

export const NetworkView: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('vpc');
  const [selectedResource, setSelectedResource] = useState<SubnetResource>(PUBLIC_RESOURCES[0]);
  const [ruleSearch, setRuleSearch] = useState('');

  const activeNode = FLOW_NODES.find((n) => n.id === activeNodeId) ?? FLOW_NODES[0];

  const filteredRules = useMemo(
    () =>
      SECURITY_RULES.filter((r) => {
        const q = ruleSearch.toLowerCase();
        return (
          r.sg.toLowerCase().includes(q) ||
          r.purpose.toLowerCase().includes(q) ||
          r.port.toLowerCase().includes(q)
        );
      }),
    [ruleSearch]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Módulo 6 · Arquitectura de Red"
        title="Topología de Red y Flujo de Tráfico VPC"
        description="Representación interactiva de la conectividad perimetral, subredes y componentes internos de la infraestructura AWS."
        badge={{ label: 'VPC 100% Online', tone: 'security' }}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MiniStat label="VPC Principal" value="10.0.0.0/16" icon={NetworkIcon} footnote="65,536 IPs disponibles" />
        <MiniStat label="Route 53 Checks" value="100%" icon={Route} tone="security" footnote="12/12 endpoints saludables" />
        <MiniStat label="CDN Cache Hit" value="89.4%" icon={ShieldCheck} tone="primary" footnote="+2.1% hoy" />
        <MiniStat label="VPC Flow Logs" value="Activo" icon={Activity} tone="neutral" footnote="Sync con CloudWatch" />
      </div>

      {/* Flujo de tráfico interactivo */}
      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-textMain">Flujo de Tráfico Perimetral</h2>
          <p className="text-xs text-textSec mt-0.5">
            Selecciona un nodo para inspeccionar su estado en tiempo real.
          </p>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex items-center gap-2 min-w-[820px]">
            {FLOW_NODES.map((node, idx) => {
              const Icon = node.icon;
              const isActive = node.id === activeNodeId;
              return (
                <React.Fragment key={node.id}>
                  <button
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    className={`flex-1 flex flex-col items-center gap-1.5 p-4 rounded-xl border text-center transition-all ${isActive
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-bgMain border-borders hover:border-primary/40'
                      }`}
                  >
                    <Icon className={isActive ? 'text-primary' : 'text-textSec'} size={22} />
                    <span className="text-xs font-bold text-textMain">{node.name}</span>
                    <span className="text-[10px] text-textSec">{node.subtitle}</span>
                  </button>
                  {idx < FLOW_NODES.length - 1 && (
                    <ArrowRight className="text-borders shrink-0" size={18} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-bgMain border border-borders animate-fade-in" key={activeNode.id}>
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <activeNode.icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-textMain">{activeNode.name}</p>
            <p className="text-xs text-textSec mt-0.5">{activeNode.detail}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-textSec uppercase font-semibold block">{activeNode.metricLabel}</span>
            <span className="text-sm font-bold text-primary">{activeNode.metricValue}</span>
          </div>
        </div>
      </div>

      {/* Segmentación de subredes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-textMain">Segmentación Interna de VPC</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-security uppercase tracking-wide">
                  Subred Pública · 10.0.1.0/24
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-security border border-emerald-200">
                  Acceso público
                </span>
              </div>
              {PUBLIC_RESOURCES.map((res) => {
                const Icon = res.icon;
                const isSelected = selectedResource.id === res.id;
                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setSelectedResource(res)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${isSelected ? 'bg-primary/10 border-primary' : 'bg-bgMain border-borders hover:border-primary/40'
                      }`}
                  >
                    <Icon className="text-primary shrink-0" size={18} />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-textMain block truncate">{res.name}</span>
                      <span className="text-[10px] text-textSec block truncate">{res.subtitle}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-alerts uppercase tracking-wide">
                  Subred Privada · 10.0.2.0/24
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-alerts border border-red-200">
                  Sin IP pública
                </span>
              </div>
              {PRIVATE_RESOURCES.map((res) => {
                const Icon = res.icon;
                const isSelected = selectedResource.id === res.id;
                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setSelectedResource(res)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${isSelected ? 'bg-primary/10 border-primary' : 'bg-bgMain border-borders hover:border-primary/40'
                      }`}
                  >
                    <Icon className="text-primary shrink-0" size={18} />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-textMain block truncate">{res.name}</span>
                      <span className="text-[10px] text-textSec block truncate">{res.subtitle}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-borders">
            <Lock className="text-costs shrink-0" size={16} />
            <span className="text-[11px] text-textSec">
              <strong className="text-textMain">IAM</strong> — roles y políticas para EC2, RDS, S3 y CloudFront (sin
              claves embebidas en código)
            </span>
          </div>
        </div>

        {/* Panel de detalle del recurso seleccionado */}
        <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-3 h-fit" key={selectedResource.id}>
          <span className="text-[11px] font-bold text-primary uppercase tracking-wide">Recurso Seleccionado</span>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-primary">
              <selectedResource.icon size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-textMain">{selectedResource.name}</h3>
              <span className="text-xs text-textSec">{selectedResource.subtitle}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-bgMain border border-borders">
            <span className="text-xs font-semibold text-textSec">Estado</span>
            <span className="text-xs font-bold text-security">
              ● {selectedResource.status === 'Active' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-[11px] text-textSec leading-relaxed">
            Haz clic en cualquier recurso de la izquierda para actualizar este panel con su información
            de red simulada.
          </p>
        </div>
      </div>

      {/* Tabla de Security Groups con filtro funcional */}
      <div className="bg-cards border border-borders rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-textMain">Reglas de Security Groups</h2>
            <p className="text-xs text-textSec mt-0.5">
              Políticas activas de control Inbound/Outbound por grupo de seguridad.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-textSec" size={16} />
            <input
              type="text"
              value={ruleSearch}
              onChange={(e) => setRuleSearch(e.target.value)}
              placeholder="Buscar por SG, puerto o propósito..."
              className="w-full pl-9 pr-3 py-2 bg-bgMain border border-borders rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-textMain"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[720px]">
            <thead>
              <tr className="text-left text-textSec border-b border-borders">
                <th className="py-2 pr-3 font-semibold">Security Group</th>
                <th className="py-2 pr-3 font-semibold">Tipo</th>
                <th className="py-2 pr-3 font-semibold">Puerto</th>
                <th className="py-2 pr-3 font-semibold">Origen/Destino</th>
                <th className="py-2 pr-3 font-semibold">Propósito</th>
                <th className="py-2 pr-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="border-b border-borders last:border-0">
                  <td className="py-2.5 pr-3 font-semibold text-textMain whitespace-nowrap">{rule.sg}</td>
                  <td className="py-2.5 pr-3 text-textSec">{rule.type}</td>
                  <td className="py-2.5 pr-3">
                    <span className="px-2 py-0.5 rounded-md bg-bgMain border border-borders text-textMain font-medium whitespace-nowrap">
                      {rule.protocol} {rule.port}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-textSec whitespace-nowrap">{rule.source}</td>
                  <td className="py-2.5 pr-3 text-textSec">{rule.purpose}</td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${rule.status === 'Permitido'
                          ? 'bg-emerald-50 text-security border-emerald-200'
                          : 'bg-amber-50 text-costs border-amber-200'
                        }`}
                    >
                      {rule.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRules.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-textSec">
                    Sin coincidencias para "{ruleSearch}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};