export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

export function getFirebaseConfig(): FirebaseConfig {
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Runtime check for missing variables
    const missingKeys = Object.entries(config)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missingKeys.length > 0) {
        const errorMessage = `Missing required Firebase configuration keys: ${missingKeys.join(", ")}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    return config as FirebaseConfig;
}
