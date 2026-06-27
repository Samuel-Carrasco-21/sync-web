import { Download, X } from "lucide-react";
import type { FilterState, StatusOption } from "./application-filters";
import { ALL_STATUSES } from "./application-filters";

const STATUS_OPTIONS: StatusOption[] = [
  ALL_STATUSES,
  "Pendiente",
  "En revisión",
  "Observado",
  "Listo para análisis",
];

interface FilterPanelProps {
  filters: FilterState;
  resultCount: number;
  activeFilterCount: number;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  onExport: () => void;
}

/**
 * Inline filter panel — only rendered on lg+ (≥ 1024 px).
 * On smaller screens, FilterDrawer takes over via a FAB.
 */
export function FilterPanel({
  filters,
  resultCount,
  activeFilterCount,
  onChange,
  onReset,
  onExport,
}: FilterPanelProps) {
  return (
    <div className="hidden lg:block">
      <div className="rounded-xl border bg-card p-4 space-y-4">
        {/* Row 1 — name / phone / NIT */}
        <div className="grid grid-cols-3 gap-3">
          <FilterInput
            label="Nombre"
            placeholder="Buscar por nombre..."
            value={filters.search}
            onChange={(v) => onChange({ search: v })}
          />
          <FilterInput
            label="Teléfono"
            placeholder="+591 7XXXXXXX"
            value={filters.phone}
            onChange={(v) => onChange({ phone: v })}
            type="tel"
          />
          <FilterInput
            label="NIT"
            placeholder="Número de NIT"
            value={filters.nit}
            onChange={(v) => onChange({ nit: v })}
            inputMode="numeric"
          />
        </div>

        {/* Row 2 — economic activity / amount range */}
        <div className="grid grid-cols-3 gap-3">
          <FilterInput
            label="Actividad económica"
            placeholder="Filtrar actividad..."
            value={filters.economicActivity}
            onChange={(v) => onChange({ economicActivity: v })}
          />
          <FilterInput
            label="Monto mínimo (Bs)"
            placeholder="0"
            value={filters.amountMin}
            onChange={(v) => onChange({ amountMin: v })}
            type="number"
            min="0"
          />
          <FilterInput
            label="Monto máximo (Bs)"
            placeholder="Sin límite"
            value={filters.amountMax}
            onChange={(v) => onChange({ amountMax: v })}
            type="number"
            min="0"
          />
        </div>

        {/* Row 3 — date range */}
        <div className="grid grid-cols-3 gap-3">
          <FilterInput
            label="Fecha desde"
            value={filters.dateFrom}
            onChange={(v) => onChange({ dateFrom: v })}
            type="date"
          />
          <FilterInput
            label="Fecha hasta"
            value={filters.dateTo}
            onChange={(v) => onChange({ dateTo: v })}
            type="date"
            min={filters.dateFrom || undefined}
          />
          <div />
        </div>

        <div className="border-t" />

        {/* Status pills + actions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0">
            Estado
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onChange({ status: s as StatusOption })}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  filters.status === s
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">
              {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
            </span>

            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
                Limpiar
              </button>
            )}

            <button
              onClick={onExport}
              disabled={resultCount === 0}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-foreground px-3 py-1 text-xs font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-3 w-3" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── helper ─── */

interface FilterInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function FilterInput({ label, value, onChange, ...rest }: FilterInputProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        {...rest}
      />
    </label>
  );
}
