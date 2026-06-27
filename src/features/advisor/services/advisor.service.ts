import { apiGet, apiPatchJson, apiPost, apiPostForm, apiPostJson } from '@/shared/api/client'
import type {
  AdvisorNotesResponseDto,
  ManagementDetailDto,
  ManagementListResponseDto,
  ManualTransactionPayload,
  RejectTransactionDto,
  StatusResponseDto,
  TransactionMutationDto,
  TransactionUpdatePayload,
} from '@/shared/api/dto'
import { mapDetail, mapListItem } from '@/shared/api/mappers'
import type { CreditApplication } from '@/shared/types/application'

export async function getApplications(): Promise<CreditApplication[]> {
  const data = await apiGet<ManagementListResponseDto>('/managements?status=all')
  return data.items.map(mapListItem)
}

export async function getApplicationById(id: string): Promise<CreditApplication> {
  const data = await apiGet<ManagementDetailDto>(`/managements/${id}`)
  return mapDetail(data)
}

export function updateApplicationStatus(id: string, rawStatus: string): Promise<StatusResponseDto> {
  return apiPatchJson<StatusResponseDto>(`/managements/${id}/status`, { status: rawStatus })
}

export function updateAdvisorNotes(id: string, notes: string): Promise<AdvisorNotesResponseDto> {
  return apiPatchJson<AdvisorNotesResponseDto>(`/managements/${id}/advisor-notes`, {
    advisor_notes: notes,
  })
}

export async function addEvidence(id: string, files: File[]): Promise<CreditApplication> {
  const formData = new FormData()
  for (const file of files) formData.append('files', file)
  const data = await apiPostForm<ManagementDetailDto>(`/managements/${id}/evidence`, formData)
  return mapDetail(data)
}

export function createManualTransaction(
  id: string,
  payload: ManualTransactionPayload,
): Promise<TransactionMutationDto> {
  return apiPostJson<TransactionMutationDto>(`/managements/${id}/transactions`, payload)
}

export function updateTransaction(
  transactionId: string,
  payload: TransactionUpdatePayload,
): Promise<TransactionMutationDto> {
  return apiPatchJson<TransactionMutationDto>(`/transactions/${transactionId}`, payload)
}

export function rejectTransaction(transactionId: string): Promise<RejectTransactionDto> {
  return apiPost<RejectTransactionDto>(`/transactions/${transactionId}/reject`)
}
