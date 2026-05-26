# Manifiesto de configuración (raíz del repositorio)

Estos archivos **deben permanecer en la raíz** para que Firebase CLI y Next.js funcionen. La carpeta `deploy/` solo documenta y no los reemplaza.

## Firebase / Google Cloud

| Archivo | Despliegue | Descripción |
|---------|------------|-------------|
| `firebase.json` | `firebase deploy` | Functions, Firestore, Storage, Hosting SSR, emulators |
| `.firebaserc` | CLI | Proyecto `udreamms-platform-1` |
| `firestore.rules` | `firestore` | Reglas de seguridad BD |
| `firestore.indexes.json` | `firestore` | Índices |
| `storage.rules` | `storage` | Reglas archivos |
| `functions/` | `functions` | Cloud Functions (paquete Node aparte) |

## Web (Next.js)

| Archivo | Despliegue | Descripción |
|---------|------------|-------------|
| `package.json` | Vercel / `npm run build` | Dependencias y scripts |
| `next.config.mjs` | Vercel | Imágenes, headers, redirects |
| `vercel.json` | Vercel | Framework Next.js |
| `tsconfig.json` | Build | Paths `@/*`, `@/backend/*`, `@/frontend/*` |
| `tailwind.config.ts` | Build | Estilos |
| `postcss.config.mjs` | Build | PostCSS |
| `components.json` | shadcn | Aliases UI |

## Desarrollo cloud (Firebase Studio / IDX)

| Archivo | Uso |
|---------|-----|
| `.idx/dev.nix` | Entorno IDX: Node 20, preview `npm run dev` |

## Secretos (gitignored)

| Archivo | Uso |
|---------|-----|
| `.env.local` | Desarrollo Next |
| `serviceAccountKey.json` | Admin SDK local |
| `functions/service-account-key.json` | Si se usa en functions (gitignored) |

## Código por capa (referencia)

| Carpeta | Plataforma de ejecución |
|---------|-------------------------|
| `src/app` | Vercel |
| `src/backend` | Vercel (API routes) |
| `src/lib/firebase.ts` | Navegador → Firebase |
| `functions/src` | Google Cloud Functions |
