import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export const googleProvider = new GoogleAuthProvider();

/** Named Firestore database for this app (must match Firebase Console). */
export const FIRESTORE_DATABASE_ID =
  process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || "astrodata";

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyC6KQcoHN0UrhR_jTfYUcwyrTmfx6irLls",
  authDomain: "rishabhgautam-8744a.firebaseapp.com",
  projectId: "rishabhgautam-8744a",
  storageBucket: "rishabhgautam-8744a.firebasestorage.app",
  messagingSenderId: "733972848384",
  appId: "1:733972848384:web:ce9f14b90ff5df1843dde5",
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
};

function createFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export function getFirebaseApp() {
  if (typeof window === "undefined") {
    throw new Error("Firebase is only available in the browser");
  }
  if (!app) app = createFirebaseApp();
  return app;
}

export function getFirebaseAuth() {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

export function getFirebaseDb() {
  if (!db) {
    // Named DB (e.g. "astrodata") — not the Firebase "(default)" database
    db = getFirestore(getFirebaseApp(), FIRESTORE_DATABASE_ID);
  }
  return db;
}

export function getFirebaseStorage() {
  if (!storage) storage = getStorage(getFirebaseApp());
  return storage;
}

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.apiKey !== "your_api_key"
  );
}
