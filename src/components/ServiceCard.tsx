import React from 'react';
import { Server, ChevronRight, Activity } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { AWSService } from '../types';

interface ServiceCardProps {
  service: AWSService;
  onClick?: () => void;
}

const ARN_MAP: Record<string, string> = {
  EC2: 'AWS::EC2::Instance',
  S3: 'AWS::S3::Bucket',
  RDS: 'AWS::RDS::DBInstance',
  IAM: 'AWS::IAM::Role',
  VPC: 'AWS::EC2::VPC',
  'Route 53': 'AWS::Route53::HostedZone',
  CloudFront: 'AWS::CloudFront::Distribution',
};

const METRIC_MAP: Record<string, string> = {
  EC2: 'CPU Promedio: 28%',
  S3: 'Durabilidad: 99.999999999%',
  RDS: '1 Primaria + 1 Standby',
  IAM: '100% MFA Enforced',
  VPC: '4 Subnets / 2 NAT GW',
  'Route 53': '12 Registros DNS',
  CloudFront: 'Cache Hit Rate: 94.2%',
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="h-full bg-cards border border-borders rounded-2xl p-5 shadow-xs flex flex-col text-left w-full card-hover animate-fade-in group"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center shrink-0">
          <Server size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-textMain text-base leading-tight truncate">{service.name}</h3>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            {service.category}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        <StatusBadge status={service.status} />
      </div>
    </div>

    <code className="mt-3 text-[10px] text-textSec bg-bgMain border border-borders rounded-md px-2 py-1 block truncate">
      {ARN_MAP[service.name] ?? 'AWS::Resource'}
    </code>

    <p className="text-xs text-textSec leading-relaxed mt-3 line-clamp-2 min-h-[32px]">
      {service.description}
    </p>

    <div className="mt-3 p-2.5 rounded-xl bg-bgMain border border-borders">
      <span className="text-[10px] text-textSec font-semibold uppercase block mb-0.5">
        Función Principal
      </span>
      <p className="text-xs text-textMain font-medium line-clamp-2 min-h-[32px]">
        {service.mainFunction}
      </p>
    </div>

    <div className="flex items-center gap-1.5 mt-3 text-[11px] text-textSec">
      <Activity size={12} className="text-security shrink-0" />
      <span className="truncate">{METRIC_MAP[service.name] ?? 'Métrica no disponible'}</span>
    </div>

    <div className="flex items-center justify-between pt-3 mt-auto border-t border-borders">
      {service.monthlyCost > 0 ? (
        <p className="text-xs text-costs font-bold">${service.monthlyCost}/mes</p>
      ) : (
        <p className="text-xs text-textSec">Incluido</p>
      )}
      <span className="text-[11px] text-primary font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
        Inspeccionar <ChevronRight size={14} />
      </span>
    </div>
  </button>
);