import React from "react";

import { Platform, UIManager } from "react-native";
import { loadAsync } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { Vaccert } from "./types";

import Onboarding from "./screens/onboarding/Onboarding";
import Client from "./screens/Client";

export enum AppPhase {
  Loading,
  Onboarding,
  Verify,
  Client,
  Staff
}

interface AppState {
  phase: AppPhase,
  certificate?: Vaccert
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      phase: AppPhase.Loading
    };

    this.loadedVaccert = this.loadedVaccert.bind(this);
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

  loadedVaccert(cert: Vaccert) {
    this.setState({ certificate: cert, phase: AppPhase.Client });
  }

  render() {
    switch (this.state.phase) {
      case AppPhase.Onboarding:
        return <Onboarding
          clientCallback={this.loadedVaccert}
          verifyCallback={() => { }} />;

      case AppPhase.Client: return <Client certificate={this.state.certificate!} />

      default: return null;
    }
  }
}

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default App;