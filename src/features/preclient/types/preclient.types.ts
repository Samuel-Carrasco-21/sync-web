import type { EvidenceType } from '@/shared/types/common'

export type PreclientFormData = {
  fullName: string
  phone: string
  economicActivity: string
  requestedAmount: number
  businessDescription: string
}

export type UploadedEvidence = {
  id: string
  file: File
  type: EvidenceType
  previewUrl?: string
}
