import type { ApplicationStatus, EvidenceStatus, EvidenceType, FrequencyLevel, RiskLevel } from '@/shared/types/common'

export type Evidence = {
  id: string
  name: string
  type: EvidenceType
  fileUrl?: string
  status: EvidenceStatus
  detectedAmount?: number
  extractedText?: string
  confidence?: number
}

export type CreditApplication = {
  id: string
  preclientName: string
  phone: string
  nit: string
  economicActivity: string
  requestedAmount: number
  businessDescription: string
  status: ApplicationStatus
  address: string
  submittedAt: string
  summary: {
    detectedIncome: number
    detectedExpenses: number
    estimatedNetBalance: number
    salesFrequency: FrequencyLevel
    documentaryEvidence: FrequencyLevel
    preliminaryRisk: RiskLevel
  }
  evidences: Evidence[]
  alerts: string[]
  advisorNotes?: string
}

export const mockApplications: CreditApplication[] = [
  {
    id: 'APP-001',
    preclientName: 'María Quispe Huanca',
    phone: '76543210',
    nit: '123456789',
    address: 'Zona 16 de Julio, El Alto, La Paz',
    economicActivity: 'Tienda de abarrotes',
    requestedAmount: 8000,
    businessDescription:
      'Tienda de abarrotes en la zona 16 de Julio, El Alto. Vendo productos básicos como arroz, azúcar, aceite y artículos de limpieza. Tengo 5 años en el negocio.',
    status: 'Pendiente',
    submittedAt: '2026-06-25T09:30:00Z',
    summary: {
      detectedIncome: 12400,
      detectedExpenses: 8200,
      estimatedNetBalance: 4200,
      salesFrequency: 'Alta',
      documentaryEvidence: 'Media',
      preliminaryRisk: 'Bajo',
    },
    evidences: [
      {
        id: 'EV-001-1',
        name: 'Cuaderno de ventas junio 2026.jpg',
        type: 'Cuaderno de ventas',
        status: 'Procesado',
        detectedAmount: 12400,
        extractedText:
          'Lunes 2/6: Bs 420\nMartes 3/6: Bs 380\nMiércoles 4/6: Bs 510\nJueves 5/6: Bs 290\nViernes 6/6: Bs 650\nSábado 7/6: Bs 820',
        confidence: 0.87,
      },
      {
        id: 'EV-001-2',
        name: 'Comprobante QR BCP mayo.jpg',
        type: 'Comprobante QR',
        status: 'Procesado',
        detectedAmount: 3200,
        extractedText: 'Transferencia recibida\nMonto: Bs 3.200,00\nFecha: 31/05/2026\nReferencia: 7842931',
        confidence: 0.95,
      },
      {
        id: 'EV-001-3',
        name: 'Recibo compra mercadería.jpg',
        type: 'Recibo',
        status: 'Revisar',
        detectedAmount: 5800,
        extractedText: 'Proveedor: Distribuidora Central\nProductos varios\nTotal: Bs 5.800,00',
        confidence: 0.72,
      },
    ],
    alerts: [
      'El recibo de compra de mercadería tiene baja confianza de lectura (72%). Verificar documento original.',
      'Las ventas del sábado son significativamente mayores al promedio semanal.',
    ],
    advisorNotes: undefined,
  },
  {
    id: 'APP-002',
    preclientName: 'Carlos Mamani Condori',
    phone: '71234567',
    nit: '987654321',
    address: 'Plaza del Estudiante, La Paz',
    economicActivity: 'Venta de comida (salteñas y api)',
    requestedAmount: 5000,
    businessDescription:
      'Vendo salteñas y api por las mañanas en la Plaza del Estudiante, La Paz. De lunes a sábado desde las 7am hasta las 12pm. Mi punto fijo tiene 3 años.',
    status: 'En revisión',
    submittedAt: '2026-06-24T14:15:00Z',
    summary: {
      detectedIncome: 7800,
      detectedExpenses: 5100,
      estimatedNetBalance: 2700,
      salesFrequency: 'Alta',
      documentaryEvidence: 'Baja',
      preliminaryRisk: 'Moderado',
    },
    evidences: [
      {
        id: 'EV-002-1',
        name: 'Cuaderno ventas mayo-junio.jpg',
        type: 'Cuaderno de ventas',
        status: 'Procesado',
        detectedAmount: 7800,
        extractedText:
          'MAYO:\nSemana 1: Bs 1.820\nSemana 2: Bs 1.950\nSemana 3: Bs 1.740\nSemana 4: Bs 2.290\nJUNIO (1-15):\nSemana 1: Bs 2.100',
        confidence: 0.81,
      },
      {
        id: 'EV-002-2',
        name: 'Foto inventario ingredientes.jpg',
        type: 'Inventario',
        status: 'Revisar',
        extractedText: 'Harina, manteca, carne, cebolla, aceite. Stock estimado para 2 semanas.',
        confidence: 0.65,
      },
    ],
    alerts: [
      'Documentación escasa. Solo se presentó cuaderno de ventas e inventario sin comprobantes de ingreso bancario.',
      'No se detectaron comprobantes QR ni facturas. El negocio podría operar principalmente en efectivo.',
      'La evidencia de inventario tiene baja confianza (65%). Solicitar foto más clara.',
    ],
    advisorNotes:
      'Cliente con negocio consolidado pero documentación limitada. Recomendar presentar extracto bancario o historial de transferencias QR si tiene cuenta.',
  },
  {
    id: 'APP-003',
    preclientName: 'Rosa Choque Flores',
    phone: '68901234',
    nit: '192837465',
    address: 'Zona Sur, La Paz (ventas por WhatsApp)',
    economicActivity: 'Comercio por WhatsApp (ropa y accesorios)',
    requestedAmount: 12000,
    businessDescription:
      'Vendo ropa importada de contrabando hormiga y accesorios por WhatsApp y catálogos. Tengo más de 200 clientes fijos. Hago pedidos a Iquique cada 2 meses.',
    status: 'Observado',
    submittedAt: '2026-06-23T10:00:00Z',
    summary: {
      detectedIncome: 18500,
      detectedExpenses: 15200,
      estimatedNetBalance: 3300,
      salesFrequency: 'Media',
      documentaryEvidence: 'Media',
      preliminaryRisk: 'Alto',
    },
    evidences: [
      {
        id: 'EV-003-1',
        name: 'Capturas ventas WhatsApp.jpg',
        type: 'Comprobante QR',
        status: 'Procesado',
        detectedAmount: 8500,
        extractedText:
          'Transferencia QR recibida: Bs 850 - Cliente Ana\nTransferencia QR recibida: Bs 1.200 - Cliente Pedro\nTransferencia QR recibida: Bs 650 - Cliente María\nTotal detectado: Bs 8.500',
        confidence: 0.78,
      },
      {
        id: 'EV-003-2',
        name: 'Factura compra Iquique.jpg',
        type: 'Factura',
        status: 'Procesado',
        detectedAmount: 12000,
        extractedText: 'Factura N° 4821\nFecha: 15/04/2026\nRopa y accesorios varios\nTotal: USD 1.800 (aprox. Bs 12.000)',
        confidence: 0.88,
      },
      {
        id: 'EV-003-3',
        name: 'Inventario ropa actual.jpg',
        type: 'Inventario',
        status: 'Revisar',
        extractedText: 'Blusas x30, pantalones x25, vestidos x15, accesorios varios. Valor estimado: Bs 18.000',
        confidence: 0.70,
      },
    ],
    alerts: [
      'El monto solicitado (Bs 12.000) es elevado en relación al saldo neto estimado (Bs 3.300).',
      'El negocio menciona mercadería de importación. Verificar cumplimiento aduanero.',
      'Alta variabilidad en los ingresos detectados. Los comprobantes QR no cubren el total declarado.',
      'Riesgo preliminar alto. Se recomienda entrevista presencial antes de continuar.',
    ],
    advisorNotes:
      'OBSERVADO: Solicitar extracto bancario de los últimos 3 meses y documento de identidad actualizado. El negocio tiene potencial pero los ingresos declarados no se sostienen completamente con la evidencia presentada.',
  },
  {
    id: 'APP-004',
    preclientName: 'Juan Apaza Ticona',
    phone: '72345678',
    nit: '564738291',
    address: 'Av. Montes, La Paz',
    economicActivity: 'Almacén de repuestos automotrices',
    requestedAmount: 20000,
    businessDescription:
      'Almacén de repuestos para vehículos livianos y pesados en la Av. Montes, La Paz. Llevo 8 años en el rubro. Tengo proveedor fijo en Santa Cruz y clientes mecánicos que compran al por mayor.',
    status: 'Listo para análisis',
    submittedAt: '2026-06-20T08:00:00Z',
    summary: {
      detectedIncome: 35600,
      detectedExpenses: 22400,
      estimatedNetBalance: 13200,
      salesFrequency: 'Alta',
      documentaryEvidence: 'Alta',
      preliminaryRisk: 'Bajo',
    },
    evidences: [
      {
        id: 'EV-004-1',
        name: 'Cuaderno ventas mayo 2026.jpg',
        type: 'Cuaderno de ventas',
        status: 'Procesado',
        detectedAmount: 35600,
        extractedText:
          'Semana 1: Bs 8.200 (incluye venta mayor a Taller Hermanos)\nSemana 2: Bs 9.100\nSemana 3: Bs 7.800\nSemana 4: Bs 10.500\nTotal mes: Bs 35.600',
        confidence: 0.92,
      },
      {
        id: 'EV-004-2',
        name: 'Facturas proveedor Santa Cruz.jpg',
        type: 'Factura',
        status: 'Procesado',
        detectedAmount: 18000,
        extractedText:
          'Proveedor: Repuestos del Oriente SRL\nFactura N° 8821 - Bs 9.500\nFactura N° 9103 - Bs 8.500\nTotal compras mayo: Bs 18.000',
        confidence: 0.94,
      },
      {
        id: 'EV-004-3',
        name: 'Comprobantes QR clientes.jpg',
        type: 'Comprobante QR',
        status: 'Procesado',
        detectedAmount: 12400,
        extractedText:
          'QR recibido: Bs 3.200 - Taller Hermanos\nQR recibido: Bs 4.100 - Auto Servicio Norte\nQR recibido: Bs 2.800 - Mecánica Central\nQR recibido: Bs 2.300 - Otros clientes\nTotal: Bs 12.400',
        confidence: 0.96,
      },
      {
        id: 'EV-004-4',
        name: 'Inventario almacén.jpg',
        type: 'Inventario',
        status: 'Procesado',
        extractedText: 'Stock en almacén: filtros, frenos, correas, baterías, lubricantes. Valor estimado del inventario: Bs 45.000',
        confidence: 0.85,
      },
    ],
    alerts: [
      'El monto solicitado es consistente con el flujo de ingresos detectados.',
    ],
    advisorNotes:
      'Solicitud bien documentada. Ingresos verificables y consistentes con el tiempo en el negocio. Inventario amplio. Riesgo bajo. Proceder con análisis crediticio formal.',
  },
]
