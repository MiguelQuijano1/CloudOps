import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_REGIONS, INITIAL_SERVICES, MOCK_SECURITY_CHECKS } from '../data/awsServices';
import type { RegionInfo, AWSService, SecurityItem, CloudPlan, CostItem } from '../types';

const STORAGE_KEYS = {
    regions: 'cloudops_regions_v2',
    services: 'cloudops_services_v2',
    security: 'cloudops_security_v2',
    plans: 'cloudops_plans_v2',
    costs: 'cloudops_costs_v2',
} as const;

/** Costo estimado por hora asignado a cada servicio AWS al generarse desde una planificación. */
const SERVICE_HOURLY_COST: Record<string, number> = {
    EC2: 0.0416,
    S3: 0.023,
    RDS: 0.068,
    IAM: 0,
    VPC: 0,
    'Route 53': 0.5,
    CloudFront: 0.085,
    Lambda: 0.0000166,
    DynamoDB: 0.02,
    'Elastic Load Balancing': 0.0225,
    CloudWatch: 0.01,
    KMS: 0.003,
    SNS: 0.005,
};

/** Lee un arreglo persistido en localStorage; si no existe o está corrupto, usa el valor por defecto. */
function loadFromStorage<T>(key: string, fallback: T[]): T[] {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T[]) : fallback;
    } catch {
        return fallback;
    }
}

interface CloudDataContextValue {
    regions: RegionInfo[];
    services: AWSService[];
    securityChecks: SecurityItem[];
    /** Simula un cambio de estado de una región (ej. incidente / recuperación) y lo persiste en local. */
    updateRegionStatus: (id: string, status: RegionInfo['status']) => void;
    /** Agrega una región/servidor nuevo al sistema simulado. */
    addRegion: (region: RegionInfo) => void;
    addService: (service: AWSService) => void;
    updateServiceStatus: (id: string, status: AWSService['status']) => void;
    /** Borra los datos guardados localmente y vuelve a los datos base de la demo. */
    resetToDefaults: () => void;
    lastSavedAt: string | null;
    plans: CloudPlan[];
    /** Crea una nueva planificación y genera automáticamente sus estimaciones de costo en el módulo de Costos. */
    addPlan: (plan: Omit<CloudPlan, 'id' | 'createdAt'>) => void;
    costs: CostItem[];
    addCost: (cost: Omit<CostItem, 'id'>) => void;
    deleteCost: (id: string) => void;
}

const CloudDataContext = createContext<CloudDataContextValue | null>(null);

export const CloudDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [regions, setRegions] = useState<RegionInfo[]>(() => loadFromStorage(STORAGE_KEYS.regions, MOCK_REGIONS));
    const [services, setServices] = useState<AWSService[]>(() => loadFromStorage(STORAGE_KEYS.services, INITIAL_SERVICES));
    const [securityChecks, setSecurityChecks] = useState<SecurityItem[]>(() =>
        loadFromStorage(STORAGE_KEYS.security, MOCK_SECURITY_CHECKS)
    );
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
    const [plans, setPlans] = useState<CloudPlan[]>(() => loadFromStorage(STORAGE_KEYS.plans, []));
    const [costs, setCosts] = useState<CostItem[]>(() => loadFromStorage(STORAGE_KEYS.costs, []));

    // Persistencia automática en localStorage cada vez que cambian los datos simulados.
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.regions, JSON.stringify(regions));
            localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
            localStorage.setItem(STORAGE_KEYS.security, JSON.stringify(securityChecks));
            localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(plans));
            localStorage.setItem(STORAGE_KEYS.costs, JSON.stringify(costs));
            setLastSavedAt(new Date().toISOString());
        } catch {
            // localStorage no disponible (modo privado, cuota excedida, etc.) — la app sigue funcionando en memoria.
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [regions, services, securityChecks, plans, costs]);

    const updateRegionStatus = useCallback((id: string, status: RegionInfo['status']) => {
        setRegions((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }, []);

    const addRegion = useCallback((region: RegionInfo) => {
        setRegions((prev) => (prev.some((r) => r.id === region.id) ? prev : [...prev, region]));
    }, []);

    const addService = useCallback((service: AWSService) => {
        setServices((prev) => (prev.some((s) => s.id === service.id) ? prev : [...prev, service]));
    }, []);

    const updateServiceStatus = useCallback((id: string, status: AWSService['status']) => {
        setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    }, []);

    const resetToDefaults = useCallback(() => {
        setRegions(MOCK_REGIONS);
        setServices(INITIAL_SERVICES);
        setSecurityChecks(MOCK_SECURITY_CHECKS);
    }, []);

    const addCost = useCallback((cost: Omit<CostItem, 'id'>) => {
        const item: CostItem = { ...cost, id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
        setCosts((prev) => [...prev, item]);
    }, []);

    const deleteCost = useCallback((id: string) => {
        setCosts((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const addPlan = useCallback((plan: Omit<CloudPlan, 'id' | 'createdAt'>) => {
        const newPlan: CloudPlan = {
            ...plan,
            id: Date.now().toString(),
            createdAt: new Date().toLocaleDateString(),
        };
        setPlans((prev) => [...prev, newPlan]);

        // Genera automáticamente las estimaciones de costo de esta planificación
        // para que aparezcan reflejadas en el módulo de Costos y Economía.
        const generatedCosts: CostItem[] = plan.selectedServices.map((serviceName, idx) => {
            const hourly = SERVICE_HOURLY_COST[serviceName] ?? 0.02;
            const hoursPerMonth = 730;
            const monthlyCost = Math.round(hourly * hoursPerMonth * 100) / 100;
            return {
                id: `c-${newPlan.id}-${idx}`,
                serviceName: `${serviceName} (${newPlan.solutionName})`,
                quantity: 1,
                hoursPerMonth,
                costPerHour: hourly,
                monthlyCost,
                annualCost: Math.round(monthlyCost * 12 * 100) / 100,
            };
        });
        setCosts((prev) => [...prev, ...generatedCosts]);
    }, []);

    return (
        <CloudDataContext.Provider
            value={{
                regions,
                services,
                securityChecks,
                updateRegionStatus,
                addRegion,
                addService,
                updateServiceStatus,
                resetToDefaults,
                lastSavedAt,
                plans,
                addPlan,
                costs,
                addCost,
                deleteCost,
            }}
        >
            {children}
        </CloudDataContext.Provider>
    );
};

export const useCloudData = (): CloudDataContextValue => {
    const ctx = useContext(CloudDataContext);
    if (!ctx) throw new Error('useCloudData must be used within CloudDataProvider');
    return ctx;
};