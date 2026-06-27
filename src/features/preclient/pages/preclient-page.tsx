import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EvidenceUploader } from '../components/evidence-uploader'
import { SubmissionSuccess } from '../components/submission-success'
import { submitApplication } from '../services/preclient.mock-service'
import type { UploadedEvidence } from '../types/preclient.types'
import { SendIcon } from 'lucide-react'

const schema = z.object({
  fullName: z.string().min(3, 'El nombre completo es obligatorio'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  economicActivity: z.string().min(3, 'La actividad económica es obligatoria'),
  requestedAmount: z
    .number()
    .min(500, 'El monto mínimo es Bs 500'),
  businessDescription: z.string().min(10, 'Describí brevemente tu negocio'),
})

type FormData = z.infer<typeof schema>

const ACTIVITY_OPTIONS = [
  'Tienda de abarrotes',
  'Venta de comida',
  'Comercio por WhatsApp',
  'Almacén / depósito',
  'Ropa y accesorios',
  'Ferretería',
  'Farmacia / cosmética',
  'Servicio técnico',
  'Transporte',
  'Agricultura',
  'Otro',
]

export function PreclientPage() {
  const [evidences, setEvidences] = useState<UploadedEvidence[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; applicationId: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const res = await submitApplication(data, evidences)
      setResult(res)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setEvidences([])
    reset()
  }

  if (result?.success) {
    return <SubmissionSuccess applicationId={result.applicationId} onReset={handleReset} />
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Solicitar crédito</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completá el formulario y subí tus comprobantes. Un asesor los revisará.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Personal info card */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Información personal</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nombre completo</label>
            <input
              {...register('fullName')}
              type="text"
              placeholder="Ej: María Quispe Huanca"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Teléfono</label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Ej: 76543210"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Business info card */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Información del negocio</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Actividad económica</label>
            <select
              {...register('economicActivity')}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccioná una actividad</option>
              {ACTIVITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.economicActivity && (
              <p className="text-xs text-red-600">{errors.economicActivity.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Monto solicitado <span className="text-muted-foreground">(en Bs)</span>
            </label>
            <input
              {...register('requestedAmount', { valueAsNumber: true })}
              type="number"
              min={500}
              placeholder="Ej: 8000"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.requestedAmount && (
              <p className="text-xs text-red-600">{errors.requestedAmount.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descripción del negocio</label>
            <textarea
              {...register('businessDescription')}
              rows={3}
              placeholder="Contá brevemente a qué te dedicás, hace cuánto tiempo y dónde estás ubicado."
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.businessDescription && (
              <p className="text-xs text-red-600">{errors.businessDescription.message}</p>
            )}
          </div>
        </div>

        {/* Evidence card */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Comprobantes y evidencias</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Subí fotos de tu cuaderno de ventas, pagos QR, recibos u otro comprobante.
            </p>
          </div>
          <EvidenceUploader evidences={evidences} onChange={setEvidences} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Enviando solicitud...
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
  )
}
