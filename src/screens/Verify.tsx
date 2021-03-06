import React from "react";
import { Dimensions, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";
import { Vaccert } from "../types";
import { styles } from "./onboarding/OnboardingStyles";
import { colours, nhs } from "../globals";

import { verify } from "../crypto/certification";

import Permissions from "./onboarding/Permissions";
import Scanner from "./onboarding/Scanner";
import SizedImage from "../components/SizedImage";
import Button from "../components/Button";

const valid = require("../../assets/illustrations/valid.png");
const invalid = require("../../assets/illustrations/invalid.png");

enum VerifyPhase {
  Loading,
  Permissions,
  Scanner,
  Result
}

interface VerifyProps {
  finishCallback: () => void
}

interface VerifyState {
  phase: VerifyPhase,
  verificationResult?: boolean,
  attemptingToVerify: boolean
}

class Verify extends React.Component<VerifyProps, VerifyState> {
  constructor(props: VerifyProps) {
    super(props);
    this.state = { phase: VerifyPhase.Loading, attemptingToVerify: false }
    this.requestPermissions = this.requestPermissions.bind(this);
    this.verifySignature = this.verifySignature.bind(this);
  }

  componentDidMount() {
    Camera.getPermissionsAsync().then(({ status }) => {
      if (status === "granted") {
        this.setState({ phase: VerifyPhase.Scanner });
      } else {
        this.setState({ phase: VerifyPhase.Permissions });
      }
    });
  }

  requestPermissions() {
    Camera.requestPermissionsAsync().then(({ status }) => {
      if (status === "granted") {
        this.setState({ phase: VerifyPhase.Scanner });
      }
    });
  }

  verifySignature(cert: Vaccert) {
    if (!this.state.attemptingToVerify) {
      this.setState({ attemptingToVerify: true });

      // Verify the expiry date is valid
      if (cert.data.expiryDate) {
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let currentTimestamp = Math.floor(currentDate.getTime() / 1000);

        let expiryDate = new Date(cert.data.expiryDate * 1000);
        expiryDate.setHours(0, 0, 0, 0);
        let expiryTimestamp = Math.floor(expiryDate.getTime() / 1000);

        console.log({ currentTimestamp, expiryTimestamp });

        if (expiryTimestamp < currentTimestamp) {
          this.setState({
            verificationResult: false,
            attemptingToVerify: false,
            phase: VerifyPhase.Result
          });
          return;
        }
      }

      // Verify the signature is valid
      verify(cert).then(result => {
        this.setState({
          verificationResult: result,
          attemptingToVerify: false,
          phase: VerifyPhase.Result
        });
      })
    }
  }

  render() {
    switch (this.state.phase) {
      case VerifyPhase.Loading: return (
        <View style={{ flex: 1, backgroundColor: colours.accent }}>
          <StatusBar translucent={true} style="light" />
        </View>
      );

      case VerifyPhase.Permissions:
        return (
          <Permissions
            backCallback={this.props.finishCallback}
            permissionCallback={this.requestPermissions} />
        );

      case VerifyPhase.Scanner:
        return (
          <Scanner
            bodyText="This can be found in the Vaccert app on the person's device and requires an internet connection for verification."
            backCallback={this.props.finishCallback}
            successCallback={this.verifySignature} />
        )

      case VerifyPhase.Result:
        return (
          <View style={styles.container}>
            <StatusBar translucent={true} style="light" />

            <SizedImage source={nhs} width={100} />
            <SizedImage
              source={this.state.verificationResult ? valid : invalid}
              width={Dimensions.get("window").width - 192}
              style={{ marginTop: 48 }} />

            <View style={styles.text}>
              <Text style={styles.title}>{this.state.verificationResult ? "It's valid!" : "Invalid certificate."}</Text>
              <Text style={styles.body}>{this.state.verificationResult ?
                "This Vaccert's digital signature was successfully verified using keys stored on our servers." :
                "This Vaccert's digital signature appears to be invalid or expired."
              }</Text>
            </View>

            <Button text="Okay" onPress={this.props.finishCallback} />
          </View>
        )
    }
  }
}

export default Verify;