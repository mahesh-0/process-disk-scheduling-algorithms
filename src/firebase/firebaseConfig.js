/**
 * Firebase Configuration
 *
 * Initializes the Firebase app and exports the auth instance
 * for use throughout the application.
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB19JEFC-xtiVpkcE_cV80pOY2PdCfVhdg",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "process-and-disk-scheduling.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "process-and-disk-scheduling",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "process-and-disk-scheduling.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "600785234107",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:600785234107:web:0be26a3613e00a97daa19e",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
