
// functions/src/config/firebase.ts

import * as admin from 'firebase-admin'; // Importar el namespace completo
import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Inicializa la app de Firebase solo una vez.
const app: App = getApps().length > 0 ? getApps()[0] : initializeApp();

// Exporta directamente la instancia de Firestore.
const db: Firestore = getFirestore(app);

// Exportar db y admin
export { db, admin };
