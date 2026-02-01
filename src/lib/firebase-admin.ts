import * as admin from 'firebase-admin';

// Check if firebase-admin has already been initialized to avoid "already exists" error in dev
if (!admin.apps.length) {
    try {
        // In production/Vercel/Cloud Run, this usually uses GOOGLE_APPLICATION_CREDENTIALS
        // In local dev, we check for serviceAccountKey.json
        // Note: In Next.js Edge Runtime this might have issues, but we are using Node.js runtime for api routes by default.

        // We can try to load the service account file if it exists locally
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require('../../serviceAccountKey.json');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // No databaseURL needed for Firestore usually, unless using RTDB
        });
        console.log('Firebase Admin initialized with serviceAccountKey.json');
    } catch (error) {
        console.warn('Failed to load serviceAccountKey.json, trying default credentials...', error);
        try {
            admin.initializeApp();
            console.log('Firebase Admin initialized with default credentials');
        } catch (e) {
            console.error('Failed to initialize Firebase Admin', e);
        }
    }
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
