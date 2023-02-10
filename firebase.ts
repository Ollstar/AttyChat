// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8iXh34NYc9_obAVzZ4Pjsx-P_LzgX3KE",
  authDomain: "attychat-5d9ea.firebaseapp.com",
  projectId: "attychat-5d9ea",
  storageBucket: "attychat-5d9ea.appspot.com",
  messagingSenderId: "879623665878",
  appId: "1:879623665878:web:346001f3986deca6163177",
  measurementId: "G-9FGH41LRJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };