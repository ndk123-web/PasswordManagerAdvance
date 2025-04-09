// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBBlEVVewBTHvLnFQlAw2tZXvquFW-GG0",
  authDomain: "passwordmanager-af634.firebaseapp.com",
  projectId: "passwordmanager-af634",
  storageBucket: "passwordmanager-af634.firebasestorage.app",
  messagingSenderId: "618528074887",
  appId: "1:618528074887:web:5662b67b1a9dcf79e5dc22",
  measurementId: "G-007G9FJLGE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
// const analytics = getAnalytics(app);