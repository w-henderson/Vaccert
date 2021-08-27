import React from "react";
import { Camera } from "expo-camera";

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

interface OnboardingProps {
  clientCallback: (cert: Vaccert) => void,
  verifyCallback: () => void,
  staffCallback: () => void
}

interface OnboardingState {
  phase: OnboardingPhase,
  certificate?: Vaccert
}

class Onboarding extends React.Component<OnboardingProps, OnboardingState> {
  constructor(props: OnboardingProps) {
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
          installCallback={() => this.setState({ phase: OnboardingPhase.Permission })}
          verifyCallback={this.props.verifyCallback}
          staffCallback={this.props.staffCallback} />;

      case OnboardingPhase.Permission:
        return <Permissions
          permissionCallback={this.grantPermissions}
          backCallback={() => this.setState({ phase: OnboardingPhase.Welcome })} />;

      case OnboardingPhase.Scan:
        return <Scanner
          bodyText="This QR code contains information about your vaccination and is the final step in obtaining your Vaccert."
          successCallback={this.finish}
          backCallback={() => this.setState({ phase: OnboardingPhase.Permission })} />

      case OnboardingPhase.Success:
        return <Success
          finishCallback={() => this.props.clientCallback(this.state.certificate!)} />;
    }
  }
}

export default Onboarding;