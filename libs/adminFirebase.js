import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getApp } from "firebase-admin/app";
import { getStorage as getAdminStorage } from "firebase-admin/storage";

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
) {
  throw new Error("Missing Firebase Admin configuration environment variables");
}

// Initialize Firebase Admin
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

// Initialize Firebase Admin if not already initialized
let adminApp;
let adminStorage;

try {
  // Check if an app is already initialized
  if (getApps().length === 0) {
    adminApp = initializeApp(firebaseAdminConfig);
  } else {
    adminApp = getApp();
  }

  // Initialize storage with explicit bucket name
  adminStorage = getAdminStorage(adminApp).bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
  throw error;
}

export { adminApp, adminStorage };
