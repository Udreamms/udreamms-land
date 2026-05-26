# Firebase — Base de datos, Auth, Functions

Proyecto por defecto: **`udreamms-platform-1`** (`.firebaserc`).

## Consola y Firebase Studio

| Recurso | Enlace / ubicación |
|---------|-------------------|
| Consola Firebase | https://console.firebase.google.com/project/udreamms-platform-1 |
| Firestore | Build → Firestore Database |
| Authentication | Build → Authentication |
| Storage | Build → Storage |
| Functions | Build → Functions |
| Firebase Studio / IDX | Carpeta `.idx/` en el repo — preview web con `npm run dev` |

### Desarrollo con Firebase Studio (IDX)

- Config: `.idx/dev.nix` (Node 20, preview web).
- El cliente web usa `src/lib/firebase.ts` (`firebaseConfig` con `projectId: udreamms-platform-1`).
- Los datos que ves en Studio son los mismos de Firestore del proyecto (cuidado en producción).

## Archivos de configuración (raíz del repo)

Firebase CLI **exige** estos paths en la raíz (no mover sin actualizar `firebase.json`):

| Archivo | Función |
|---------|---------|
| `firebase.json` | Functions, hosting SSR, Firestore, emulators |
| `.firebaserc` | Alias de proyecto |
| `firestore.rules` | Seguridad Firestore |
| `firestore.indexes.json` | Índices compuestos |
| `storage.rules` | Seguridad Storage |
| `functions/` | Código Cloud Functions |

Detalle: [deploy/config/MANIFEST.md](../config/MANIFEST.md).

## Firestore

- **Región:** `nam5` (`firebase.json` → `firestore.location`).
- **Reglas:** desplegar con `npm run deploy:firebase:rules`.
- **Esquema pagos crypto:** documentado en [docs/firestore-crypto-payments.md](../../docs/firestore-crypto-payments.md).
- **Código servidor:** `src/backend/payments/firestore-schema.ts`.

### Índices

Si una query falla en producción con “index required”, crea el índice en consola o en `firestore.indexes.json` y vuelve a desplegar reglas/índices.

## Authentication

Usado en `src/app/portal/page.tsx` vía `src/lib/firebase.ts`.

En consola Firebase:

1. Habilitar proveedor **Email/Password** (o los que uses).
2. Dominios autorizados: localhost, dominio Vercel, dominio custom.

## Storage

Reglas en `storage.rules`. Despliegue junto con Firestore:

```bash
npm run deploy:firebase:rules
```

## Cloud Functions (`functions/`)

### Build y deploy

```bash
cd functions && npm install && npm run build
cd .. && npm run deploy:functions
# equivalente: firebase deploy --only functions
```

Runtime: **Node.js 20** (`firebase.json`).

### Funciones exportadas (`functions/src/index.ts`)

- Callables: mensajes WhatsApp.
- HTTP: webhooks WhatsApp, Google Forms.
- Kanban: `moveCard`.

### Configuración (secrets)

Las Functions usan **`functions.config()`** (legacy), no `.env`:

```bash
firebase functions:config:set whatsapp.access_token="..." whatsapp.phone_number_id="..." whatsapp.verify_token="..."
```

Plantilla: [deploy/env/.env.functions.example](../env/.env.functions.example).

Ver valores actuales:

```bash
firebase functions:config:get
```

### Emuladores (local)

```bash
firebase emulators:start
```

Puertos en `firebase.json`: Functions `5001`, UI `4000`.

## Hosting Firebase (alternativa a Vercel)

`firebase.json` incluye:

```json
"hosting": { "source": ".", "frameworksBackend": { "region": "us-central1" } }
```

Permite desplegar el mismo Next con **Firebase App Hosting / frameworks**.  
Si producción usa **solo Vercel**, no hace falta `firebase deploy --only hosting`; mantén Functions + Firestore en Firebase.

## Credenciales Admin para API Routes (Vercel)

Next.js en Vercel **no** usa `functions.config()`; usa variables de entorno:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Cómo obtenerlas: Firebase Console → Project settings → Service accounts → Generate new private key.  
Copiar a Vercel (ver [vercel.md](./vercel.md)).

Local: mismo trio en `.env.local` o archivo `serviceAccountKey.json` (gitignored).

## Checklist Firebase

- [ ] Reglas Firestore/Storage revisadas y desplegadas
- [ ] Índices Firestore al día
- [ ] `functions.config` WhatsApp configurado
- [ ] Service account en Vercel para API routes
- [ ] Dominios Auth autorizados
