import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  DollarSign,
  Globe,
  ShieldCheck,
  Network,
  Boxes,
  Cloud,
  X,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/planning', label: 'Planificación Cloud', icon: ClipboardList },
  { path: '/costs', label: 'Costos y Economía', icon: DollarSign },
  { path: '/infrastructure', label: 'Infraestructura Global', icon: Globe },
  { path: '/security', label: 'Seguridad e IAM', icon: ShieldCheck },
  { path: '/network', label: 'Arquitectura de Red', icon: Network },
  { path: '/services', label: 'Servicios AWS', icon: Boxes },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay en móvil cuando el sidebar está abierto */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-white h-full flex flex-col shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.04)]
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
      >
        <div className="h-16 px-6 flex items-center gap-3 shrink-0">
          <div className="p-2 bg-primary rounded-xl text-white shrink-0">
            <Cloud size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold tracking-tight text-white leading-none truncate">CloudOps</h1>
            <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">Enterprise</span>
          </div>
          <button onClick={onClose} className="lg:hidden ml-auto text-slate-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                SLA Mensual
              </span>
              <span className="text-xs font-bold text-security">99.98%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-security rounded-full" style={{ width: '99.98%' }} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Cloud Foundations – Semanas 5 y 6
          </p>
        </div>
      </aside>
    </>
  );
};