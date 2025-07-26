// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyB59Tq2XFfyg-CbfBNbMqqxpFuBZslmiwI",
  authDomain: "sample-firebase-ai-app-d8fa8.firebaseapp.com",
  projectId: "sample-firebase-ai-app-d8fa8",
  storageBucket: "sample-firebase-ai-app-d8fa8.firebasestorage.app",
  messagingSenderId: "350154894182",
  appId: "1:350154894182:web:6a8782c44c7fa391c5f6a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios para usar en app.js
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
