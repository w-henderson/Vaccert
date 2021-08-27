import React from "react";
import { Text, Dimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BarCodeScanningResult } from "expo-camera";
import { StaffData } from "../types";
import { styles } from "./onboarding/OnboardingStyles";

import SizedImage from "../components/SizedImage";
import Button from "../components/Button";

import Permissions from "./onboarding/Permissions";
import Scanner from "./onboarding/Scanner";
import PrivateKey from "../crypto/privatekey";

const nhs = require("../../assets/nhs.png");
const staffImage = require("../../assets/illustrations/staff.png");

enum StaffPhase {
  Permissions,
  Scan,
  Menu
}

interface StaffProps {
  backCallback: () => void
}

interface StaffState {
  phase: StaffPhase,
  staffData?: StaffData
}

class Staff extends React.Component<StaffProps, StaffState> {
  constructor(props: StaffProps) {
    super(props);
    this.state = { phase: StaffPhase.Permissions };
    this.parseStaffCode = this.parseStaffCode.bind(this);
  }

  parseStaffCode(code: BarCodeScanningResult) {
    try {
      let json = JSON.parse(code.data);

      // Check whether the required fields are present
      if (json.name !== undefined &&
        json.id !== undefined &&
        json.key !== undefined) {

        let key = new PrivateKey(json.key);
        this.setState({
          staffData: {
            name: json.name,
            id: json.id,
            key
          },
          phase: StaffPhase.Menu
        });
      }
    } catch (_) { }
  }

  render() {
    switch (this.state.phase) {
      case StaffPhase.Permissions:
        return (
          <Permissions
            backCallback={this.props.backCallback}
            permissionCallback={() => this.setState({ phase: StaffPhase.Scan })} />
        );

      case StaffPhase.Scan:
        return (
          <Scanner
            bodyText="This contains your private key, which is used to digitally sign Vaccerts."
            backCallback={this.props.backCallback}
            parseCallback={this.parseStaffCode} />
        )

      case StaffPhase.Menu:
        return (
          <View style={styles.container}>
            <StatusBar translucent={true} style="light" />

            <SizedImage source={nhs} width={100} />
            <SizedImage
              source={staffImage}
              width={Dimensions.get("window").width - 128}
              style={{ marginTop: 48 }} />

            <View style={styles.text}>
              <Text style={styles.title}>Staff Mode</Text>
              <Text style={styles.body}>Welcome back to Vaccert, {this.state.staffData!.name}.</Text>
            </View>

            <Button text="Create New Vaccert" onPress={() => { }} />
            <Button text="Add Second Dose" onPress={() => { }} style={{ marginTop: 18 }} />
          </View>
        )
    }
  }
}

export default Staff;