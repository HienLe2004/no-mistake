// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDJRg6t4m34-JAlXF7Jkjr5FKWQ2OQnX7M",
  authDomain: "lms-nm-232.firebaseapp.com",
  projectId: "lms-nm-232",
  storageBucket: "lms-nm-232.appspot.com",
  messagingSenderId: "1003308906972",
  appId: "1:1003308906972:web:a252b81e3be08beeb63719",
  measurementId: "G-N2JYKQXL9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
//const analytics = getAnalytics(app);