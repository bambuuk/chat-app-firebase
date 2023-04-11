import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9Nh0oT2e-aXalKqyr7tVVj6jIvIOl4pQ",
  authDomain: "chatapp-b072f.firebaseapp.com",
  projectId: "chatapp-b072f",
  storageBucket: "chatapp-b072f.appspot.com",
  messagingSenderId: "1057660753253",
  appId: "1:1057660753253:web:e8826c3c04e95084f73d8c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);