

// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR API KEY",
    authDomain: "basicbiblicalnutrition.firebaseapp.com",
    projectId: "basicbiblicalnutrition",
    storageBucket: "basicbiblicalnutrition.firebasestorage.app",
    messagingSenderId: "YOUR MESSAGING ID",
    appId: "YOUR APP ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

