import firebase from "firebase/app";
import "firebase/database";

import PublicKey from "./publickey";

const FIREBASE_CONFIG = {
  apiKey: process.env.VACCERT_API_KEY,
  authDomain: process.env.VACCERT_AUTH_DOMAIN,
  databaseURL: process.env.VACCERT_DB_URL,
  projectId: process.env.VACCERT_PROJECT_ID,
  storageBucket: process.env.VACCERT_STORAGE_BUCKET,
  messagingSenderId: process.env.VACCERT_MESSAGING_SENDER_ID,
  appId: process.env.VACCERT_APP_ID
}

export const initFirebase = () => firebase.initializeApp(FIREBASE_CONFIG);

class Keystore {
  db: firebase.database.Database;

  constructor() {
    this.db = firebase.database();
  }

  getKey(id: string): Promise<PublicKey> {
    return this.db.ref(`/keys/${id}`).get().then(snapshot => {
      let val = snapshot.val();
      if (val === null || val === undefined) {
        return Promise.reject("Key doesn't exist");
      } else {
        return Promise.resolve(new PublicKey(val.key, val.name));
      }
    });
  }
}

export default Keystore;