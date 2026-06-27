import type {
  AlertItem,
  CreditApplication,
  Evidence,
  Transaction,
} from '@/shared/types/application'
import type {
  AlertDto,
  EvidenceDto,
  ManagementDetailDto,
  ManagementListItemDto,
  TransactionDto,
} from './dto'

function toNumber(value: string | null | undefined): number {
  if (value == null) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function mapAlert(dto: AlertDto): AlertItem {
  return { level: dto.level, message: dto.message, levelLabel: dto.level_label }
}

export function mapEvidence(dto: EvidenceDto): Evidence {
  return {
    id: dto.id,
    name: dto.filename,
    documentType: dto.document_type,
    documentTypeLabel: dto.document_type_label ?? 'Desconocido',
    status: dto.status,
    statusLabel: dto.status_label,
    detectedAmount: dto.detected_amount != null ? toNumber(dto.detected_amount) : undefined,
    confidence: dto.confidence_score ?? undefined,
    extractedText: dto.extracted_text ?? undefined,
  }
}

export function mapTransaction(dto: TransactionDto): Transaction {
  return {
    id: dto.id,
    mediaAssetId: dto.media_asset_id,
    sourceType: dto.source_type,
    sourceTypeLabel: dto.source_type_label,
    transactionType: dto.transaction_type,
    transactionTypeLabel: dto.transaction_type_label,
    amount: toNumber(dto.amount),
    currency: dto.currency,
    description: dto.description,
    transactionDate: dto.transaction_date,
    paymentMethod: dto.payment_method,
    paymentMethodLabel: dto.payment_method_label,
    evidenceText: dto.evidence_text,
    confidence: dto.confidence_score,
    status: dto.status,
    statusLabel: dto.status_label,
  }
}

export function mapDetail(dto: ManagementDetailDto): CreditApplication {
  return {
    id: dto.id,
    applicationCode: dto.application_code,
    preclientName: dto.customer.full_name,
    phone: dto.customer.phone_number ?? '',
    nit: dto.customer.nit ?? '',
    economicActivity: dto.customer.business_type ?? '',
    requestedAmount: toNumber(dto.requested_amount),
    currency: dto.currency,
    businessDescription: dto.customer.business_description ?? '',
    status: dto.status_label,
    rawStatus: dto.status,
    address: dto.customer.market_location ?? '',
    submittedAt: dto.submitted_at,
    summary: {
      detectedIncome: toNumber(dto.financial_summary.total_income),
      detectedExpenses: toNumber(dto.financial_summary.total_expense),
      estimatedNetBalance: toNumber(dto.financial_summary.net_balance),
      salesFrequency: dto.financial_summary.sales_frequency,
      documentaryEvidence: dto.financial_summary.documentary_evidence,
      preliminaryRisk: dto.financial_summary.preliminary_risk,
      confidenceScore: dto.financial_summary.confidence_score,
    },
    evidences: dto.evidences.map(mapEvidence),
    transactions: dto.transactions.map(mapTransaction),
    alerts: dto.alerts.map(mapAlert),
    alertsCount: dto.alerts.length,
    advisorNotes: dto.advisor_notes,
  }
}

export function mapListItem(dto: ManagementListItemDto): CreditApplication {
  return {
    id: dto.id,
    applicationCode: dto.application_code,
    preclientName: dto.customer.full_name,
    phone: dto.customer.phone_number ?? '',
    nit: dto.customer.nit ?? '',
    economicActivity: dto.customer.business_type ?? '',
    requestedAmount: toNumber(dto.requested_amount),
    currency: dto.currency,
    businessDescription: '',
    status: dto.status_label,
    rawStatus: dto.status,
    address: dto.customer.market_location ?? '',
    submittedAt: dto.submitted_at,
    summary: {
      detectedIncome: toNumber(dto.financial_summary.total_income),
      detectedExpenses: toNumber(dto.financial_summary.total_expense),
      estimatedNetBalance: toNumber(dto.financial_summary.net_balance),
      salesFrequency: 'Desconocido',
      documentaryEvidence: 'Desconocido',
      preliminaryRisk: dto.financial_summary.preliminary_risk,
      confidenceScore: dto.financial_summary.confidence_score,
    },
    evidences: [],
    transactions: [],
    alerts: [],
    alertsCount: dto.alerts_count,
    advisorNotes: null,
  }
}
