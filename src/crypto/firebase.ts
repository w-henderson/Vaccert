import firebase from "firebase/app";
import "firebase/database";

const FIREBASE_CONFIG = {
  apiKey: process.env.VACCERT_API_KEY,
  authDomain: process.env.VACCERT_AUTH_DOMAIN,
  databaseURL: process.env.VACCERT_DB_URL,
  projectId: process.env.VACCERT_PROJECT_ID,
  storageBucket: process.env.VACCERT_STORAGE_BUCKET,
  messagingSenderId: process.env.VACCERT_MESSAGING_SENDER_ID,
  appId: process.env.VACCERT_APP_ID
}

firebase.initializeApp(FIREBASE_CONFIG);