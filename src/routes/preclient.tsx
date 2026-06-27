import { createFileRoute } from '@tanstack/react-router'
import { PreclientPage } from '@/features/preclient/pages/preclient-page'

export const Route = createFileRoute('/preclient')({ component: PreclientPage })
