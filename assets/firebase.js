import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js';

import {
  getFirestore
} from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

import { firebaseConfig } from './firebase-config.js';

export const firebaseConfigured =
  firebaseConfig &&
  Object.values(firebaseConfig).every(
    value => String(value).trim() && !String(value).startsWith('YOUR_')
  );

export const app = firebaseConfigured
  ? initializeApp(firebaseConfig)
  : null;

export const auth = firebaseConfigured
  ? getAuth(app)
  : null;

export const db = firebaseConfigured
  ? getFirestore(app)
  : null;

// Firebase Auth exports
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
};
