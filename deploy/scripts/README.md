# Scripts de despliegue

Los comandos oficiales están en `package.json` de la raíz. Ejecutar siempre desde la raíz del repo.

## Web (Vercel)

| Acción | Comando |
|--------|---------|
| Desarrollo | `npm run dev` |
| Build producción | `npm run build` |
| Servir build local | `npm run start` |

Deploy: automático por Git en Vercel, o `npx vercel --prod`.

## Firebase

| Acción | Comando |
|--------|---------|
| Solo Functions | `npm run deploy:functions` |
| Reglas Firestore + Storage | `npm run deploy:firebase:rules` |
| Functions + reglas + hosting | `npm run deploy:firebase` |
| Logs Functions | `cd functions && npm run logs` |
| Config WhatsApp | `firebase functions:config:set whatsapp.access_token="..."` |

## Functions — build manual

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

## Emuladores (local, opcional)

```bash
firebase emulators:start
```

## Windows (PowerShell)

Mismos comandos; si `firebase` no está en PATH:

```powershell
npx firebase deploy --only functions
```
