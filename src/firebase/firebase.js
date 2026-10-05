import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBPqV_SLHbFnVRXLgxxfpZq3r27sODFSMA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "yumi-store-efd7f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "yumi-store-efd7f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "yumi-store-efd7f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "717447838600",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:717447838600:web:41bb235b05e393e062583d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);