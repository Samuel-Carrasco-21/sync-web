import {
  CalendarIcon,
  ChevronRightIcon,
  MapPinIcon,
  PhoneIcon,
  TrendingUpIcon,
  BadgeIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatusBadge } from "@/shared/components/status-badge";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";
import type { CreditApplication } from "@/shared/types/application";

interface ApplicationCardProps {
  application: CreditApplication;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link
      to="/advisor/$applicationId"
      params={{ applicationId: application.id }}
      className="block rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {application.preclientName}
            </h3>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {application.economicActivity}
          </p>
        </div>
        <ChevronRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUpIcon className="h-3.5 w-3.5" />
          <span>
            Solicita{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(application.requestedAmount)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{formatDate(application.submittedAt)}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <BadgeIcon className="h-3.5 w-3.5" />
          <span>
            NIT{" "}
            <span className="font-medium text-foreground">
              {application.nit}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <PhoneIcon className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">
            {application.phone}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPinIcon className="h-3.5 w-3.5" />
          <span className="truncate max-w-45">{application.address}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        {application.alertsCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
            {application.alertsCount}{" "}
            {application.alertsCount === 1 ? "alerta" : "alertas"}
          </span>
        )}
        <span className="text-xs text-muted-foreground">{application.applicationCode}</span>
      </div>
    </Link>
  );
}
