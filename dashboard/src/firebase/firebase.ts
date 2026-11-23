import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAz7HNMNOhgM2rGReYJbCsu9o-J5O8ZWhg",
  authDomain: "proyecto3-clima.firebaseapp.com",
  databaseURL: "https://proyecto3-clima-default-rtdb.firebaseio.com",
  projectId: "proyecto3-clima",
  storageBucket: "proyecto3-clima.firebasestorage.app",
  messagingSenderId: "672200869804",
  appId: "1:672200869804:web:8a42490066d4e318251c09",
  measurementId: "G-NSM28BE5RV"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);