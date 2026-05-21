import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Check if firebase-admin has already been initialized to avoid "already exists" error in dev
if (!admin.apps.length) {
    try {
        // In production/Vercel/Cloud Run, this usually uses GOOGLE_APPLICATION_CREDENTIALS
        // In local dev, we check for serviceAccountKey.json
        // Note: In Next.js Edge Runtime this might have issues, but we are using Node.js runtime for api routes by default.

        // 1. Try to load from Vercel Environment Variables first
        if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    // Vercel escapes newlines, so we must unescape them
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin initialized with Environment Variables (Vercel Ready)');
        } 
        // 2. Fallback to local serviceAccountKey.json for local development
        else {
            const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
            if (fs.existsSync(serviceAccountPath)) {
                const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                console.log('Firebase Admin initialized with local serviceAccountKey.json');
            } else {
                throw new Error('Firebase credentials not found. Set FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL env vars, or provide serviceAccountKey.json locally.');
            }
        }
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
