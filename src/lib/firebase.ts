
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import getStorage

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBKkNyleaQC52S1s1v13WfQ7-U7wol-SVA",
  authDomain: "udreamms-platform-1.firebaseapp.com",
  projectId: "udreamms-platform-1",
  storageBucket: "udreamms-platform-1.appspot.com",
  messagingSenderId: "860170719759",
  appId: "1:860170719759:web:cb8e6008e08c19b0e7897a",
  measurementId: "G-GP2PVZBTQP"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Storage

// Export the services
export { app, db, auth, storage }; // Export storage
