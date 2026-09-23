import type { AWSService, RegionInfo, SecurityItem, CostItem } from '../types'; // o la ruta donde estén definidos

export const INITIAL_SERVICES: AWSService[] = [
  { id: '1', name: 'EC2', category: 'Compute', description: 'Capacidad de cómputo escalable en la nube.', mainFunction: 'Servidores de aplicaciones y cómputo backend', status: 'Active', monthlyCost: 180, spec: { instanceType: 't3.medium', vCPU: 2, ramGB: 4 } },
  { id: '2', name: 'S3', category: 'Storage', description: 'Almacenamiento de objetos diseñado para almacenar y recuperar cualquier cantidad de datos.', mainFunction: 'Respaldo, almacenamiento de objetos y static hosting', status: 'Active', monthlyCost: 45, spec: { storageGB: 500, engine: 'S3 Standard' } },
  { id: '3', name: 'RDS', category: 'Database', description: 'Base de datos relacional administrada para MySQL, PostgreSQL, Oracle, SQL Server.', mainFunction: 'Persistencia de datos transaccionales', status: 'Active', monthlyCost: 220, spec: { instanceType: 'db.t3.small', vCPU: 2, ramGB: 2, engine: 'PostgreSQL 16.3', storageGB: 100, iops: 3000 } },
  { id: '4', name: 'IAM', category: 'Security', description: 'Administración de acceso a los servicios y recursos de AWS de forma segura.', mainFunction: 'Control de accesos, roles y políticas de seguridad', status: 'Active', monthlyCost: 0 },
  { id: '5', name: 'VPC', category: 'Networking', description: 'Red virtual aislada para aprovisionar recursos en la nube.', mainFunction: 'Aislamiento de red, subredes y tablas de ruteo', status: 'Active', monthlyCost: 0, spec: { engine: 'CIDR 10.0.0.0/16' } },
  { id: '6', name: 'Route 53', category: 'Networking', description: 'Servicio de DNS web escalable y de alta disponibilidad.', mainFunction: 'Administración de DNS y chequeos de salud', status: 'Active', monthlyCost: 15, spec: { engine: 'Routing Policy: Latency-based' } },
  { id: '7', name: 'CloudFront', category: 'Networking', description: 'Red de distribución de contenido (CDN) rápida para entregar datos de forma segura.', mainFunction: 'Caché de contenido estático/dinámico y aceleración', status: 'Active', monthlyCost: 65, spec: { engine: 'Edge Locations: 450+' } },
];

export const MOCK_REGIONS: RegionInfo[] = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', location: 'EE.UU. Este', deployedServicesCount: 7, status: 'Operational', lat: 37.5, lon: -78.6, isHub: true },
  { id: 'us-west-2', name: 'US West (Oregon)', location: 'EE.UU. Oeste', deployedServicesCount: 4, status: 'Operational', lat: 45.8, lon: -119.7 },
  { id: 'sa-east-1', name: 'South America (São Paulo)', location: 'Sudamérica', deployedServicesCount: 2, status: 'Operational', lat: -23.5, lon: -46.6 },
  { id: 'eu-west-1', name: 'EU (Ireland)', location: 'Europa', deployedServicesCount: 3, status: 'Maintenance', lat: 53.3, lon: -8.0 },
];

export const MOCK_SECURITY_CHECKS: SecurityItem[] = [
  { id: 'sec-1', category: 'IAM', title: 'Autenticación MFA en Cuenta Root', status: 'correct', description: 'MFA activo y verificado en la cuenta principal.' },
  { id: 'sec-2', category: 'IAM', title: 'Políticas de contraseñas de usuarios IAM', status: 'correct', description: 'Longitud mínima de 12 caracteres y rotación activa.' },
  { id: 'sec-3', category: 'Data Protection', title: 'Encriptación de buckets S3 en reposo', status: 'review', description: '1 de 4 buckets carece de encriptación predeterminada activa.' },
  { id: 'sec-4', category: 'Account Protection', title: 'Registro de auditoría AWS CloudTrail', status: 'correct', description: 'CloudTrail activo y enviando logs a S3 seguro.' },
  { id: 'sec-5', category: 'Compliance', title: 'Acceso público a bases de datos RDS', status: 'issue', description: 'Instancia RDS pública expuesta en la subred.' },
];

export const INITIAL_COSTS: CostItem[] = [
  { id: 'c-1', serviceName: 'EC2 (t3.medium)', quantity: 2, hoursPerMonth: 730, costPerHour: 0.0416, monthlyCost: 60.74, annualCost: 728.88 },
  { id: 'c-2', serviceName: 'RDS PostgreSQL (db.t3.small)', quantity: 1, hoursPerMonth: 730, costPerHour: 0.0680, monthlyCost: 49.64, annualCost: 595.68 },
  { id: 'c-3', serviceName: 'S3 Standard Storage (500 GB)', quantity: 1, hoursPerMonth: 1, costPerHour: 11.50, monthlyCost: 11.50, annualCost: 138.00 },
  { id: 'c-4', serviceName: 'CloudFront CDN (1 TB Transfer)', quantity: 1, hoursPerMonth: 1, costPerHour: 85.00, monthlyCost: 85.00, annualCost: 1020.00 },
];