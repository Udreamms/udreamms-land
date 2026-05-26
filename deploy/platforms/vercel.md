# Vercel — Despliegue del frontend y API Routes

## Qué se despliega aquí

- **100% del código Next.js** en la raíz del repo (`package.json`, `src/`, `next.config.mjs`).
- Config mínima: `vercel.json` → `{ "framework": "nextjs" }`.

No se despliegan en Vercel:

- Cloud Functions (`functions/`) → Firebase.
- Reglas Firestore/Storage → Firebase CLI.

## Conexión con Firebase

La app en Vercel es **cliente + servidor ligero**:

| En Vercel | Conecta a Firebase vía |
|-----------|------------------------|
| Páginas con `"use client"` | `src/lib/firebase.ts` (SDK público) |
| `/api/payments/*`, `/api/whatsapp/*` | `src/backend/firebase/admin.ts` (service account env vars) |

El proyecto Firebase sigue siendo **`udreamms-platform-1`**.

## Variables de entorno en Vercel

Dashboard → Project → **Settings → Environment Variables**.

Copia desde [deploy/env/.env.web.example](../env/.env.web.example).

Mínimo para pagos + API:

| Variable | Entorno | Descripción |
|----------|---------|-------------|
| `FIREBASE_PROJECT_ID` | Production, Preview | `udreamms-platform-1` |
| `FIREBASE_CLIENT_EMAIL` | Production, Preview | Service account |
| `FIREBASE_PRIVATE_KEY` | Production, Preview | Clave privada (pegar con `\n` o multilínea) |
| `NEXT_PUBLIC_TREASURY_WALLET` | Production | Wallet Solana recepción |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Production | RPC mainnet |
| `NEXT_PUBLIC_LXR_USD_PRICE` | Production | Precio LXR si aplica |
| `WHATSAPP_ACCESS_TOKEN` | Production | API route send |
| `WHATSAPP_PHONE_NUMBER_ID` | Production | API route send |

`NEXT_PUBLIC_*` se exponen al navegador; no poner secretos ahí.

## Deploy

### Automático (recomendado)

1. Conectar repositorio Git en Vercel.
2. Framework preset: **Next.js**.
3. Build command: `npm run build` (default).
4. Install command: `npm install` (ejecuta `postinstall` / patch-package).

Cada push a la rama de producción genera deploy.

### Manual

```bash
npx vercel
npx vercel --prod
```

## Dominios

Ejemplo producción: `udreamms-land.vercel.app`.

Añadir dominio custom en Vercel y en Firebase Auth → Authorized domains.

## `next.config.mjs`

- Imágenes remotas permitidas (Unsplash, placeholders).
- Header `Cross-Origin-Opener-Policy` para popups (pagos / OAuth).
- Redirects SEO en código: legacy `/cso/*`, `/suite/*`, aliases en español, `/login` → `/portal`. **Dominio www/apex solo en Vercel Domains** (evita bucles).
- Sitemap y robots: `src/app/sitemap.ts`, `src/app/robots.ts` (ver [deploy/SEO_LAUNCH.md](../SEO_LAUNCH.md)).

## Verificación post-deploy

1. `GET /` carga sin error.
2. `/visas/tourist` y planes visibles.
3. `/instructions-payment-tourist?plan=premium` — flujo UI.
4. `POST /api/payments/qr/create` — 200 con body válido (probar en staging).
5. `/portal` — login Firebase.

Logs: Vercel → Deployments → Functions / Runtime Logs.

## Build local (mismo que Vercel)

```bash
npm run build
npm run start
```

Si falla TypeScript o lint, Vercel también fallará.
