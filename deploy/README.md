# Despliegue — uDreamms

Punto de entrada para **todo lo que se publica en producción**. El código de la app sigue en `src/`; aquí está **cómo y dónde** se despliega cada pieza.

## Dos plataformas, un mismo proyecto Firebase

| Plataforma | Qué despliega | Proyecto / cuenta |
|------------|---------------|-------------------|
| **Vercel** | Sitio Next.js (UI + API Routes `/api/*`) | Proyecto Vercel enlazado al repo |
| **Firebase** | Firestore, Storage, Cloud Functions, (opcional) Hosting con SSR | `udreamms-platform-1` |

La **base de datos, Auth y Storage** viven en **Firebase** (consola o Firebase Studio / IDX).  
La **web pública** suele ir en **Vercel**, pero usa Firebase como backend de datos y pagos.

## Mapa rápido

```
deploy/
├── README.md                 ← Estás aquí
├── platforms/
│   ├── firebase.md           ← Firestore, Functions, reglas, Studio
│   └── vercel.md             ← Frontend + API Routes en Vercel
├── env/
│   ├── .env.web.example      ← Variables para Next.js (local + Vercel)
│   └── .env.functions.example← Config de Cloud Functions
├── config/
│   └── MANIFEST.md           ← Archivos de config en la raíz del repo
├── scripts/
│   └── README.md             ← Comandos de despliegue
└── CHECKLIST.md              ← Lista antes de cada release
```

## Guías detalladas

1. [Visión general](./OVERVIEW.md) — flujo completo de despliegue  
2. [Firebase (Studio, BD, Functions)](./platforms/firebase.md)  
3. [Vercel (web)](./platforms/vercel.md)  
4. [Variables de entorno](./env/README.md)  
5. [Checklist pre-deploy](./CHECKLIST.md)

## Comandos habituales (desde la raíz del repo)

```bash
# Desarrollo local
npm install
npm run dev

# Solo Cloud Functions
npm run deploy:functions

# Reglas Firestore + Storage
npm run deploy:firebase:rules

# Todo Firebase (functions + rules + hosting SSR si lo usas)
npm run deploy:firebase
```

**Vercel:** push a la rama conectada o `vercel --prod` (ver [vercel.md](./platforms/vercel.md)).

## Relación con el código

| Capa en repo | Despliegue |
|--------------|------------|
| `src/app`, `src/components`, `src/frontend` | Vercel (`next build`) |
| `src/app/api`, `src/backend` | Vercel (serverless Node) |
| `src/lib/firebase.ts` | Cliente → Firebase (config en proyecto) |
| `functions/` | `firebase deploy --only functions` |
| `firestore.rules`, `storage.rules` | `firebase deploy --only firestore,storage` |

Documentación de producto: [docs/INVESTOR_OVERVIEW.md](../docs/INVESTOR_OVERVIEW.md) · Arquitectura: [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
