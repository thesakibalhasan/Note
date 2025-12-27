import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCtiWgefT4qDJ8CJjtJw4ChsavVtrR0gfk",
  authDomain: "note-6f61f.firebaseapp.com",
  projectId: "note-6f61f",
  storageBucket: "note-6f61f.firebasestorage.app",
  messagingSenderId: "900026673348",
  appId: "1:900026673348:web:17dde9b72299a2aaf68191",
  measurementId: "G-0S5LRKX91K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Storage
export const storage = getStorage(app)

export default app
