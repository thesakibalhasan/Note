import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config
const isValidConfig = Object.values(firebaseConfig).every(value => value !== undefined);

if (!isValidConfig) {
  console.warn("[v0] Firebase environment variables are not configured. Please add the following to your environment variables in the Vars section of v0:', {
    'NEXT_PUBLIC_FIREBASE_API_KEY': '',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': '',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': '',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': '',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': '',
    'NEXT_PUBLIC_FIREBASE_APP_ID': ''
  });
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("[v0] Failed to initialize Firebase:", error);
  throw new Error("Firebase initialization failed. Please check your environment variables.");
}

// Initialize Firestore with error handling
let db;
let storage;

try {
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("[v0] Failed to initialize Firestore/Storage:", error);
  throw new Error("Firestore/Storage initialization failed.");
}

export { db, storage }
export default app
