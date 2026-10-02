export const firebaseConfig = {
  apiKey: "AIzaSyBKz97Xul8gNbZU-XxYx3EDJmHPviRn7Lg",
  authDomain: "sayeed-fees-manager.firebaseapp.com",
  projectId: "sayeed-fees-manager",
  storageBucket: "sayeed-fees-manager.firebasestorage.app",
  messagingSenderId: "347811084380",
  appId: "1:347811084380:web:f212cbfd76b098cbee8e99"
};

export const firebaseConfigured = Object.values(firebaseConfig).every(
  (value) => String(value).trim() && !String(value).startsWith("YOUR_")
);
