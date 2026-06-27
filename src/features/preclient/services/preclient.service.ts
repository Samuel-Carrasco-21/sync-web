import { apiPostForm } from '@/shared/api/client'
import type { ManagementDetailDto } from '@/shared/api/dto'
import type { PreclientFormData, UploadedEvidence } from '../types/preclient.types'

export async function submitApplication(
  data: PreclientFormData,
  evidences: UploadedEvidence[],
): Promise<{ success: boolean; applicationId: string }> {
  const formData = new FormData()
  formData.append('full_name', data.preclientName)
  formData.append('phone_number', data.phone)
  if (data.nit) formData.append('nit', data.nit)
  formData.append('business_type', data.economicActivity)
  formData.append('business_description', data.businessDescription)
  formData.append('market_location', data.address)
  formData.append('requested_amount', String(data.requestedAmount))
  formData.append('currency', 'BOB')
  for (const evidence of evidences) {
    formData.append('files', evidence.file)
  }

  const result = await apiPostForm<ManagementDetailDto>('/managements', formData)
  return { success: true, applicationId: result.application_code }
}
