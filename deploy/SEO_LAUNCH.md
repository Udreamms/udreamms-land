# SEO — Lanzamiento en Google Search Console

Checklist tras desplegar en Vercel (producción en `https://udreamms.com`).

## Verificación técnica (5 min)

- [ ] `https://udreamms.com/` → 200
- [ ] `https://www.udreamms.com/` → 301 a `https://udreamms.com/`
- [ ] `https://udreamms.com/robots.txt` → incluye `Sitemap: https://udreamms.com/sitemap.xml`
- [ ] `https://udreamms.com/sitemap.xml` → 14 URLs públicas
- [ ] `https://udreamms.com/cso` → 301 a `/`
- [ ] Vercel → Domains: `udreamms.com` + `www` con SSL válido

## Google Search Console

1. Propiedad: `https://udreamms.com` (o dominio `udreamms.com` con TXT en Squarespace).
2. **Sitemaps** → enviar `https://udreamms.com/sitemap.xml`.
3. **Inspección de URLs** → probar e indexar:
   - `/`
   - `/visas/student`
   - `/visas/tourist`
   - `/contact`
4. **Páginas** → revisar 404; por cada URL antigua con tráfico, añadir 301 en `next.config.mjs` y volver a solicitar indexación.
5. No uses “Eliminación temporal” salvo URLs que deban desaparecer ya (sin sustituto).

## Firebase (mismo dominio)

- Auth → dominios autorizados: `udreamms.com`, `www.udreamms.com`.
- No desplegar Firebase Hosting en el mismo dominio que Vercel.

## Mantenimiento

- Rutas públicas nuevas: añadir en `src/lib/seo.ts` (`PUBLIC_SITEMAP_ROUTES` + `PAGE_SEO`) y crear `layout.tsx` con `pageMetadata`.
- Rutas privadas: `noindexMetadata` en su `layout.tsx` + `disallow` en `robots.ts` si aplica.
