import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Add your Firebase project configuration here
  apiKey: "AIzaSyA0BjC_n6uBWj8Yj3-pZCBJzziLPs2kl-M",
  authDomain: "monster-challenge-b.firebaseapp.com",
  projectId: "ymonster-challenge-b",
  storageBucket: "monster-challenge-b.appspot.com",
  messagingSenderId: "647028619784",
  appId: "1:647028619784:web:6428a78177b9519f77afbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);