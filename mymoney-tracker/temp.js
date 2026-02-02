// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMVdxKCF6le5QAPQdSlOx3HDJk0jyaVtI",
  authDomain: "mymoney-tracker-e4b16.firebaseapp.com",
  projectId: "mymoney-tracker-e4b16",
  storageBucket: "mymoney-tracker-e4b16.firebasestorage.app",
  messagingSenderId: "130888971280",
  appId: "1:130888971280:web:eabb37fba3450cfbcc4695",
  measurementId: "G-82WFWJJ90X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);