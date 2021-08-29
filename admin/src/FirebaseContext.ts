import React from "react";

import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Database } from "firebase/database";

export interface FirebaseUtils {
  app: FirebaseApp,
  auth: Auth,
  database: Database
}

export default React.createContext<FirebaseUtils | undefined>(undefined);