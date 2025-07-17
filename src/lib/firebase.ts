
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Check if the API key is present and not a placeholder
const isApiKeyValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY';

if (!isApiKeyValid) {
    console.error(`
      ********************************************************************************
      *                                                                              *
      *             FIREBASE API KEY IS MISSING OR INVALID!                          *
      *                                                                              *
      * Please add your Firebase project credentials to the src/.env.local file.   *
      * You can find them in your Firebase project settings.                         *
      *                                                                              *
      ********************************************************************************
    `);
    // Provide dummy objects to prevent the app from crashing on import
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
} else {
    // Initialize Firebase only if the key is valid
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}

export { app, auth, db };
