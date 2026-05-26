# Checklist de despliegue

Usar antes de cada release a producción.

## 1. Código

- [ ] `npm run build` exitoso en local
- [ ] Sin secretos nuevos en el repositorio
- [ ] Cambios en `firestore.rules` / `storage.rules` revisados por alguien con contexto de seguridad

## 2. Firebase (`udreamms-platform-1`)

- [ ] `npm run deploy:firebase:rules` (si cambiaron reglas o índices)
- [ ] `npm run deploy:functions` (si cambió `functions/`)
- [ ] `firebase functions:config:get` — WhatsApp configurado
- [ ] Índices Firestore creados si hay queries nuevas
- [ ] Auth: dominios de producción autorizados

## 3. Vercel

- [ ] Variables de [deploy/env/.env.web.example](./env/.env.web.example) actualizadas en Dashboard
- [ ] `FIREBASE_PRIVATE_KEY` con saltos de línea correctos
- [ ] Deploy verde en la rama de producción
- [ ] Dominio custom (si aplica) con SSL activo

## 4. Smoke tests (producción)

- [ ] `/` — home carga
- [ ] `/visas/tourist` — planes y CTAs
- [ ] `/instructions-payment-tourist?plan=premium` — UI pago
- [ ] Crear sesión QR crypto (API 200)
- [ ] `/portal` — login
- [ ] Webhook WhatsApp (si se tocó functions) — mensaje de prueba

## 5. Rollback

- [ ] Vercel: redeploy deployment anterior desde Dashboard
- [ ] Functions: versiones en Firebase Console → Functions
- [ ] Reglas: revertir commit y `deploy:firebase:rules`

## Contactos / enlaces

- Consola Firebase: https://console.firebase.google.com/project/udreamms-platform-1
- Documentación pagos: [docs/firestore-crypto-payments.md](../docs/firestore-crypto-payments.md)
