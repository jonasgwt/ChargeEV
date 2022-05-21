// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlc98n5OWQBTIc9LNt5K5AXwGS2dO2Cjg",
  authDomain: "chargeev-28a68.firebaseapp.com",
  projectId: "chargeev-28a68",
  storageBucket: "chargeev-28a68.appspot.com",
  messagingSenderId: "63663956005",
  appId: "1:63663956005:web:2944f856e2d2f411ad1fcc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);