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
