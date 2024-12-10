// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
export const firebaseConfig = {
  apiKey: "AIzaSyAXw5cBBgOmiSZfuJAEfe2D9nMLMGipy4Y",
  authDomain: "taas-aea43.firebaseapp.com",
  projectId: "taas-aea43",
  storageBucket: "taas-aea43.firebasestorage.app",
  messagingSenderId: "989753010579",
  appId: "1:989753010579:web:48861123c2e3352f816066"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth =getAuth(app);
export default app;