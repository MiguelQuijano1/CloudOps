import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ToastItem {
  id: string;
  title: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => void;
  clearNotifications: () => void;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Chequeo de seguridad',
    message: '1 bucket S3 sin encriptación predeterminada. Revisar módulo Seguridad.',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Costo mensual actualizado',
    message: 'El costo estimado del mes superó los $200. Revisa Costos y Economía.',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n3',
    title: 'Región en mantenimiento',
    message: 'eu-west-1 (Ireland) está en ventana de mantenimiento programada.',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('cloudops_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [selectedRegion, setSelectedRegionState] = useState<string>(() => {
    return localStorage.getItem('cloudops_region') || 'us-east-1';
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cloudops_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_NOTIFICATIONS;
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cloudops_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cloudops_region', selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    localStorage.setItem('cloudops_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const setSelectedRegion = useCallback((region: string) => {
    setSelectedRegionState(region);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (n: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => {
      const item: NotificationItem = {
        ...n,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [item, ...prev]);

      const toastId = `toast-${item.id}`;
      setToasts((prev) => [...prev, { id: toastId, title: item.title, type: item.type }]);
      window.setTimeout(() => dismissToast(toastId), 4000);
    },
    [dismissToast]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        selectedRegion,
        setSelectedRegion,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotifications,
        toasts,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};