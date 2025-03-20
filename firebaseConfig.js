import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLmWRJhsf35ssvW4Mwa8URLWpQK90Uick",
  authDomain: "booklibrary-bbf46.firebaseapp.com",
  projectId: "booklibrary-bbf46",
  storageBucket: "booklibrary-bbf46.firebasestorage.app",
  messagingSenderId: "936401493841",
  appId: "1:936401493841:web:dcb12198f57ae2e9a4bd70",
  measurementId: "G-5LZH1RYELB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);