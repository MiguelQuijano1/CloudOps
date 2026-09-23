import React, { useState, useRef } from 'react';
import { Bell, Server, Menu, Moon, Sun, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationsPanel } from './NotificationsPanel';
import { MOCK_REGIONS } from '../data/awsServices';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme, selectedRegion, setSelectedRegion, unreadCount } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  return (
    <header className="bg-cards/90 backdrop-blur-xl border-b border-borders h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-250">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-textSec hover:bg-bgMain transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-textSec text-xs font-semibold uppercase tracking-wider">
          <Server size={16} className="text-primary" />
          <span>Entorno: AWS Production (Simulado)</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-1.5 pl-3 pr-3.5 py-1.5 rounded-full bg-security/10 border border-security/20">
          <span className="w-1.5 h-1.5 rounded-full bg-security animate-pulse" />
          <span className="text-xs font-bold text-security">Operativo</span>
        </div>
        <div className="relative hidden md:flex items-center">
          <Globe size={16} className="absolute left-2.5 text-textSec pointer-events-none" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-bgMain border border-borders rounded-xl text-xs font-semibold text-textMain focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer min-w-[160px]"
            aria-label="Seleccionar región"
          >
            {MOCK_REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-textSec hover:bg-bgMain transition-colors"
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 rounded-xl text-textSec hover:bg-bgMain transition-colors"
            aria-label="Notificaciones"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-3.5 px-1 bg-alerts text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <div className="h-6 w-px bg-borders hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
            MQ
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-textMain leading-tight">Miguel Quijano</p>
            <p className="text-[11px] text-textSec">Cloud Architect</p>
          </div>
        </div>
      </div>
    </header>
  );
};