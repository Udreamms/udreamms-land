// Pega este código en: functions/src/config/firebase.ts

import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;

/**
 * Inicializa y devuelve las instancias de servicios de Firebase (como Firestore).
 * Utiliza un patrón "lazy initialization" para asegurar que la app se inicializa solo una vez.
 */
export function getFirebaseServices() {
    if (!app) {
        // Si no hay apps inicializadas, inicializa una nueva.
        // Si ya existe una, usa la existente (importante para el entorno de ejecución de Firebase).
        app = getApps().length > 0 ? getApps()[0] : initializeApp();
        db = getFirestore(app);
    }
    
    // Devuelve la instancia de la base de datos para que pueda ser utilizada por otras partes de la aplicación.
    return { db };
}
