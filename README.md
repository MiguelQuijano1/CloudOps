# CloudOps Dashboard

Sistema web de planificación y visualización de una solución Cloud, desarrollado como práctica
integrativa de **Cloud Foundations (Semanas 5 y 6)**. Simula un panel profesional que representa
planificación, costos, infraestructura global, seguridad e IAM, y arquitectura de red basada en
servicios de AWS, usando datos simulados (mock).

## Descripción

La aplicación permite a una empresa de desarrollo visualizar y analizar, antes de una
implementación real en AWS, los componentes fundamentales de una propuesta de solución Cloud:
servicios utilizados, costos estimados, regiones, seguridad y arquitectura de red.

## Tecnologías

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router (navegación entre módulos)
- Lucide React (iconografía)

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Funcionalidades

- **Dashboard**: indicadores clave (servicios activos, región, costo mensual/anual, estado de
  seguridad), gráfico de distribución de costo por servicio y resumen de chequeos de seguridad.
- **Planificación Cloud**: formulario para registrar una propuesta de solución Cloud (nombre, tipo
  de app, región, usuarios estimados, disponibilidad, servicios, objetivo de migración), con
  persistencia en `localStorage` y listado de propuestas registradas.
- **Costos y Economía Cloud**: calculadora de costos simulada, gráfico de dona con la distribución
  del gasto por servicio, y tabla/listado de estimaciones.
- **Infraestructura Global**: tarjetas de regiones AWS con ubicación, servicios desplegados y
  estado.
- **Seguridad e IAM**: modelo de responsabilidad compartida (cliente vs. AWS) y panel de auditoría
  con indicadores correcto / requiere revisión / problema.
- **Arquitectura de Red**: representación visual interactiva del flujo INTERNET → Route 53 →
  CloudFront → VPC → EC2/RDS, con subredes pública y privada.
- **Servicios AWS**: catálogo con buscador y filtro por categoría (EC2, S3, RDS, IAM, VPC, Route 53,
  CloudFront).
- Diseño responsive con sidebar, header y sistema de colores consistente.

## Componentes reutilizables

`Sidebar`, `Header`, `StatCard`, `ServiceCard`, `CostCard`, `SecurityCard`, `RegionCard`,
`StatusBadge`, `BarChart`, `DonutChart`.

## Estructura del proyecto

```
src/
├── components/
├── pages/
├── data/
├── types/
├── App.tsx
└── main.tsx
```

## Capturas

> ⚠️ Pendiente: reemplazar esta sección con las capturas reales antes de entregar.
> Ejecuta `npm run dev`, navega a cada ruta y pega aquí las imágenes (arrastra el archivo
> en GitHub/editor Markdown o usa `![texto](ruta/imagen.png)`).

- Dashboard — `/dashboard`
- Planificación Cloud — `/planning`
- Costos y Economía Cloud — `/costs`
- Infraestructura Global — `/infrastructure`
- Seguridad e IAM — `/security`
- Arquitectura de Red — `/network`
- Servicios AWS — `/services`
- Vista responsive (móvil, reducir la ventana o usar DevTools)

## Autor

Miguel Quijano — Cloud Architect (práctica integrativa Cloud Foundations, semanas 5–6).