import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZjoI114sD5n1ZvYuhL2pVO-O1kSEvE00",
  authDomain: "drone-track-377919.firebaseapp.com",
  projectId: "drone-track-377919",
  storageBucket: "drone-track-377919.appspot.com",
  messagingSenderId: "678644956790",
  appId: "1:678644956790:web:66e4fb9db8651afe5ce957",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
type User = {
  email: string;
  password: string;
};

export const createUser = async (user: User) => {
  const { email, password } = user;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error: any) {
    alert(error.message);
    return false;
  }
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      alert("You have been logged out");
    })
    .catch((error) => {
      alert(error.message);
    });
};

export const login = async (user: User) => {
  const { email, password } = user;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error: any) {
    alert(error.message);
    return false;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    alert(error.message);
    return false;
  }
};

