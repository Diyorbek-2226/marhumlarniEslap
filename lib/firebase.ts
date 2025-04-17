// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRE_BASE_KEY,
  authDomain: "yodimdasiz-e28e4.firebaseapp.com",
  projectId: "yodimdasiz-e28e4",
  storageBucket: "yodimdasiz-e28e4.appspot.com", // Eslatma: bu yerda `.app` emas `.com` bo'lishi kerak
  messagingSenderId: "522260724002",
  appId: "1:522260724002:web:4e32b21f3a2acf6d948d7b",
  measurementId: "G-1F7JQ4TF9G"
};

// Firebase ilovasini faqat bir marta initialize qilish
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
