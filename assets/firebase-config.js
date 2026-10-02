// Paste the Firebase Web App configuration from:
// Firebase Console → Project settings → Your apps → Web app
// This configuration is intended for a browser app. Do not put Admin SDK/service-account private keys here.

export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean) &&
  !Object.values(firebaseConfig).some((value) => String(value).startsWith('YOUR_'));
