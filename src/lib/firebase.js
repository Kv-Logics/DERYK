import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const googleProvider = new GoogleAuthProvider();

let auth;

// Firebase throws synchronously on init if the config is missing/invalid, so this
// stays lazy — email/password auth must keep working even before Firebase is set up.
export function getFirebaseAuth() {
  if (!auth) {
    if (!firebaseConfig.apiKey) {
      throw new Error('Google sign-in is not configured yet (missing VITE_FIREBASE_* env vars).');
    }
    const firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
  }
  return auth;
}
