import { createFileRoute } from '@tanstack/react-router'
import { ApplicationDetailPage } from '@/features/advisor/pages/application-detail-page'

export const Route = createFileRoute('/advisor/$applicationId')({ component: ApplicationDetailPage })
