import { mockApplications } from '@/data/mock-applications'
import type { CreditApplication } from '@/data/mock-applications'
import type { ApplicationStatus } from '@/shared/types/common'

// Mutable local copy to simulate session state
let applications: CreditApplication[] = mockApplications.map((app) => ({ ...app }))

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getApplications(): Promise<CreditApplication[]> {
  await delay(500)
  return [...applications]
}

export async function getApplicationById(id: string): Promise<CreditApplication | undefined> {
  await delay(300)
  return applications.find((app) => app.id === id)
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<CreditApplication> {
  await delay(400)
  const index = applications.findIndex((app) => app.id === id)
  if (index === -1) throw new Error(`Application ${id} not found`)
  applications[index] = { ...applications[index], status }
  return applications[index]
}

export async function updateAdvisorNotes(id: string, notes: string): Promise<CreditApplication> {
  await delay(400)
  const index = applications.findIndex((app) => app.id === id)
  if (index === -1) throw new Error(`Application ${id} not found`)
  applications[index] = { ...applications[index], advisorNotes: notes }
  return applications[index]
}
