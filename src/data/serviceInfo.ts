/**
 * Descripciones cortas de servicios y componentes AWS: qué son y para qué sirven.
 * Se usan en tooltips al pasar el mouse sobre gráficos, tarjetas y diagramas.
 */
export const SERVICE_INFO: Record<string, string> = {
  EC2: 'Servidores virtuales (Elastic Compute Cloud). Ejecutan tu código, apps o APIs bajo demanda.',
  S3: 'Almacenamiento de objetos (Simple Storage Service). Guarda archivos, backups e imágenes de forma duradera.',
  CloudFront: 'Red de distribución de contenido (CDN). Sirve contenido desde ubicaciones cercanas al usuario para reducir latencia.',
  Lambda: 'Cómputo sin servidor (serverless). Ejecuta funciones de código solo cuando se necesitan, sin administrar servidores.',
  DynamoDB: 'Base de datos NoSQL administrada. Almacena datos clave-valor con muy baja latencia a cualquier escala.',
  RDS: 'Base de datos relacional administrada (Relational Database Service). Motor SQL con backups y alta disponibilidad automáticos.',
  'RDS PostgreSQL': 'Base de datos relacional PostgreSQL administrada por AWS, con replicación Multi-AZ para alta disponibilidad.',
  VPC: 'Red virtual privada (Virtual Private Cloud). Aísla tus recursos en una red propia dentro de AWS.',
  'VPC Principal': 'Red virtual privada aislada donde viven tus subredes públicas y privadas.',
  IAM: 'Gestión de identidades y accesos. Controla quién puede hacer qué sobre tus recursos AWS.',
  ALB: 'Balanceador de carga de aplicaciones. Distribuye el tráfico HTTP/HTTPS entrante entre varios servidores.',
  'Application Load Balancer': 'Distribuye el tráfico HTTP/HTTPS entrante entre varias instancias para balancear la carga y dar tolerancia a fallos.',
  'NAT Gateway': 'Permite que recursos en subredes privadas salgan a Internet (ej. actualizaciones) sin exponerlos con una IP pública.',
  'Internet Gateway': 'Punto de entrada y salida de tráfico entre la VPC e Internet.',
  'Route 53': 'Servicio de DNS administrado. Resuelve nombres de dominio y enruta tráfico según latencia o salud del endpoint.',
  'S3 (vía endpoint VPC)': 'Acceso a S3 desde la subred privada sin salir a Internet, usando un endpoint de VPC.',
  'EC2 · Web / API': 'Instancias EC2 que exponen el frontend y la API, con Auto Scaling según demanda.',
  'EC2 · App / Workers': 'Instancias EC2 que ejecutan la lógica de negocio interna, sin acceso directo desde Internet.',
  CloudWatch: 'Monitoreo y observabilidad. Recolecta métricas, logs y alarmas de tus recursos AWS en tiempo real.',
  KMS: 'Gestión de llaves de cifrado (Key Management Service). Cifra datos en reposo de forma centralizada.',
  WAF: 'Firewall de aplicaciones web. Filtra tráfico malicioso (Layer 7) antes de que llegue a tu app.',
  Shield: 'Protección administrada contra ataques DDoS.',

  // Métricas CloudWatch
  CPUUtilization: 'Porcentaje de uso de CPU de tus instancias EC2. Un valor alto y sostenido puede indicar que necesitas escalar.',
  NetworkIn: 'Cantidad de datos entrantes por segundo hacia tus instancias EC2.',
  DatabaseConnections: 'Número de conexiones activas a tu base de datos RDS en este momento.',
  'TargetResponseTime p99': 'Tiempo de respuesta del percentil 99: el 99% de las peticiones responden más rápido que este valor.',
  RequestCount: 'Cantidad de solicitudes por minuto que recibe tu Application Load Balancer.',
  '5xxErrorRate': 'Porcentaje de respuestas con error de servidor (5xx). Un aumento indica problemas en el backend.',

  // Pilares Well-Architected
  'Excelencia Operacional': 'Qué tan bien monitoreas, automatizas y mejoras tus procesos operativos en la nube.',
  Seguridad: 'Protección de datos, sistemas y activos mediante control de acceso, cifrado y detección de amenazas.',
  Confiabilidad: 'Capacidad del sistema de recuperarse de fallas y satisfacer la demanda de forma consistente.',
  'Eficiencia de Rendimiento': 'Uso eficiente de recursos de cómputo para cumplir requisitos, incluso cuando cambia la demanda.',
  'Optimización de Costos': 'Evitar gasto innecesario y lograr el mejor retorno sobre lo que inviertes en la nube.',
  Sostenibilidad: 'Minimizar el impacto ambiental de tus cargas de trabajo en la nube.',

  // MiniStats de seguridad
  'Well-Architected Score': 'Puntaje global calculado sobre los controles de seguridad evaluados (aprobados / total).',
  'Cargas Protegidas': 'Porcentaje de cargas de trabajo en producción que tienen cifrado KMS habilitado.',
  'Estado IAM Root': 'Indica si la cuenta root (la más privilegiada) tiene autenticación multifactor (MFA) forzada.',
  'Alertas de Seguridad': 'Cantidad de hallazgos abiertos: controles críticos que fallaron o quedaron pendientes de revisión.',
};

/**
 * Busca la descripción de un servicio por coincidencia exacta o parcial (case-insensitive).
 * Si no encuentra nada, devuelve undefined.
 */
export function getServiceDescription(label: string): string | undefined {
  if (SERVICE_INFO[label]) return SERVICE_INFO[label];
  const lower = label.toLowerCase();
  const match = Object.keys(SERVICE_INFO).find(
    (key) => lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)
  );
  return match ? SERVICE_INFO[match] : undefined;
}