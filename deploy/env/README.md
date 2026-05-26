# Variables de entorno

Separación por **dónde se ejecuta** el código, no por carpeta del repo.

## Plantillas

| Archivo | Dónde configurar | Quién lo lee |
|---------|------------------|--------------|
| [.env.web.example](./.env.web.example) | `.env.local` (dev) · **Vercel Dashboard** (prod) | Next.js `src/` |
| [.env.functions.example](./.env.functions.example) | `firebase functions:config:set` | `functions/` |

## Regla rápida

```
NEXT_PUBLIC_*     → Público (navegador). Solo valores no secretos.
FIREBASE_*        → Secreto. Solo servidor Next (API routes).
WHATSAPP_*        → Secreto. API route /api/whatsapp/send (Vercel).
whatsapp.*        → Secreto. Cloud Functions (Firebase config).
```

## Firebase Client (no van en .env hoy)

La config del SDK web está en `src/lib/firebase.ts` (`apiKey`, `projectId`, etc.).  
Es **pública por diseño** de Firebase; la seguridad está en **Firestore rules** y Auth.

Para mover a env (opcional):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

## Local

```bash
cp deploy/env/.env.web.example .env.local
# Editar valores
npm run dev
```

Nunca commitear `.env.local` (está en `.gitignore`).

## Producción

1. **Vercel:** pegar variables de `.env.web.example` en Settings → Environment Variables.
2. **Functions:** seguir `.env.functions.example` con Firebase CLI.

## Service account local

Alternativa a `FIREBASE_*` en desarrollo:

- Descargar JSON desde Firebase Console.
- Guardar como `serviceAccountKey.json` en la raíz (gitignored).
- `src/backend/firebase/admin.ts` lo detecta automáticamente.
