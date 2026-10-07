// ================================================================
//  firebase-config.js
//  ----------------------------------------------------------------
//  SETUP STEPS:
//  1. Go to https://console.firebase.google.com
//  2. Click "Add project" → give it a name (e.g., macaulay-tribute)
//  3. In project dashboard, click the </> (Web) icon to register app
//  4. Copy the firebaseConfig keys and replace the placeholders below
//  5. In Firebase Console:
//     - Build → Firestore Database → Create database (Test mode)
//     - Build → Storage → Get started (Test mode)
// ================================================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQPnwRgDwrYqcG519S0vtKucVgLj-J4ss",
  authDomain: "tribute-d8b65.firebaseapp.com",
  projectId: "tribute-d8b65",
  storageBucket: "tribute-d8b65.firebasestorage.app",
  messagingSenderId: "62595433031",
  appId: "1:62595433031:web:01020eb249bd4b3d0f6762",
  measurementId: "G-LW6SQVM5KB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);