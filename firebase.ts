import { doc, getFirestore, setDoc } from "firebase/firestore";
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

/// Function to add default properties to a new user document
const addDefaultProperties = async (uid: string): Promise<void> => {
  const userRef = doc(db, "users", uid);
  const defaultProperties = {
    primer: "Your responding to a new user and you use extra emojis and smileys.",
    // Add more default properties as needed
  };

  try {
    await setDoc(userRef, defaultProperties, { merge: true });
    console.log("Default properties added to user document");
  } catch (error) {
    console.error("Error adding default properties to user document", error);
  }
};

export { db, addDefaultProperties };