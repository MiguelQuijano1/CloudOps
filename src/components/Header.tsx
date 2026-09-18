import React from 'react';
import { Bell, Server, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-cards border-b border-borders h-16 px-4 sm:px-8 flex items-center justify-between shadow-xs sticky top-0 z-20">
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

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="relative p-2 rounded-xl text-textSec hover:bg-bgMain transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alerts rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-borders hidden sm:block"></div>

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