import { CheckCircleIcon, ClipboardListIcon } from 'lucide-react'

interface SubmissionSuccessProps {
  applicationId: string
  onReset: () => void
}

export function SubmissionSuccess({ applicationId, onReset }: SubmissionSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircleIcon className="h-9 w-9 text-green-600" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground">¡Solicitud enviada!</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Tus datos y comprobantes fueron recibidos. Un asesor de crédito los revisará en breve.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-card px-5 py-4 shadow-sm">
        <ClipboardListIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="text-left">
          <p className="text-xs text-muted-foreground">Número de solicitud</p>
          <p className="font-mono text-sm font-semibold text-foreground">{applicationId}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/50 p-4 text-left text-sm text-muted-foreground max-w-sm space-y-2">
        <p className="font-medium text-foreground">Próximos pasos:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>El asesor revisará tu solicitud</li>
          <li>Si hay algo pendiente, te contactarán al número que indicaste</li>
          <li>Recibirás una respuesta en los próximos días hábiles</li>
        </ol>
      </div>

      <button
        onClick={onReset}
        className="rounded-lg border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        Enviar otra solicitud
      </button>
    </div>
  )
}
