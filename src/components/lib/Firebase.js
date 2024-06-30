import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-d6200.firebaseapp.com",
  projectId: "reactchat-d6200",
  storageBucket: "reactchat-d6200.appspot.com",
  messagingSenderId: "1087630176960",
  appId: "1:1087630176960:web:1dafe0a6196599eadfb325",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
