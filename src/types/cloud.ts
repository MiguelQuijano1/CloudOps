export interface AWSService {
  id: string;
  name: string;
  category: 'Compute' | 'Storage' | 'Database' | 'Security' | 'Networking';
  description: string;
  mainFunction: string;
  status: 'Active' | 'Planned' | 'Inactive';
  monthlyCost: number;
  /** Ficha técnica real del recurso (tipo de instancia, engine, capacidad). */
  spec?: {
    instanceType?: string;
    vCPU?: number;
    ramGB?: number;
    engine?: string;
    storageGB?: number;
    iops?: number;
  };
}

export interface CloudPlan {
  id: string;
  solutionName: string;
  appType: string;
  description: string;
  region: string;
  estimatedUsers: number;
  availability: string;
  selectedServices: string[];
  migrationGoal: string;
  createdAt: string;
}

export interface RegionInfo {
  id: string;
  name: string;
  location: string;
  deployedServicesCount: number;
  status: 'Operational' | 'Degraded' | 'Maintenance';
  /** Coordenadas geográficas aproximadas del datacenter, usadas por el mapa global. */
  lat: number;
  lon: number;
  /** true si esta región actúa como hub primario (origen de las líneas de backbone). */
  isHub?: boolean;
}

export interface SecurityItem {
  id: string;
  category: 'IAM' | 'Data Protection' | 'Compliance' | 'Account Protection';
  title: string;
  status: 'correct' | 'review' | 'issue';
  description: string;
}

export interface CostItem {
  id: string;
  serviceName: string;
  quantity: number;
  hoursPerMonth: number;
  costPerHour: number;
  monthlyCost: number;
  annualCost: number;
}