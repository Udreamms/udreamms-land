# App Router (`src/app`)

Capa de **rutas URL**. Cada carpeta = una página o endpoint API.

## Reglas

- `page.tsx` — composición de secciones; mantener delgado.
- `_components/` — solo secciones **publicadas** en esa URL.
- `secciones-ocultar/` — secciones **archivadas** listas para activar (ver README local).
- `api/` — delegar lógica a `@/backend/*`.

## Mapa rápido

Ver `docs/ARCHITECTURE.md` para el mapa completo de rutas y flujos.
