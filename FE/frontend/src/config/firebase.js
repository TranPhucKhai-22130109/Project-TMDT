import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-Ys0rhlmZzuTK3ykCXVjYswLyXkSd7fk",
  authDomain: "tmdt-34b21.firebaseapp.com",
  projectId: "tmdt-34b21",
  storageBucket: "tmdt-34b21.firebasestorage.app",
  messagingSenderId: "815291170678",
  appId: "1:815291170678:web:da2e18a346f017cb7d4457",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
