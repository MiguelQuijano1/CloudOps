import type { AWSService, RegionInfo, SecurityItem } from '../types'; // o la ruta donde estén definidos

export const INITIAL_SERVICES: AWSService[] = [
  { id: '1', name: 'EC2', category: 'Compute', description: 'Capacidad de cómputo escalable en la nube.', mainFunction: 'Servidores de aplicaciones y cómputo backend', status: 'Active', monthlyCost: 180, spec: { instanceType: 't3.medium', vCPU: 2, ramGB: 4 } },
  { id: '2', name: 'S3', category: 'Storage', description: 'Almacenamiento de objetos diseñado para almacenar y recuperar cualquier cantidad de datos.', mainFunction: 'Respaldo, almacenamiento de objetos y static hosting', status: 'Active', monthlyCost: 45, spec: { storageGB: 500, engine: 'S3 Standard' } },
  { id: '3', name: 'RDS', category: 'Database', description: 'Base de datos relacional administrada para MySQL, PostgreSQL, Oracle, SQL Server.', mainFunction: 'Persistencia de datos transaccionales', status: 'Active', monthlyCost: 220, spec: { instanceType: 'db.t3.small', vCPU: 2, ramGB: 2, engine: 'PostgreSQL 16.3', storageGB: 100, iops: 3000 } },
  { id: '4', name: 'IAM', category: 'Security', description: 'Administración de acceso a los servicios y recursos de AWS de forma segura.', mainFunction: 'Control de accesos, roles y políticas de seguridad', status: 'Active', monthlyCost: 0 },
  { id: '5', name: 'VPC', category: 'Networking', description: 'Red virtual aislada para aprovisionar recursos en la nube.', mainFunction: 'Aislamiento de red, subredes y tablas de ruteo', status: 'Active', monthlyCost: 0, spec: { engine: 'CIDR 10.0.0.0/16' } },
  { id: '6', name: 'Route 53', category: 'Networking', description: 'Servicio de DNS web escalable y de alta disponibilidad.', mainFunction: 'Administración de DNS y chequeos de salud', status: 'Active', monthlyCost: 15, spec: { engine: 'Routing Policy: Latency-based' } },
  { id: '7', name: 'CloudFront', category: 'Networking', description: 'Red de distribución de contenido (CDN) rápida para entregar datos de forma segura.', mainFunction: 'Caché de contenido estático/dinámico y aceleración', status: 'Active', monthlyCost: 65, spec: { engine: 'Edge Locations: 450+' } },
  { id: '8', name: 'Lambda', category: 'Compute', description: 'Ejecución de código sin aprovisionar ni administrar servidores.', mainFunction: 'Procesamiento de eventos y automatización serverless', status: 'Active', monthlyCost: 18, spec: { engine: 'Runtime: Node.js 20.x' } },
  { id: '9', name: 'DynamoDB', category: 'Database', description: 'Base de datos NoSQL de clave-valor totalmente administrada.', mainFunction: 'Persistencia de baja latencia para sesiones y catálogos', status: 'Active', monthlyCost: 32, spec: { engine: 'On-Demand Capacity' } },
  { id: '10', name: 'Elastic Load Balancing', category: 'Networking', description: 'Distribución automática del tráfico entrante entre múltiples destinos.', mainFunction: 'Balanceo de carga de aplicaciones (ALB) y capa de red', status: 'Active', monthlyCost: 22, spec: { engine: 'Application Load Balancer' } },
  { id: '11', name: 'CloudWatch', category: 'Security', description: 'Monitoreo de métricas, logs y alarmas de toda la infraestructura.', mainFunction: 'Observabilidad, alertas y trazabilidad operativa', status: 'Active', monthlyCost: 12, spec: { engine: 'Logs + Metrics + Alarms' } },
  { id: '12', name: 'KMS', category: 'Security', description: 'Administración centralizada de llaves de cifrado.', mainFunction: 'Cifrado de datos en reposo para S3, RDS y EBS', status: 'Active', monthlyCost: 3, spec: { engine: 'Customer Managed Keys' } },
  { id: '13', name: 'SNS', category: 'Networking', description: 'Mensajería pub/sub totalmente administrada.', mainFunction: 'Notificaciones y desacoplamiento entre microservicios', status: 'Planned', monthlyCost: 5, spec: { engine: 'Standard Topics' } },
];

export const MOCK_REGIONS: RegionInfo[] = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', location: 'EE.UU. Este', deployedServicesCount: 13, status: 'Operational', lat: 37.5, lon: -78.6, isHub: true },
  { id: 'us-west-2', name: 'US West (Oregon)', location: 'EE.UU. Oeste', deployedServicesCount: 6, status: 'Operational', lat: 45.8, lon: -119.7 },
  { id: 'sa-east-1', name: 'South America (São Paulo)', location: 'Sudamérica', deployedServicesCount: 2, status: 'Operational', lat: -23.5, lon: -46.6 },
  { id: 'eu-west-1', name: 'EU (Ireland)', location: 'Europa Oeste', deployedServicesCount: 3, status: 'Maintenance', lat: 53.3, lon: -8.0 },
  { id: 'eu-central-1', name: 'EU (Frankfurt)', location: 'Europa Central', deployedServicesCount: 6, status: 'Operational', lat: 50.1, lon: 8.7 },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', location: 'Asia Pacífico', deployedServicesCount: 5, status: 'Operational', lat: 1.35, lon: 103.8 },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', location: 'Asia Oriental', deployedServicesCount: 4, status: 'Operational', lat: 35.7, lon: 139.7 },
  { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', location: 'Asia del Sur', deployedServicesCount: 3, status: 'Degraded', lat: 19.1, lon: 72.9 },
];

export const MOCK_SECURITY_CHECKS: SecurityItem[] = [
  { id: 'sec-1', category: 'IAM', title: 'Autenticación MFA en Cuenta Root', status: 'correct', description: 'MFA activo y verificado en la cuenta principal.' },
  { id: 'sec-2', category: 'IAM', title: 'Políticas de contraseñas de usuarios IAM', status: 'correct', description: 'Longitud mínima de 12 caracteres y rotación activa.' },
  { id: 'sec-3', category: 'Data Protection', title: 'Encriptación de buckets S3 en reposo', status: 'review', description: '1 de 4 buckets carece de encriptación predeterminada activa.' },
  { id: 'sec-4', category: 'Account Protection', title: 'Registro de auditoría AWS CloudTrail', status: 'correct', description: 'CloudTrail activo y enviando logs a S3 seguro.' },
  { id: 'sec-5', category: 'Compliance', title: 'Acceso público a bases de datos RDS', status: 'issue', description: 'Instancia RDS pública expuesta en la subred.' },
];