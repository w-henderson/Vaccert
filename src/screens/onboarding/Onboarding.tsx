import React from "react";
import { Alert, Dimensions, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import colours from "../../colours";

import Welcome from "./Welcome";
import Permissions from "./Permissions";
import Scanner from "./Scanner";
import Success from "./Success";
import { Vaccert } from "../../types";

enum OnboardingPhase {
  Welcome,
  Permission,
  Scan,
  Success
}

interface OnboardingState {
  phase: OnboardingPhase,
  certificate?: Vaccert
}

class Onboarding extends React.Component<{}, OnboardingState> {
  constructor(props: {}) {
    super(props);
    this.state = { phase: OnboardingPhase.Welcome };
    this.grantPermissions = this.grantPermissions.bind(this);
    this.finish = this.finish.bind(this);
  }

  grantPermissions() {
    Camera.requestPermissionsAsync().then(({ status }) => {
      if (status === "granted") {
        this.setState({ phase: OnboardingPhase.Scan });
      }
    });
  }

  finish(cert: Vaccert) {
    this.setState({ certificate: cert, phase: OnboardingPhase.Success });
  }

  render() {
    switch (this.state.phase) {
      case OnboardingPhase.Welcome:
        return <Welcome
          styles={styles}
          installCallback={() => this.setState({ phase: OnboardingPhase.Permission })}
          verifyCallback={() => { }} />;

      case OnboardingPhase.Permission:
        return <Permissions
          styles={styles}
          permissionCallback={this.grantPermissions}
          backCallback={() => this.setState({ phase: OnboardingPhase.Welcome })} />;

      case OnboardingPhase.Scan:
        return <Scanner
          styles={styles}
          successCallback={this.finish}
          backCallback={() => this.setState({ phase: OnboardingPhase.Permission })} />

      case OnboardingPhase.Success:
        return <Success
          styles={styles}
          finishCallback={() => { }} />;
    }
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colours.accent,
    padding: 64,
  },
  backButton: {
    position: "absolute",
    top: 32,
    left: 32
  },
  text: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    width: "100%"
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    textAlign: "center",
    color: colours.lightest,
    marginBottom: 24
  },
  body: {
    fontFamily: "Inter-Regular",
    fontSize: 22,
    textAlign: "center",
    color: colours.lightest
  },
  cameraView: {
    position: "relative",
    width: "100%",
    height: Dimensions.get("screen").width - 128,
    marginTop: 48,
    borderRadius: 8,
    overflow: "hidden",
  },
  camera: {
    position: "absolute",
    width: "100%",
    height: (Dimensions.get("screen").width - 128) * (16 / 9)
  }
});

export default Onboarding;