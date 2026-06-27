import { useRef } from 'react'
import { UploadCloudIcon, XIcon, BookOpenIcon, QrCodeIcon, ReceiptIcon, FileTextIcon, PackageIcon, FileIcon } from 'lucide-react'
import type { UploadedEvidence } from '../types/preclient.types'
import type { EvidenceType } from '@/shared/types/common'

const EVIDENCE_TYPES: EvidenceType[] = [
  'Cuaderno de ventas',
  'Comprobante QR',
  'Recibo',
  'Factura',
  'Inventario',
  'Otro',
]

const typeIcons: Record<EvidenceType, React.ReactNode> = {
  'Cuaderno de ventas': <BookOpenIcon className="h-4 w-4" />,
  'Comprobante QR': <QrCodeIcon className="h-4 w-4" />,
  Recibo: <ReceiptIcon className="h-4 w-4" />,
  Factura: <FileTextIcon className="h-4 w-4" />,
  Inventario: <PackageIcon className="h-4 w-4" />,
  Otro: <FileIcon className="h-4 w-4" />,
}

interface EvidenceUploaderProps {
  evidences: UploadedEvidence[]
  onChange: (evidences: UploadedEvidence[]) => void
}

export function EvidenceUploader({ evidences, onChange }: EvidenceUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const newItems: UploadedEvidence[] = Array.from(files).map((file) => ({
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      type: 'Otro' as EvidenceType,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))
    onChange([...evidences, ...newItems])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleTypeChange = (id: string, type: EvidenceType) => {
    onChange(evidences.map((ev) => (ev.id === id ? { ...ev, type } : ev)))
  }

  const handleRemove = (id: string) => {
    onChange(evidences.filter((ev) => ev.id !== id))
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-8 text-center transition-colors hover:border-primary hover:bg-muted/70"
      >
        <UploadCloudIcon className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Subir comprobantes y evidencias</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Arrastrá archivos acá o hacé clic para seleccionar · Fotos (JPG, PNG, WEBP)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Uploaded files */}
      {evidences.length > 0 && (
        <div className="space-y-2">
          {evidences.map((ev) => (
            <div key={ev.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              {ev.previewUrl ? (
                <img
                  src={ev.previewUrl}
                  alt={ev.file.name}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover border"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {typeIcons[ev.type]}
                </div>
              )}

              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="truncate text-sm text-foreground">{ev.file.name}</p>
                <select
                  value={ev.type}
                  onChange={(e) => handleTypeChange(ev.id, e.target.value as EvidenceType)}
                  className="w-full rounded-md border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {EVIDENCE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(ev.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
