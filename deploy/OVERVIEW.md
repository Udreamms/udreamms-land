# Visión general del despliegue

## Arquitectura en producción

```mermaid
flowchart TB
  subgraph Users[Usuarios]
    Browser[Navegador]
  end

  subgraph Vercel[Vercel — Web]
    Next[Next.js 16]
    API["API Routes /api/*"]
  end

  subgraph Firebase[Firebase — udreamms-platform-1]
    FS[(Firestore)]
    Auth[Authentication]
    ST[Storage]
    CF[Cloud Functions]
  end

  subgraph External[Servicios externos]
    Stripe[Stripe Checkout]
    Solana[Solana RPC]
    Meta[WhatsApp Cloud API]
  end

  Browser --> Next
  Next --> API
  API --> FS
  API --> Solana
  Next --> Auth
  Next --> FS
  Next --> ST
  API --> Stripe
  CF --> FS
  CF --> Meta
  Browser -.->|webhooks| CF
```

## Qué corre en cada sitio

### Vercel (aplicación web)

- Páginas marketing: `/`, `/visas/*`, `/instructions-payment-*`, etc.
- Portal y formularios que usan **Firebase Client SDK** en el navegador.
- **API Routes** que necesitan secreto de servidor:
  - `/api/payments/qr/*` — pagos crypto (Firestore Admin + Solana).
  - `/api/whatsapp/send` — envío WhatsApp desde la web.

Build: `npm run build` → salida `.next/`.

### Firebase (datos y automatización)

| Servicio | Uso en uDreamms |
|----------|-----------------|
| **Firestore** | Órdenes crypto, sesiones QR, datos de aplicación/onboarding, mensajes |
| **Authentication** | `/portal` (email/password) |
| **Storage** | Subidas de archivos (hooks, formularios) |
| **Cloud Functions** | Webhooks WhatsApp, Google Forms, callables, kanban |
| **Hosting (opcional)** | `firebase.json` tiene `frameworksBackend` — alternativa a Vercel para el mismo Next |

Región Firestore configurada: **nam5** (ver `firebase.json`).

### Firebase Studio / IDX

- Entorno de desarrollo en la nube (`.idx/dev.nix` → `npm run dev`).
- Mismo proyecto Firebase `udreamms-platform-1` para probar Auth y Firestore.
- No sustituye el deploy: es **dev**; producción sigue siendo Vercel + `firebase deploy`.

## Orden recomendado de despliegue (release)

1. **Reglas** Firestore y Storage (`deploy:firebase:rules`) si cambiaron.
2. **Cloud Functions** si cambió `functions/`.
3. **Variables** en Vercel y Firebase Functions (ver [env/README.md](./env/README.md)).
4. **Web** en Vercel (git push o deploy manual).
5. Smoke test: home, plan turista, crear QR crypto, portal login.

## Entornos

| Entorno | Web | Firebase project | Notas |
|---------|-----|------------------|-------|
| Local | `localhost:3000` | Mismo proyecto o emuladores | `serviceAccountKey.json` o env Admin |
| Producción | `udreamms-land.vercel.app` (ej.) | `udreamms-platform-1` | Env en Vercel Dashboard |

Ideal a futuro: proyecto Firebase `udreamms-staging` para pruebas (hoy solo `production` en `.firebaserc`).
