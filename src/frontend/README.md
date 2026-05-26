# Frontend (src/frontend)

Organización **por módulo de producto** y secciones ocultas. Las rutas siguen en `src/app/` (requisito de Next.js).

## Estructura

```
frontend/
├── modules/
│   ├── marketing/
│   │   └── home/
│   │       └── secciones-ocultar/   # Home: Services, WhyChooseUs, etc.
│   └── visas/                       # Documentación; páginas en app/visas/*
└── legacy/
    └── suite/                       # Automatización CSO (sin rutas activas)
```

## Secciones visibles vs ocultas (visas)

| Ruta app | Componentes activos | Ocultas |
|----------|---------------------|---------|
| `app/visas/tourist` | `_components/` | `secciones-ocultar/` |
| `app/visas/student` | `_components/` | `secciones-ocultar/` |

## UI compartida

La mayoría de componentes reutilizables están en:

- `src/components/landing/` — Header, Footer, showcases
- `src/components/payments/` — Checkout crypto, instrucciones de pago
- `src/components/ui/` — shadcn

## Import

```tsx
import Services from "@/frontend/modules/marketing/home/secciones-ocultar/Services";
```

Alias: `@/frontend/*` en `tsconfig.json`.
