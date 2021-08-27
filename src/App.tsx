import React from "react";

import { Alert, Platform, UIManager } from "react-native";
import { loadAsync } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { initFirebase } from "./crypto/keystore";
import { Vaccert } from "./types";

import Onboarding from "./screens/onboarding/Onboarding";
import Client from "./screens/Client";
import Verify from "./screens/Verify";
import Staff from "./screens/Staff";

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
    this.enterStaffMode = this.enterStaffMode.bind(this);
  }

  componentDidMount() {
    initFirebase();

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

  enterStaffMode() {
    Alert.alert(
      "Enter staff mode?",
      "You'll need your certification QR code with you until the set-up process is complete.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => this.setState({ phase: AppPhase.Staff })
        }
      ]);
  }

  render() {
    switch (this.state.phase) {
      case AppPhase.Onboarding:
        return <Onboarding
          clientCallback={this.loadedVaccert}
          verifyCallback={() => this.setState({ phase: AppPhase.Verify })}
          staffCallback={this.enterStaffMode} />;

      case AppPhase.Client: return <Client certificate={this.state.certificate!} />

      case AppPhase.Verify: return <Verify finishCallback={() => this.setState({ phase: AppPhase.Onboarding })} />

      case AppPhase.Staff: return <Staff backCallback={() => this.setState({ phase: AppPhase.Onboarding })} />

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