import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

import {
  getFirestore
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

import { firebaseConfig } from './firebase-config.js';

// Check Firebase configuration
export const firebaseConfigured =
  firebaseConfig &&
  Object.values(firebaseConfig).every(
    (value) =>
      value &&
      String(value).trim() &&
      !String(value).startsWith('YOUR_') &&
      !String(value).includes('YOUR_PROJECT')
  );

// Initialize Firebase
export const app = firebaseConfigured
  ? initializeApp(firebaseConfig)
  : null;

// Firebase Authentication
export const auth = app
  ? getAuth(app)
  : null;

// Cloud Firestore
export const db = app
  ? getFirestore(app)
  : null;

// Export authentication functions
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
};
