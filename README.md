# Caja Inteligente — Frontend Web (MVP)

Frontend del MVP **Caja Inteligente**: una herramienta para que un asesor de crédito estructure
la información financiera de comerciantes informales en Bolivia. La app permite crear solicitudes
de crédito, subir evidencias (fotos de cuaderno de ventas, comprobantes QR, recibos), y revisar la
información financiera extraída por IA en el backend.

> ⚠️ Versiones anteriores de este README describían una app Flutter. **No es Flutter.** La
> aplicación real está construida con **React + TypeScript + Vite**. Ver [`AGENTS.md`](./AGENTS.md)
> para la arquitectura y el contrato de integración con el backend.

## Stack

- React 19 + TypeScript + Vite
- TanStack Router (ruteo basado en archivos) y TanStack Query (estado del servidor)
- react-hook-form + zod (formularios)
- Tailwind CSS v4 + shadcn/ui + lucide-react
- Gestor de paquetes: **pnpm**

## Roles (sin login)

- **Precliente:** completa el formulario y sube comprobantes para solicitar un crédito.
- **Asesor de crédito:** lista/filtra solicitudes, abre el detalle, revisa el resumen financiero,
  evidencias y transacciones; agrega/edita/rechaza transacciones, agrega evidencia, escribe notas y
  cambia el estado.

## Requisitos

- Node 20+ y pnpm
- El backend **sync-core** corriendo (por defecto en `http://localhost:8000`)

## Puesta en marcha

```bash
pnpm install

# Configurar la URL del backend
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env

pnpm dev      # http://localhost:5173
```

## Scripts

```bash
pnpm dev      # servidor de desarrollo
pnpm build    # tsc -b && vite build
pnpm preview  # previsualizar el build
pnpm lint     # eslint
```

## Estructura

```
src/
├── routes/        # rutas (delgadas) que renderizan páginas de features
├── features/
│   ├── preclient/ # flujo del solicitante
│   └── advisor/   # flujo del asesor
└── shared/
    ├── api/       # cliente HTTP, DTOs y mappers (única capa que llama al backend)
    ├── components/
    ├── lib/       # formateadores es-BO, cn()
    └── types/     # view-models, enums y etiquetas
```

Toda la interfaz y los mensajes están en **español**. La integración con el backend (endpoints,
mapeo de campos, formatos de dinero y estados) está documentada en [`AGENTS.md`](./AGENTS.md).
