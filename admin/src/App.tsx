import React from "react";
import "./App.scss";

import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { getDatabase } from "firebase/database";

import SignIn from "./components/SignIn";
import FirebaseContext, { FirebaseUtils } from "./FirebaseContext";

interface AppState {
  firebase: FirebaseUtils,
  user?: User
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const auth = getAuth(app);

    this.state = {
      firebase: {
        app,
        auth,
        database
      }
    }

    this.signedIn = this.signedIn.bind(this);
  }

  signedIn(user: User) {
    this.setState({ user });
  }

  render() {
    if (this.state.user === undefined) {
      return (
        <FirebaseContext.Provider value={this.state.firebase}>
          <SignIn successCallback={this.signedIn} />
        </FirebaseContext.Provider>
      );
    } else {
      return (
        <div>Signed in</div>
      )
    }
  }
}

export default App;
