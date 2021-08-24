import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { StatusBar } from "expo-status-bar";
import { loadAsync } from "expo-font";
import * as SecureStore from "expo-secure-store";

import Onboarding from "./screens/onboarding/Onboarding";

export enum AppPhase {
  Loading,
  Onboarding,
  Verify,
  Client,
  Staff
}

interface AppState {
  phase: AppPhase
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      phase: AppPhase.Loading
    };
  }

  componentDidMount() {
    loadAsync({
      "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
      "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
      "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf")
    }).then(() => {
      SecureStore.getItemAsync("VACCERT_MODE").then(mode => {
        if (mode === "client") {
          this.setState({ phase: AppPhase.Client });
        } else if (mode === "staff") {
          this.setState({ phase: AppPhase.Staff });
        } else {
          this.setState({ phase: AppPhase.Onboarding });
        }
      });
    });
  }

  render() {
    switch (this.state.phase) {
      case AppPhase.Onboarding: return <Onboarding />;
      default: return null;
    }
  }
}

export default App;