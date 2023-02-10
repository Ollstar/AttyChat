import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8iXh34NYc9_obAVzZ4Pjsx-P_LzgX3KE",
  authDomain: "attychat-5d9ea.firebaseapp.com",
  projectId: "attychat-5d9ea",
  storageBucket: "attychat-5d9ea.appspot.com",
  messagingSenderId: "879623665878",
  appId: "1:879623665878:web:346001f3986deca6163177",
};

// Initialize Firebase
// singleton pattern

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };