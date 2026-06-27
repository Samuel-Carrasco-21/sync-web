// View-model types consumed by the UI. The API layer (src/shared/api) maps the
// backend's snake_case DTOs into these camelCase shapes.

export type AlertItem = {
  level: string // 'info' | 'warning' | 'error'
  message: string
  levelLabel?: string | null
  evidenceId?: string | null // media asset this alert refers to, or null for general alerts
}

export type Transaction = {
  id: string
  mediaAssetId: string | null
  sourceType: string // 'ai' | 'manual'
  sourceTypeLabel: string
  transactionType: string // 'income' | 'expense' | 'unknown'
  transactionTypeLabel: string
  amount: number
  currency: string
  description?: string | null
  transactionDate?: string | null
  paymentMethod: string // 'qr' | 'cash' | 'transfer' | 'unknown'
  paymentMethodLabel: string
  evidenceText?: string | null
  confidence?: number | null
  status: string // extracted | confirmed | rejected | corrected | manual
  statusLabel: string
}

export type Evidence = {
  id: string
  name: string // original filename
  documentType: string | null // raw enum (sales_notebook, qr_receipt, ...)
  documentTypeLabel: string // Spanish label
  status: string // raw media status (uploaded, processing, processed, review, failed)
  statusLabel: string
  detectedAmount?: number
  confidence?: number
  extractedText?: string
  errorMessage?: string // model/SDK feedback when status is 'failed'
}

export type FinancialSummaryView = {
  detectedIncome: number
  detectedExpenses: number
  estimatedNetBalance: number
  salesFrequency: string
  documentaryEvidence: string
  preliminaryRisk: string
  confidenceScore?: number | null
}

export type CreditApplication = {
  id: string
  applicationCode: string
  preclientName: string
  phone: string
  nit: string
  economicActivity: string
  requestedAmount: number
  currency: string
  businessDescription: string
  status: string // Spanish label, e.g. 'Pendiente'
  rawStatus: string // raw enum for PATCH, e.g. 'pending'
  address: string
  submittedAt: string
  summary: FinancialSummaryView
  evidences: Evidence[]
  transactions: Transaction[]
  alerts: AlertItem[]
  alertsCount: number // alerts.length in detail; alerts_count in list cards
  advisorNotes?: string | null
}
