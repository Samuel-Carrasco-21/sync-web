import type { EvidenceType } from '@/shared/types/common'

export type PreclientFormData = {
  preclientName: string
  phone: string
  nit: string
  economicActivity: string
  requestedAmount: number
  businessDescription: string
  address: string
}

export type UploadedEvidence = {
  id: string
  file: File
  type: EvidenceType
  previewUrl?: string
}