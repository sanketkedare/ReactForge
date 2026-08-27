import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBstFeVkiViowauy-oxR-oV_0km2OcpdG4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "volcanic-world.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "volcanic-world",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "volcanic-world.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "498532329411",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:498532329411:web:51d6e4b0b370ee06663f76",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CYW2Q37ED1",
};

// Initialize Firebase once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const githubProvider = new GithubAuthProvider();

/**
 * Sign in with Google Popup
 */
export async function signInWithGooglePopup() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message || "Google sign in failed" };
  }
}

/**
 * Sign in with GitHub Popup
 */
export async function signInWithGithubPopup() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message || "GitHub sign in failed" };
  }
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (error: any) {
    let msg = "Failed to sign in";
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      msg = "Invalid email or password";
    } else if (error.code === "auth/invalid-email") {
      msg = "Please enter a valid email address";
    }
    return { user: null, error: msg };
  }
}

/**
 * Register with Email, Password and Display Name
 */
export async function registerWithEmail(email: string, pass: string, displayName: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    let msg = "Registration failed";
    if (error.code === "auth/email-already-in-use") {
      msg = "An account with this email already exists";
    } else if (error.code === "auth/weak-password") {
      msg = "Password should be at least 6 characters";
    } else if (error.code === "auth/invalid-email") {
      msg = "Please enter a valid email address";
    }
    return { user: null, error: msg };
  }
}

/**
 * Sign Out
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to sign out" };
  }
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to send reset link" };
  }
}

export type { FirebaseUser };
