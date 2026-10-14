# Ülesannete haldur (Next.js + Supabase)

Täisstack veebirakendus ülesannete haldamiseks. Frontend on tehtud Reacti/Next.js-iga ja backend Next.js API route'idega. Andmed hoitakse Supabase'i (PostgreSQL) andmebaasis.

## Funktsionaalsus

- Ülesannete lisamine (pealkiri, kirjeldus, prioriteet, tähtaeg)
- Ülesannete vaatamine ja filtreerimine (kõik / pooleli / tehtud)
- Ülesande märkimine tehtuks ja tagasi
- Pealkirja muutmine topeltklõpsuga
- Ülesande kustutamine
- Hilinenud tähtaegade esiletõstmine
- Sisendi valideerimine nii frontendis kui ka backendis

## Tehnoloogiad

| Kiht | Tehnoloogia |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js Route Handlers (REST API) |
| Andmebaas | Supabase (PostgreSQL), `@supabase/supabase-js` |

## Arhitektuur

```
Brauser (React)  ──fetch──▶  Next.js API (/api/tasks)  ──supabase-js──▶  Supabase PostgreSQL
```

Frontend ei suhtle andmebaasiga otse. Kõik päringud käivad läbi backendi, mis:
1. valideerib sisendi (`src/lib/validation.ts`),
2. suhtleb Supabase'iga serveripoolse võtmega (`src/lib/supabase.ts`),
3. tagastab JSON-vastuse koos õige HTTP staatuskoodiga.

Tabelil on **Row Level Security** sisse lülitatud ilma poliitikateta. See tähendab, et avaliku võtmega ei pääse andmetele ligi, ainult backendi kaudu.

## Projekti struktuur

```
src/
├── app/
│   ├── api/tasks/
│   │   ├── route.ts          # GET (nimekiri), POST (loo)
│   │   └── [id]/route.ts     # GET, PATCH, DELETE (üks ülesanne)
│   ├── layout.tsx
│   ├── page.tsx              # Avaleht (kliendikomponent)
│   └── globals.css
├── components/
│   ├── TaskForm.tsx          # Uue ülesande vorm
│   ├── TaskItem.tsx          # Üks rida nimekirjas
│   └── FilterTabs.tsx        # Filtrid
├── lib/
│   ├── api.ts                # Frontendi fetch-funktsioonid
│   ├── supabase.ts           # Serveripoolne Supabase'i klient
│   └── validation.ts         # Sisendi valideerimine
└── types/task.ts             # TypeScripti tüübid
supabase/schema.sql           # Andmebaasi skeem + näidisandmed
```

## API

| Meetod | URL | Kirjeldus | Vastus |
|---|---|---|---|
| GET | `/api/tasks?status=all\|active\|completed` | Ülesannete nimekiri | 200 |
| POST | `/api/tasks` | Loo ülesanne | 201 / 400 |
| GET | `/api/tasks/:id` | Üks ülesanne | 200 / 404 |
| PATCH | `/api/tasks/:id` | Muuda ülesannet | 200 / 400 / 404 |
| DELETE | `/api/tasks/:id` | Kustuta ülesanne | 204 / 404 |

Näide:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Osta piima","priority":"low","due_date":"2026-10-20"}'
```

## Käivitamine

### 1. Supabase
1. Loo tasuta projekt aadressil [supabase.com](https://supabase.com).
2. Ava **SQL Editor**, kleebi sinna `supabase/schema.sql` sisu ja käivita see.
3. Ava **Project Settings → API** ja kopeeri sealt **Project URL** ning **service_role** võti (uuemates projektides **Secret key**).

### 2. Projekt
```bash
npm install
cp .env.example .env.local   # Windowsis: copy .env.example .env.local
```
Täida `.env.local` failis väärtused:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

### 3. Käivita
```bash
npm run dev
```
Ava brauseris http://localhost:3000.

> ⚠️ `.env.local` on `.gitignore`-is ja seda ei tohi GitHubi panna, sest service_role võti annab täieliku ligipääsu andmebaasile.

## Võimalikud edasiarendused

- Kasutajakontod (Supabase Auth), et igal kasutajal oleks oma ülesanded
- Otsing ja sorteerimine tähtaja järgi
- Testid (nt Vitest + API route'ide testid)
