

// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAA6LKcrcJo7M8X4SK8ziaXGaWB1xzMGs",
  authDomain: "basicbiblicalnutrition.firebaseapp.com",
  projectId: "basicbiblicalnutrition",
  storageBucket: "basicbiblicalnutrition.firebasestorage.app",
  messagingSenderId: "496922675962",
  appId: "1:496922675962:web:a5d7dd85643b79ab2e5743",
  measurementId: "G-8JJ5VBM1J2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

