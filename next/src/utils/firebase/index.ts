import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.apikey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

export const app = initializeApp(firebaseConfig);
export const bucket = getStorage(app);