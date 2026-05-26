# Firebase Studio / Project IDX

Entorno de desarrollo en la nube para este repositorio.

## Configuración

- `dev.nix` — Node.js 20 y preview web (`npm run dev` en el puerto asignado por IDX).

## Firebase en desarrollo

El preview usa el mismo cliente que producción: `src/lib/firebase.ts` → proyecto **`udreamms-platform-1`**.

**Precaución:** los cambios en Firestore/Auth desde Studio afectan el proyecto real si no usas emuladores.

## Despliegue

IDX **no reemplaza** el deploy:

- Web → [deploy/platforms/vercel.md](../deploy/platforms/vercel.md)
- BD / Functions → [deploy/platforms/firebase.md](../deploy/platforms/firebase.md)
