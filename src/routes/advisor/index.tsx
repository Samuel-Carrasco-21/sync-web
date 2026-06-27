import { createFileRoute } from '@tanstack/react-router'
import { AdvisorPage } from '@/features/advisor/pages/advisor-page'

export const Route = createFileRoute('/advisor/')({ component: AdvisorPage })
