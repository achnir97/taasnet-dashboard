// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
export const firebaseConfig = {
  apiKey: "AIzaSyAJ51K6iD0VRr2HPIanv4_fdKNTJ5XE4ZA",
  authDomain: "taasnet-43e10.firebaseapp.com",
  projectId: "taasnet-43e10",
  storageBucket: "taasnet-43e10.appspot.com",
  messagingSenderId: "594075098061",
  appId: "1:594075098061:web:d03ff4118b4eeadc988284",
  measurementId: "G-5NXHSJLV7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth =getAuth(app);
export default app;