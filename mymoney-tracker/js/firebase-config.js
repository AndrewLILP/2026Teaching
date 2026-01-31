// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC...", // Student note: This is my real API key
    authDomain: "mymoney-tracker-abc123.firebaseapp.com",
    projectId: "mymoney-tracker-abc123",
    storageBucket: "mymoney-tracker-abc123.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();