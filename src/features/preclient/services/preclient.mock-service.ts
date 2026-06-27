import type { PreclientFormData, UploadedEvidence } from '../types/preclient.types'

export async function submitApplication(
  _data: PreclientFormData,
  _evidences: UploadedEvidence[],
): Promise<{ success: boolean; applicationId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  const applicationId = `APP-${Math.floor(Math.random() * 90000) + 10000}`
  return { success: true, applicationId }
}