import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// --- UPDATED EMULATOR LOGIC (SIMPLIFIED) ---
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  
  // 1. Browser Environment: Connect to the APP URL (The Proxy handles the rest)
  if (typeof window !== "undefined") {
    const appUrl = window.location.origin; // e.g. https://...9002...
    console.log(`🔥 Connecting to Auth Emulator via Proxy at: ${appUrl}`);
    
    // We connect to port 9002 (the app), and next.config.js forwards it to 9099
    connectAuthEmulator(auth, appUrl, { disableWarnings: true });
  } 
  
  // 2. Server Environment: Connect directly to localhost
  else {
    console.log(`🔥 Connecting to Auth Emulator (Server) at: http://127.0.0.1:9099`);
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
  }
}
// -------------------------------------------

// Persistence Logic (Keep as is)
try {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Could not enable IndexedDB persistence:", err.code || err.message || err);
  });
} catch (e) {
  console.warn("Persistence enable failed:", e);
}

export const googleProvider = new GoogleAuthProvider();

export default app;