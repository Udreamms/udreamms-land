// functions/src/config/firebase.ts

import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Inicializa la app de Firebase solo una vez para evitar conexiones redundantes.
const app: App = getApps().length > 0 ? getApps()[0] : initializeApp();

// Exporta directamente la instancia de Firestore para que otros archivos puedan importarla.
export const db: Firestore = getFirestore(app);
