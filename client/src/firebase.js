// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "chatapp-b0b1f.firebaseapp.com",
    projectId: "chatapp-b0b1f",
    storageBucket: "chatapp-b0b1f.appspot.com",
    messagingSenderId: "928284153782",
    appId: "1:928284153782:web:a8d1499bc4ebea36c99317",
    measurementId: "G-FY2TRNXP61"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);