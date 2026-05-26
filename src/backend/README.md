# Backend (src/backend)

Código que **solo debe ejecutarse en servidor**: Firebase Admin, pagos, validaciones.

## Estructura

```
backend/
├── firebase/
│   └── admin.ts          # Firebase Admin SDK
└── payments/
    ├── payment-config.ts # Planes y montos
    ├── firestore-schema.ts
    ├── qr-payment.ts     # Sesiones QR y órdenes
    ├── solana-pay.ts
    └── verify-payment.ts
```

## Consumidores

- `src/app/api/payments/qr/*`
- `src/app/api/whatsapp/send`
- Futuros Server Actions o jobs

## Import recomendado

```ts
import { db } from '@/backend/firebase/admin';
import { upsertVisaCryptoSession } from '@/backend/payments/qr-payment';
```

## Compatibilidad

`@/lib/payments/*` y `@/lib/firebase-admin` re-exportan este módulo. Preferir `@/backend/*` en código nuevo.

## Deploy

Este código se ejecuta en **Vercel** (API Routes), no en Cloud Functions.

- Guía completa: [deploy/platforms/vercel.md](../../deploy/platforms/vercel.md)
- Variables: [deploy/env/.env.web.example](../../deploy/env/.env.web.example)
- Firestore/Functions: [deploy/platforms/firebase.md](../../deploy/platforms/firebase.md)
