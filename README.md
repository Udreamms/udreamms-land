# uDreamms Platform

Plataforma web para gestión de visas (turista y estudiante), pagos (Stripe + Solana) y operaciones con Firebase.

## Estructura del repositorio

| Carpeta | Rol |
|---------|-----|
| [`src/app/`](src/app/README.md) | Rutas Next.js (páginas + API) |
| [`src/backend/`](src/backend/README.md) | Lógica servidor: pagos, Firebase Admin |
| [`src/frontend/`](src/frontend/README.md) | Módulos UI y `secciones-ocultar` |
| [`src/components/`](src/components/) | UI compartida (landing, payments, shadcn) |
| [`functions/`](functions/) | Firebase Cloud Functions |
| [`deploy/`](deploy/README.md) | **Despliegue:** Vercel, Firebase Studio/BD, env, checklist |
| [`docs/`](docs/) | Arquitectura y documentación para inversores |

## Documentación clave

- **[Despliegue](deploy/README.md)** — Vercel (web) + Firebase (Firestore, Auth, Functions, Studio)
- **[Resumen para inversores](docs/INVESTOR_OVERVIEW.md)** — qué es el producto, flujos y stack
- **[Arquitectura](docs/ARCHITECTURE.md)** — capas, módulos e interacción entre sistemas
- **[Pagos crypto Firestore](docs/firestore-crypto-payments.md)** — esquema de datos

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción (mismo que Vercel) |
| `npm run deploy:functions` | Cloud Functions → Firebase |
| `npm run deploy:firebase:rules` | Reglas Firestore + Storage |
| `npm run deploy:firebase` | Functions + reglas + storage |

## Secciones ocultas

Las landings guardan bloques no publicados en `secciones-ocultar/` junto a cada ruta (ej. `src/app/visas/tourist/secciones-ocultar/`). Cada carpeta incluye un README con instrucciones para reactivarlas.

## Variables de entorno

```bash
cp deploy/env/.env.web.example .env.local
```

Functions (WhatsApp webhooks): ver [deploy/env/.env.functions.example](deploy/env/.env.functions.example).
