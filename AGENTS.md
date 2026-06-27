# AGENTS.md — Caja Inteligente Frontend (sync-web)

## Project Context

This repository is the **web frontend** for **Caja Inteligente Bolivia**, a hackathon MVP.

> Note: An older `README.md` described this as a Flutter/Drift/Cubit mobile app. That was never
> the real implementation. The actual app is a **React 19 + TypeScript + Vite** single-page app.
> This document is the source of truth for the frontend.

Caja Inteligente helps a credit advisor structure the financial information of informal merchants.
The frontend has two roles, switched in the header (no auth, no users):

- **Precliente** — an applicant fills a form (personal + business data) and uploads evidence
  images (sales notebook, QR receipts, purchase receipts), then submits a credit application.
- **Asesor de crédito** — reviews applications: lists/filters them, opens a detail view with the
  AI-extracted financial summary, evidences and transactions; can add/edit/reject transactions,
  add more evidence, write notes, and change the application status.

The frontend talks to the **sync-core** backend (FastAPI) over HTTP. There is no local database.

## Tech Stack

- React 19 + TypeScript
- Vite (build/dev) — package manager is **pnpm**
- TanStack Router (file-based routing, `src/routes/`)
- TanStack Query (server state: queries + mutations)
- react-hook-form + zod (forms/validation)
- Tailwind CSS v4 + shadcn/ui + lucide-react / hugeicons

Do not introduce: Flutter/Dart, Redux, a client-side database, auth/login, or a real-time sync engine.

## Architecture

Simplified layered structure under `src/`:

```
src/
├── routes/                 # TanStack file-based routes (thin; render feature pages)
├── features/
│   ├── preclient/          # applicant flow: pages, components, services, types
│   └── advisor/            # advisor flow: pages, components, services, types
└── shared/
    ├── api/                # API layer: client.ts, dto.ts, mappers.ts  (the ONLY place that calls the backend)
    ├── components/         # cross-feature UI (header, badges, cards, empty-state)
    ├── lib/                # formatters (es-BO currency/date), cn()
    └── types/              # view-model types + enums/label maps
```

Rules:
- **Only `shared/api/` may call the backend.** Feature `services/*.ts` wrap `shared/api` for their domain.
- Components render UI and dispatch actions; they must not call `fetch` directly.
- All user-facing text and error messages are in **Spanish** (es-BO). Use `shared/lib/formatters.ts`
  for money (`Bs`) and dates.
- Avoid vague names (`Manager`, `Helper`, `DataService`). Prefer `advisorService`, `transactionsPanel`, etc.

## Backend Integration Contract

Base URL comes from `VITE_API_BASE_URL` (e.g. `http://localhost:8000/api/v1`). The backend returns
**raw JSON objects** on success and `{"error": {"code","message","details"}}` on failure.
Money is returned as **strings** ("8000.00"); status/risk/etc. come as **raw value + Spanish label**.

Endpoints consumed:

```
POST  /managements                    (multipart: customer fields + optional files[])  -> management detail
GET   /managements?status=...         -> { items: [...] }
GET   /managements/{id}               -> management detail
POST  /managements/{id}/evidence      (multipart: files[])                            -> management detail
POST  /managements/{id}/transactions  (json manual tx)                                -> { transaction, financial_summary }
PATCH /transactions/{id}              (json edit)                                      -> { transaction, financial_summary }
POST  /transactions/{id}/reject                                                       -> { transaction_id, financial_summary }
PATCH /managements/{id}/advisor-notes (json { advisor_notes })
PATCH /managements/{id}/status        (json { status })
```

Field mapping (frontend camelCase view-model ⇄ backend snake_case DTO) lives in
`src/shared/api/mappers.ts`:

| Frontend view-model        | Backend DTO field                         |
|----------------------------|-------------------------------------------|
| `preclientName`            | `customer.full_name`                      |
| `phone`                    | `customer.phone_number`                   |
| `nit`                      | `customer.nit`                            |
| `economicActivity`         | `customer.business_type`                  |
| `businessDescription`      | `customer.business_description`           |
| `address`                  | `customer.market_location`                |
| `requestedAmount` (number) | `requested_amount` (string)               |
| `status` + display label   | `status` (raw) + `status_label`           |
| `summary.*` (numbers)      | `financial_summary.*` (money strings/labels) |
| `evidences[]`              | `evidences[]` (filename/document_type_label/status_label/detected_amount/confidence_score/extracted_text) |
| `transactions[]`           | `transactions[]`                          |
| `alerts: {level,message,evidenceId}[]` | `alerts: [{level, message, evidence_id}]` — `evidence_id` links the alert to an evidence (shown on its card); `null` = general alert |
| `advisorNotes`             | `advisor_notes`                           |

Status raw values: `pending | in_review | observed | ready_for_analysis` (filter also allows `all`).

## Run

```
pnpm install
# .env:
#   VITE_API_BASE_URL=http://localhost:8000/api/v1
pnpm dev        # http://localhost:5173
pnpm build      # tsc -b && vite build
pnpm lint
```

## UI Style

Fintech-clean: light background, dark primary, rounded white cards with soft shadows, lime accent.
Keep spacing structured. Keep components small and readable.
