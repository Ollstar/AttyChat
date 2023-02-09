import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB3zTX5AbI2FLWw7YIMd_HeKN8lReJeWU",
  authDomain: "chatgpt-messenger-et.firebaseapp.com",
  projectId: "chatgpt-messenger-et",
  storageBucket: "chatgpt-messenger-et.appspot.com",
  messagingSenderId: "835101775211",
  appId: "1:835101775211:web:a227104168378b5851a82e"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db };