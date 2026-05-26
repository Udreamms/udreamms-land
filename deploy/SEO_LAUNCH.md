# SEO — Lanzamiento en Google Search Console

Checklist tras desplegar en Vercel (producción en `https://udreamms.com`).

## Dominio canónico en Vercel (obligatorio, una sola vez)

En **Vercel → Project → Settings → Domains**:

1. Añade `udreamms.com` y `www.udreamms.com` si faltan.
2. Elige **un** dominio principal (recomendado: `udreamms.com` sin www).
3. En el otro dominio, usa la opción de Vercel **Redirect to** el principal (no configures lo mismo en `next.config.mjs`).
4. Si ves `ERR_TOO_MANY_REDIRECTS`, suele ser apex y www redirigiendo uno al otro: deja el redirect **solo en Vercel**, no en código.

## Verificación técnica (5 min)

- [ ] `https://udreamms.com/` → 200
- [ ] `https://www.udreamms.com/` → 301 **una vez** al dominio principal (sin bucle)
- [ ] `https://udreamms.com/robots.txt` → incluye `Sitemap: https://udreamms.com/sitemap.xml`
- [ ] `https://udreamms.com/sitemap.xml` → 14 URLs públicas
- [ ] `https://udreamms.com/cso` → 301 a `/`
- [ ] Vercel → Domains: `udreamms.com` + `www` con SSL válido

## Google Search Console

1. Propiedad: `https://udreamms.com` (o dominio `udreamms.com` con TXT en Squarespace).
2. **Sitemaps** → enviar `https://udreamms.com/sitemap.xml`.
3. **Inspección de URLs** → probar e indexar (una por una, “Solicitar indexación”):
   - `https://udreamms.com/`
   - `https://udreamms.com/visas/student`
   - `https://udreamms.com/visas/tourist`
   - `https://udreamms.com/about`
   - `https://udreamms.com/contact`
   - `https://udreamms.com/services`
   - `https://udreamms.com/destinos`
   - `https://udreamms.com/courses`
   - `https://udreamms.com/brochures`
   - `https://udreamms.com/partnerships`
   - `https://udreamms.com/referrals`
   - `https://udreamms.com/faqs`
   - `https://udreamms.com/privacidad`
   - `https://udreamms.com/terminos`
4. **Páginas** → revisar 404; por cada URL antigua con tráfico, añadir 301 en `next.config.mjs` y volver a solicitar indexación.
5. No uses “Eliminación temporal” salvo URLs que deban desaparecer ya (sin sustituto).

### Favicon / logo en resultados de Google

Google **cachea el favicon durante semanas** (a veces 2–4+). No se actualiza al instante al cambiar el sitio.

Tras el deploy, comprueba en el navegador:

- `https://udreamms.com/icons/new-icon-udreamms.png` → imagen nueva (200)
- `https://udreamms.com/favicon.ico` → generado por Next desde `src/app/icon.png`

Luego en GSC → **Inspección de URLs** → `https://udreamms.com/` → **Probar URL publicada** → **Solicitar indexación**.

El icono rojo con ave es el favicon **antiguo de Hostinger** guardado por Google hasta que vuelva a rastrear.

## Firebase (mismo dominio)

- Auth → dominios autorizados: `udreamms.com`, `www.udreamms.com`.
- No desplegar Firebase Hosting en el mismo dominio que Vercel.

## Mantenimiento

- Rutas públicas nuevas: añadir en `src/lib/seo.ts` (`PUBLIC_SITEMAP_ROUTES` + `PAGE_SEO`) y crear `layout.tsx` con `pageMetadata`.
- Rutas privadas: `noindexMetadata` en su `layout.tsx` + `disallow` en `robots.ts` si aplica.
