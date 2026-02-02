// Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();