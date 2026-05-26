# Google Analytics 4

## Instalación en el proyecto

El tag de GA4 está en `src/components/analytics/GoogleAnalytics.tsx` y se carga en **todas las páginas** desde `src/app/layout.tsx` (forma correcta en Next.js; no hace falta pegar el script en cada página).

ID por defecto: `G-20S9HSQFEW`  
Variable opcional en Vercel: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Vercel

1. **Settings → Environment Variables**
2. Añadir `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-20S9HSQFEW` (Production + Preview)
3. Redeploy

## Comprobar que funciona

1. Instala la extensión [Google Analytics Debugger](https://chrome.google.com/webstore) o usa **GA4 → Informes → Tiempo real**
2. Abre `https://www.udreamms.com` en otra pestaña
3. Deberías ver 1 usuario activo en unos segundos

## Campañas (UTM)

Usa URLs con parámetros, por ejemplo:

`https://www.udreamms.com/visas/student?utm_source=instagram&utm_medium=paid&utm_campaign=f1-2026`

GA4 los mostrará en Adquisición → Tráfico de campañas.
