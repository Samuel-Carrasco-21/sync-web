import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EvidenceUploader } from "../components/evidence-uploader";
import { SubmissionSuccess } from "../components/submission-success";
import { submitApplication } from "../services/preclient.service";
import type { UploadedEvidence } from "../types/preclient.types";
import { SendIcon } from "lucide-react";

const NIT_COMPLEMENTS = [
  { code: "LP", label: "LP – La Paz" },
  { code: "CB", label: "CB – Cochabamba" },
  { code: "SC", label: "SC – Santa Cruz" },
  { code: "OR", label: "OR – Oruro" },
  { code: "PT", label: "PT – Potosí" },
  { code: "TJ", label: "TJ – Tarija" },
  { code: "CH", label: "CH – Chuquisaca" },
  { code: "BE", label: "BE – Beni" },
  { code: "PD", label: "PD – Pando" },
  { code: "SZ", label: "SZ – Sin complemento" },
];

const ACTIVITY_OPTIONS = [
  "Tienda de abarrotes",
  "Venta de comida",
  "Comercio por WhatsApp",
  "Almacén / depósito",
  "Ropa y accesorios",
  "Ferretería",
  "Farmacia / cosmética",
  "Servicio técnico",
  "Transporte",
  "Agricultura",
  "Otro",
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  fullName: z.string().min(3, "El nombre completo es obligatorio"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  nit: z
    .number()
    .refine((val) => val.toString().length >= 8, "El NIT debe ser válido"),
  nitComplement: z.string().min(1, "Seleccioná el complemento del NIT"),
  economicActivity: z.string().min(3, "La actividad económica es obligatoria"),
  requestedAmount: z.number().min(500, "El monto mínimo es Bs 500"),
  businessDescription: z.string().min(10, "Describí brevemente tu negocio"),
  address: z.string().min(5, "La dirección es obligatoria"),
});

type FormData = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

export function PreclientPage() {
  const [evidences, setEvidences] = useState<UploadedEvidence[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    applicationId: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        preclientName: data.fullName,
        phone: data.phone,
        nit: `${data.nit}-${data.nitComplement}`,
        economicActivity: data.economicActivity,
        requestedAmount: data.requestedAmount,
        businessDescription: data.businessDescription,
        address: data.address,
      };
      const res = await submitApplication(payload, evidences);
      setResult(res);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "No se pudo enviar la solicitud. Intentá de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setEvidences([]);
    reset();
  };

  if (result?.success) {
    return (
      <SubmissionSuccess
        applicationId={result.applicationId}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Solicitar crédito
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completá el formulario y subí tus comprobantes. Un asesor los
          revisará.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Personal info ── */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground">
            Información personal
          </h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Nombre completo
            </label>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Ej: María Quispe Huanca"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Teléfono
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Ej: 76543210"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">NIT</label>
            <div className="flex gap-2">
              <input
                {...register("nit", { valueAsNumber: true })}
                type="tel"
                placeholder="Ej: 12345678"
                className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <select
                {...register("nitComplement")}
                className="w-28 shrink-0 rounded-lg border bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:w-44"
              >
                <option value="">Compl.</option>
                {NIT_COMPLEMENTS.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {errors.nit && (
              <p className="text-xs text-destructive">{errors.nit.message}</p>
            )}
            {errors.nitComplement && (
              <p className="text-xs text-destructive">
                {errors.nitComplement.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Business info ── */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground">
            Información del negocio
          </h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Actividad económica
            </label>
            <select
              {...register("economicActivity")}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">Seleccioná una actividad</option>
              {ACTIVITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.economicActivity && (
              <p className="text-xs text-destructive">
                {errors.economicActivity.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Monto solicitado{" "}
              <span className="text-muted-foreground font-normal">(en Bs)</span>
            </label>
            <input
              {...register("requestedAmount", { valueAsNumber: true })}
              type="number"
              min={500}
              placeholder="Ej: 8000"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {errors.requestedAmount && (
              <p className="text-xs text-destructive">
                {errors.requestedAmount.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Descripción del negocio
            </label>
            <textarea
              {...register("businessDescription")}
              rows={3}
              placeholder="Contá brevemente a qué te dedicás, hace cuánto tiempo y dónde estás ubicado."
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {errors.businessDescription && (
              <p className="text-xs text-destructive">
                {errors.businessDescription.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Dirección exacta
            </label>
            <input
              {...register("address")}
              type="text"
              placeholder="Ej: Calle Comercio 234, El Alto, La Paz"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Evidence ── */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Comprobantes y evidencias
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Subí fotos de tu cuaderno de ventas, pagos QR, recibos u otro
              comprobante que valide tus ingresos.
            </p>
          </div>
          <EvidenceUploader evidences={evidences} onChange={setEvidences} />
        </div>

        {/* ── Submit ── */}
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Procesando solicitud...
            </>
          ) : (
            <>
              <SendIcon className="h-4 w-4" />
              Enviar solicitud
            </>
          )}
        </button>
      </form>
    </div>
  );
}
