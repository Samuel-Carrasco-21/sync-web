export type Role = 'preclient' | 'advisor'

export type ApplicationStatus = 'Pendiente' | 'En revisión' | 'Observado' | 'Listo para análisis'

export type EvidenceType =
  | 'Cuaderno de ventas'
  | 'Comprobante QR'
  | 'Recibo'
  | 'Factura'
  | 'Inventario'
  | 'Otro'

export type EvidenceStatus = 'Cargado' | 'Procesado' | 'Revisar'

export type FrequencyLevel = 'Baja' | 'Media' | 'Alta'

export type RiskLevel = 'Bajo' | 'Moderado' | 'Alto'

// Backend management statuses: raw enum value + Spanish display label.
export const MANAGEMENT_STATUSES = [
  { raw: 'pending', label: 'Pendiente' },
  { raw: 'in_review', label: 'En revisión' },
  { raw: 'observed', label: 'Observado' },
  { raw: 'ready_for_analysis', label: 'Listo para análisis' },
] as const

export type ManagementStatusRaw = (typeof MANAGEMENT_STATUSES)[number]['raw']
