// Backend response/request shapes (snake_case), matching sync-core /api/v1.

export type CustomerDto = {
  id: string
  full_name: string
  phone_number: string | null
  nit: string | null
  business_name: string | null
  business_type: string | null
  business_description: string | null
  market_location: string | null
}

export type CustomerMiniDto = {
  full_name: string
  phone_number: string | null
  business_name: string | null
  business_type: string | null
  nit: string | null
  market_location: string | null
}

export type FinancialSummaryDto = {
  total_income: string
  total_expense: string
  net_balance: string
  sales_frequency: string
  documentary_evidence: string
  preliminary_risk: string
  confidence_score: number | null
}

export type FinancialSummaryCardDto = {
  total_income: string
  total_expense: string
  net_balance: string
  preliminary_risk: string
  confidence_score: number | null
}

export type FinancialSummaryShortDto = {
  total_income: string
  total_expense: string
  net_balance: string
  confidence_score: number | null
}

export type AlertDto = {
  level: string
  message: string
  level_label: string | null
}

export type EvidenceDto = {
  id: string
  filename: string
  status: string
  status_label: string
  document_type: string | null
  document_type_label: string | null
  detected_amount: string | null
  confidence_score: number | null
  extracted_text: string | null
}

export type TransactionDto = {
  id: string
  management_id: string
  media_asset_id: string | null
  source_type: string
  source_type_label: string
  transaction_type: string
  transaction_type_label: string
  amount: string
  currency: string
  description: string | null
  transaction_date: string | null
  payment_method: string
  payment_method_label: string
  evidence_text: string | null
  confidence_score: number | null
  status: string
  status_label: string
}

export type ManagementDetailDto = {
  id: string
  application_code: string
  status: string
  status_label: string
  submitted_at: string
  requested_amount: string
  currency: string
  visit_date: string | null
  customer: CustomerDto
  financial_summary: FinancialSummaryDto
  evidences: EvidenceDto[]
  transactions: TransactionDto[]
  alerts: AlertDto[]
  advisor_notes: string | null
}

export type ManagementListItemDto = {
  id: string
  application_code: string
  status: string
  status_label: string
  submitted_at: string
  requested_amount: string
  currency: string
  customer: CustomerMiniDto
  financial_summary: FinancialSummaryCardDto
  evidences_count: number
  alerts_count: number
}

export type ManagementListResponseDto = {
  items: ManagementListItemDto[]
}

export type TransactionMutationDto = {
  transaction: TransactionDto
  financial_summary: FinancialSummaryShortDto
}

export type RejectTransactionDto = {
  transaction_id: string
  financial_summary: FinancialSummaryShortDto
}

export type StatusResponseDto = {
  management_id: string
  status: string
  status_label: string
}

export type AdvisorNotesResponseDto = {
  management_id: string
  advisor_notes: string | null
}

// Request payloads
export type ManualTransactionPayload = {
  transaction_type: string
  amount: string
  currency?: string
  description?: string | null
  transaction_date?: string | null
  payment_method: string
}

export type TransactionUpdatePayload = {
  transaction_type?: string
  amount?: string
  description?: string | null
  transaction_date?: string | null
  payment_method?: string
}
