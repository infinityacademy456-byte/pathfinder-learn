import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD__tna1b04mmSX5MS55ppTS3gE6TrQy8g",
  authDomain: "vidya-learning-hub-78275.firebaseapp.com",
  projectId: "vidya-learning-hub-78275",
  storageBucket: "vidya-learning-hub-78275.appspot.com",
  messagingSenderId: "440985005662",
  appId: "1:440985005662:web:ce363be1a4a9845a8a8ecf",
  measurementId: "G-R66MBF7TEY",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
