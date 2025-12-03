import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { getFirebaseConfig } from "./firebaseConfig";

// Initialize Firebase (singleton pattern)
let app;
let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;

try {
    const firebaseConfig = getFirebaseConfig();
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
} catch (error) {
    console.warn("Firebase initialization failed:", error);
    // Provide dummy objects or undefined to prevent crash on import
    // Consumers should check for initialization or rely on USE_FIREBASE flag
    db = {} as any;
    auth = {} as any;
}

export { db, auth };
