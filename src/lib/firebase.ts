import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  connectAuthEmulator, 
} from "firebase/auth";
import { getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  connectFirestoreEmulator // 
} from "firebase/firestore";

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

// --- UPDATED EMULATOR LOGIC ---
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  
  // 1. Browser Environment
  if (typeof window !== "undefined") {
    const appUrl = window.location.origin; 
    console.log(`🔥 Connecting to Auth Emulator via Proxy at: ${appUrl}`);
    connectAuthEmulator(auth, appUrl, { disableWarnings: true });

    console.log(`🔥 Connecting to Firestore Emulator at 127.0.0.1:8080`);
    // VS Code forwards port 8080 automatically, so localhost works even in Codespaces
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    // 👆👆👆 END ADDITION 👆👆👆
  } 
  
  // 2. Server Environment
  else {
    console.log(`🔥 Connecting to Auth Emulator (Server) at: http://127.0.0.1:9099`);
    connectAuthEmulator(auth, "http://127.0.0.1:9099");

    console.log(`🔥 Connecting to Firestore Emulator (Server) at 127.0.0.1:8080`);
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    // 👆👆👆 END ADDITION 👆👆👆
  }
}
// -------------------------------------------

// Persistence Logic
try {
  enableIndexedDbPersistence(db).catch((err) => {
    // It's normal for this to fail in some environments (like multiple tabs open)
    console.warn("IndexedDB persistence warning:", err.code);
  });
} catch (e) {
  console.warn("Persistence enable failed:", e);
}

export const googleProvider = new GoogleAuthProvider();

export default app;