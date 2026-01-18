
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw4ilpsPmKKkd1YSIdotsE84Gq1cDu1m0",
  authDomain: "geminipnya.firebaseapp.com",
  projectId: "geminipnya",
  storageBucket: "geminipnya.firebasestorage.app",
  messagingSenderId: "1059524469304",
  appId: "1:1059524469304:web:0cd6b9c4d1daa7d0fc3ccd",
  measurementId: "G-9QKVXS0H6M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
