import type { ApplicationStatus } from "@/shared/types/common";
import type { CreditApplication } from "@/data/mock-applications";

export const ALL_STATUSES = "Todos" as const;

export type StatusOption = ApplicationStatus | typeof ALL_STATUSES;

export type FilterState = {
  search: string; // matches name
  phone: string;
  nit: string;
  economicActivity: string;
  amountMin: string; // string so the input is controlled; parse to number when filtering
  amountMax: string;
  dateFrom: string; // "YYYY-MM-DD" or ""
  dateTo: string; // "YYYY-MM-DD" or ""
  status: StatusOption;
};

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  phone: "",
  nit: "",
  economicActivity: "",
  amountMin: "",
  amountMax: "",
  dateFrom: "",
  dateTo: "",
  status: ALL_STATUSES,
};

export function applyFilters(
  applications: CreditApplication[],
  filters: FilterState,
): CreditApplication[] {
  const amountMin = filters.amountMin !== "" ? Number(filters.amountMin) : null;
  const amountMax = filters.amountMax !== "" ? Number(filters.amountMax) : null;
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const dateTo = filters.dateTo ? new Date(filters.dateTo + "T23:59:59") : null;

  return applications.filter((app) => {
    const q = filters.search.toLowerCase();
    if (q && !app.preclientName.toLowerCase().includes(q)) return false;

    if (
      filters.phone &&
      !app.phone.replace(/\s/g, "").includes(filters.phone.replace(/\s/g, ""))
    )
      return false;

    if (filters.nit && !app.nit.includes(filters.nit)) return false;

    const actQ = filters.economicActivity.toLowerCase();
    if (actQ && !app.economicActivity.toLowerCase().includes(actQ))
      return false;

    if (amountMin !== null && app.requestedAmount < amountMin) return false;
    if (amountMax !== null && app.requestedAmount > amountMax) return false;

    const submitted = new Date(app.submittedAt);
    if (dateFrom && submitted < dateFrom) return false;
    if (dateTo && submitted > dateTo) return false;

    if (filters.status !== ALL_STATUSES && app.status !== filters.status)
      return false;

    return true;
  });
}

export function exportToCSV(applications: CreditApplication[]): void {
  const headers = [
    "ID",
    "Nombre",
    "Teléfono",
    "NIT",
    "Actividad económica",
    "Monto solicitado (Bs)",
    "Estado",
    "Fecha de solicitud",
    "Ingreso detectado",
    "Egreso detectado",
    "Balance neto estimado",
    "Riesgo preliminar",
  ];

  const escape = (v: string | number): string => {
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const rows = applications.map((app) => [
    escape(app.id),
    escape(app.preclientName),
    escape(app.phone),
    escape(app.nit),
    escape(app.economicActivity),
    escape(app.requestedAmount),
    escape(app.status),
    escape(new Date(app.submittedAt).toLocaleDateString("es-BO")),
    escape(app.summary.detectedIncome),
    escape(app.summary.detectedExpenses),
    escape(app.summary.estimatedNetBalance),
    escape(app.summary.preliminaryRisk),
  ]);

  const csv = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `solicitudes_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
