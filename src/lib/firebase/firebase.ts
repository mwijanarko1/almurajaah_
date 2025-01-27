import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIsp4r4rOnrIbHVZahJSCkWpn2z9LnI3U",
  authDomain: "al-muraja-ah.firebaseapp.com",
  projectId: "al-muraja-ah",
  storageBucket: "al-muraja-ah.firebasestorage.app",
  messagingSenderId: "63031955242",
  appId: "1:63031955242:web:a015538eaac728eecd1853"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
