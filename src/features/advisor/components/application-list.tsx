import { useState, useCallback } from "react";
import { ApplicationCard } from "./application-card";
import { FilterPanel } from "./filter-panel";
import { FilterDrawer } from "./filter-drawer";
import { EmptyState } from "@/shared/components/empty-state";
import {
  applyFilters,
  exportToCSV,
  DEFAULT_FILTERS,
  ALL_STATUSES,
} from "./application-filters";
import type { FilterState } from "./application-filters";
import type { CreditApplication } from "@/data/mock-applications";

interface ApplicationListProps {
  applications: CreditApplication[];
}

/** Count how many filter fields are non-default (for the FAB badge). */
function countActiveFilters(filters: FilterState): number {
  let n = 0;
  if (filters.search) n++;
  if (filters.phone) n++;
  if (filters.nit) n++;
  if (filters.economicActivity) n++;
  if (filters.amountMin) n++;
  if (filters.amountMax) n++;
  if (filters.dateFrom) n++;
  if (filters.dateTo) n++;
  if (filters.status !== ALL_STATUSES) n++;
  return n;
}

export function ApplicationList({ applications }: ApplicationListProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleChange = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filtered = applyFilters(applications, filters);
  const activeFilterCount = countActiveFilters(filters);

  const handleExport = useCallback(() => {
    exportToCSV(filtered);
  }, [filtered]);

  return (
    // Extra bottom padding on mobile/tablet so the FAB never sits on top of a card
    <div className="space-y-4 pb-24 lg:pb-0">
      {/* Desktop inline panel */}
      <FilterPanel
        filters={filters}
        resultCount={filtered.length}
        activeFilterCount={activeFilterCount}
        onChange={handleChange}
        onReset={handleReset}
        onExport={handleExport}
      />

      {/* Mobile/tablet: FAB + drawer (rendered in DOM but visually hidden on lg+) */}
      <FilterDrawer
        open={drawerOpen}
        filters={filters}
        resultCount={filtered.length}
        activeFilterCount={activeFilterCount}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        onChange={handleChange}
        onReset={handleReset}
        onExport={handleExport}
      />

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No se encontraron solicitudes que coincidan con los filtros aplicados."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
