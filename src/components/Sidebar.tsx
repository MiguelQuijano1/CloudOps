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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-white min-h-screen flex flex-col border-r border-slate-800 shrink-0
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-blue-500 rounded-xl text-white shadow-lg shadow-blue-900/40">
              <Cloud size={22} />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide text-white leading-none">CloudOps</h1>
              <span className="text-[11px] text-slate-400">Dashboard v1.0</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
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
                  `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-primary text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
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