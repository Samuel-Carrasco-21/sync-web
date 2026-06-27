import { useState } from 'react'
import { CheckIcon } from 'lucide-react'

interface AdvisorNotesProps {
  initialNotes?: string
  onSave: (notes: string) => void
}

export function AdvisorNotes({ initialNotes = '', onSave }: AdvisorNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave(notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isDirty = notes !== initialNotes

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Observaciones del asesor
      </h2>
      <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            setSaved(false)
          }}
          placeholder="Escribir observaciones, comentarios o indicaciones para el análisis crediticio..."
          rows={4}
          className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex items-center justify-between">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-700">
              <CheckIcon className="h-3.5 w-3.5" />
              Observación guardada
            </span>
          )}
          {!saved && <span />}
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
