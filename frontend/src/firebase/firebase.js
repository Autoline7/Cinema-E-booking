// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEE2R9Dg17kF6rRp8gGb_gBAUKSlSVV-M",
  authDomain: "e-booking-system.firebaseapp.com",
  projectId: "e-booking-system",
  storageBucket: "e-booking-system.firebasestorage.app",
  messagingSenderId: "856737229919",
  appId: "1:856737229919:web:70998e2b1c9b2b3cb77fea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//firebase services
const auth = getAuth(app);
const db = getFirestore(app)
export {auth, db};