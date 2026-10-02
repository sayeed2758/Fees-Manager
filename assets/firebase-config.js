// Firebase Web App Configuration
// Sayeed Fees Manager

export const firebaseConfig = {
  apiKey: "AIzaSyBKz97Xul8gNbZU-XxYx3EDJmHPviRn7Lg",
  authDomain: "sayeed-fees-manager.firebaseapp.com",
  projectId: "sayeed-fees-manager",
  storageBucket: "sayeed-fees-manager.firebasestorage.app",
  messagingSenderId: "347811084380",
  appId: "1:347811084380:web:f212cbfd76b098cbee8e99"
};

// Check whether Firebase configuration is properly filled
export const firebaseConfigured = Object.values(firebaseConfig).every(
  (value) =>
    value &&
    !String(value).startsWith("YOUR_") &&
    !String(value).includes("YOUR_PROJECT")
);
