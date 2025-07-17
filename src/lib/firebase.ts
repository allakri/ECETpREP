
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

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

// Check if all Firebase config keys are provided and not placeholders
const isConfigValid = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('your-');

if (isConfigValid) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    console.error(`
      ********************************************************************************
      *                                                                              *
      *    FIREBASE IS NOT CONFIGURED. PLEASE ADD YOUR FIREBASE CREDENTIALS.         *
      *                                                                              *
      *    1. Go to your Firebase project console.                                   *
      *    2. Find your web app's configuration object.                              *
      *    3. Copy the values into the .env file at the root of your project.        *
      *                                                                              *
      ********************************************************************************
    `);
    // Provide dummy objects to prevent app from crashing on import
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
}


export { app, auth, db };
