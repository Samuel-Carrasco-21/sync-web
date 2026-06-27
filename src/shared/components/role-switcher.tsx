import { cn } from "@/lib/utils";
import type { Role } from "@/shared/types/common";

interface RoleSwitcherProps {
  currentRole: Role;
  onChange: (role: Role) => void;
}

const ROLES: { value: Role; label: string }[] = [
  { value: "preclient", label: "Precliente" },
  { value: "advisor", label: "Asesor de crédito" },
];

export function RoleSwitcher({ currentRole, onChange }: RoleSwitcherProps) {
  return (
    <div className="flex w-max rounded-lg border bg-muted p-1 gap-1">
      {ROLES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "flex-1 rounded-md px-0.5 lg:px-3 py-1.5 text-xs font-medium transition-colors",
            "text-center leading-tight",
            currentRole === value
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
