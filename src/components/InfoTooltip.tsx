import React from 'react';

interface InfoTooltipProps {
  /** Texto corto que explica qué es y para qué sirve */
  text: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Envuelve cualquier elemento y muestra un pequeño tooltip flotante
 * al pasar el mouse (o al enfocar con teclado), explicando qué es
 * y para qué sirve ese elemento.
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, children, className = '' }) => (
  <span className={`group/tooltip relative inline-flex outline-none ${className}`} tabIndex={0}>
    {children}
    <span
      role="tooltip"
      className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 w-max max-w-[220px] -translate-x-1/2 scale-95 rounded-lg bg-sidebar px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-white opacity-0 shadow-lg transition-all duration-150 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 group-focus/tooltip:scale-100 group-focus/tooltip:opacity-100"
    >
      {text}
      <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-sidebar" />
    </span>
  </span>
);