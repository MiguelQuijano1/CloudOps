import React from 'react';
import { X, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const typeIcon = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const typeColor = {
  info: 'text-primary bg-blue-50',
  success: 'text-security bg-emerald-50',
  warning: 'text-costs bg-amber-50',
  error: 'text-alerts bg-red-50',
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useApp();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-cards border border-borders rounded-2xl shadow-xs z-50 animate-slide-down overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-borders">
          <h3 className="text-sm font-bold text-textMain">Notificaciones</h3>
          <div className="flex items-center gap-1">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 rounded-lg text-textSec hover:bg-bgMain hover:text-primary transition-colors"
                title="Marcar todas como leídas"
              >
                <CheckCheck size={16} />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="p-1.5 rounded-lg text-textSec hover:bg-bgMain hover:text-alerts transition-colors"
                title="Limpiar todas"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-textSec hover:bg-bgMain transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-textSec text-sm">
              No hay notificaciones
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = typeIcon[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`w-full text-left px-4 py-3 border-b border-borders last:border-0 hover:bg-bgMain transition-colors flex gap-3 ${
                    !n.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${typeColor[n.type]}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-textMain truncate">{n.title}</p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-textSec mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-textSec/70 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};