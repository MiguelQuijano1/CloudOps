import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_REGIONS, INITIAL_SERVICES, MOCK_SECURITY_CHECKS } from '../data/awsServices';
import type { RegionInfo, AWSService, SecurityItem } from '../types';

const STORAGE_KEYS = {
    regions: 'cloudops_regions_v2',
    services: 'cloudops_services_v2',
    security: 'cloudops_security_v2',
} as const;

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
}

const CloudDataContext = createContext<CloudDataContextValue | null>(null);

export const CloudDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [regions, setRegions] = useState<RegionInfo[]>(() => loadFromStorage(STORAGE_KEYS.regions, MOCK_REGIONS));
    const [services, setServices] = useState<AWSService[]>(() => loadFromStorage(STORAGE_KEYS.services, INITIAL_SERVICES));
    const [securityChecks, setSecurityChecks] = useState<SecurityItem[]>(() =>
        loadFromStorage(STORAGE_KEYS.security, MOCK_SECURITY_CHECKS)
    );
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

    // Persistencia automática en localStorage cada vez que cambian los datos simulados.
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.regions, JSON.stringify(regions));
            localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
            localStorage.setItem(STORAGE_KEYS.security, JSON.stringify(securityChecks));
            setLastSavedAt(new Date().toISOString());
        } catch {
            // localStorage no disponible (modo privado, cuota excedida, etc.) — la app sigue funcionando en memoria.
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [regions, services, securityChecks]);

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