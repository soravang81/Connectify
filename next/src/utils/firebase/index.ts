import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqVWtFBM_epyOUXUnnL56oarz0gRFInfY",
  authDomain: "chatapp-4deee.firebaseapp.com",
  projectId: "chatapp-4deee",
  storageBucket: "chatapp-4deee.appspot.com",
  messagingSenderId: "685466832047",
  appId: "1:685466832047:web:3da018c364e02c973e185a",
  measurementId: "G-KT9RPXVQHX"
};

export const app = initializeApp(firebaseConfig);
export const bucket = getStorage(app);