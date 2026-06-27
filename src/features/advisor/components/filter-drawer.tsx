import { useEffect, useRef } from "react";
import { X, Download, SlidersHorizontal } from "lucide-react";
import type { FilterState, StatusOption } from "./application-filters";
import { ALL_STATUSES } from "./application-filters";
import type { ApplicationStatus } from "@/shared/types/common";

const STATUS_OPTIONS: StatusOption[] = [
  ALL_STATUSES,
  "Pendiente",
  "En revisión",
  "Observado",
  "Listo para análisis",
];

interface FilterDrawerProps {
  open: boolean;
  filters: FilterState;
  resultCount: number;
  activeFilterCount: number;
  onOpen: () => void;
  onClose: () => void;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  onExport: () => void;
}

export function FilterDrawer({
  open,
  filters,
  resultCount,
  activeFilterCount,
  onOpen,
  onClose,
  onChange,
  onReset,
  onExport,
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Trap focus inside drawer when open
  useEffect(() => {
    if (open) {
      drawerRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* FAB — fixed bottom-right */}
      <button
        onClick={onOpen}
        aria-label="Abrir filtros"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-foreground text-background shadow-lg transition-transform active:scale-95 lg:hidden"
      >
        <SlidersHorizontal className="h-5 w-5" />
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ring text-[10px] font-medium text-background">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/*
        Drawer:
        - Mobile (< sm): slides up from bottom, full width, max-height 90vh
        - Tablet (sm–lg): slides in from the right as a side-sheet, fixed width 400px
      */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de solicitudes"
        tabIndex={-1}
        className={[
          "fixed z-50 bg-card focus:outline-none lg:hidden",
          // mobile: bottom sheet — flush with screen bottom, no bottom radius
          "bottom-0 left-0 right-0 rounded-t-2xl border-t border-border",
          // flex column so footer sticks to bottom and body scrolls
          "flex flex-col max-h-[90svh]",
          // tablet: right side-sheet (overrides mobile when sm+)
          "sm:bottom-0 sm:left-auto sm:right-0 sm:top-0 sm:w-[400px] sm:rounded-none sm:rounded-l-2xl sm:border-l sm:border-t-0",
          "sm:max-h-none sm:h-full",
          // slide animation
          open
            ? "translate-y-4 sm:translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:translate-x-full",
          "transition-transform duration-300 ease-in-out",
        ].join(" ")}
      >
        {/* Drawer header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4">
          {/* Mobile drag handle hint */}
          <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-border sm:hidden" />

          <span className="text-sm font-medium">Filtros</span>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Limpiar todo
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Cerrar filtros"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer body — scrolls independently, footer stays pinned */}
        <div className="flex-1 overflow-y-auto space-y-5 p-5">
          {/* Name */}
          <FilterInput
            label="Nombre"
            placeholder="Buscar por nombre..."
            value={filters.search}
            onChange={(v) => onChange({ search: v })}
          />

          {/* Phone + NIT */}
          <div className="grid grid-cols-2 gap-3">
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

          {/* Economic activity */}
          <FilterInput
            label="Actividad económica"
            placeholder="Filtrar actividad..."
            value={filters.economicActivity}
            onChange={(v) => onChange({ economicActivity: v })}
          />

          {/* Amount range */}
          <div>
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Monto solicitado (Bs)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <FilterInput
                label=""
                placeholder="Mínimo"
                value={filters.amountMin}
                onChange={(v) => onChange({ amountMin: v })}
                type="number"
                min="0"
              />
              <FilterInput
                label=""
                placeholder="Máximo"
                value={filters.amountMax}
                onChange={(v) => onChange({ amountMax: v })}
                type="number"
                min="0"
              />
            </div>
          </div>

          {/* Date range */}
          <div>
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Fecha de solicitud
            </span>
            <div className="grid grid-cols-2 gap-3">
              <FilterInput
                label=""
                placeholder="Desde"
                value={filters.dateFrom}
                onChange={(v) => onChange({ dateFrom: v })}
                type="date"
              />
              <FilterInput
                label=""
                placeholder="Hasta"
                value={filters.dateTo}
                onChange={(v) => onChange({ dateTo: v })}
                type="date"
                min={filters.dateFrom || undefined}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <span className="mb-2 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
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
          </div>
        </div>

        {/* Drawer footer — always visible at bottom, covers safe area */}
        <div className="shrink-0 border-t border-border bg-card px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <span className="flex-1 text-xs text-muted-foreground">
              {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
            </span>
            <button
              onClick={onExport}
              disabled={resultCount === 0}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              Exportar CSV
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
            >
              Ver resultados
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── helper ─── */

interface FilterInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function FilterInput({ label, value, onChange, ...rest }: FilterInputProps) {
  return (
    <label className="flex flex-col gap-1">
      {label && (
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        {...rest}
      />
    </label>
  );
}
