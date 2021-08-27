import React from "react";
import { Text, Dimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BarCodeScanningResult } from "expo-camera";
import { ClientData, StaffData, Vaccert, Vaccination } from "../types";
import { styles } from "./onboarding/OnboardingStyles";
import { nhs } from "../globals";

import SizedImage from "../components/SizedImage";
import Button from "../components/Button";

import Permissions from "./onboarding/Permissions";
import Scanner from "./onboarding/Scanner";
import VaccinationInput from "./input/VaccinationInput";
import Client from "./Client";
import PersonalDetails, { PersonalDetailsResult } from "./input/PersonalDetails";

import PrivateKey from "../crypto/privatekey";

const staffImage = require("../../assets/illustrations/staff.png");

enum StaffPhase {
  Permissions,
  Scan,
  Menu,
  PersonalDetails,
  DoseOne,
  OldCode,
  DoseTwo,
  Result
}

interface StaffProps {
  backCallback: () => void
}

interface StaffState {
  phase: StaffPhase,
  newUserDetails?: PersonalDetailsResult,
  newUserVaccinations?: Vaccination[],
  staffData?: StaffData
}

class Staff extends React.Component<StaffProps, StaffState> {
  constructor(props: StaffProps) {
    super(props);
    this.state = { phase: StaffPhase.Permissions };
    this.parseStaffCode = this.parseStaffCode.bind(this);
    this.detailsCallback = this.detailsCallback.bind(this);
    this.doseOneCallback = this.doseOneCallback.bind(this);
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

  detailsCallback(details: PersonalDetailsResult) {
    this.setState({
      newUserDetails: details,
      phase: StaffPhase.DoseOne
    });
  }

  doseOneCallback(dose: Vaccination) {
    let vaccinations = this.state.newUserVaccinations;
    if (vaccinations !== undefined) vaccinations?.push(dose);
    else vaccinations = [dose];

    this.setState({
      newUserVaccinations: vaccinations,
      phase: StaffPhase.Result
    });
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

            <Button text="Create New Vaccert" onPress={() => this.setState({ phase: StaffPhase.PersonalDetails })} />
            <Button text="Add Second Dose" onPress={() => this.setState({ phase: StaffPhase.OldCode })} style={{ marginTop: 18 }} />
          </View>
        )

      case StaffPhase.PersonalDetails:
        return <PersonalDetails callback={this.detailsCallback} />

      case StaffPhase.DoseOne:
        return <VaccinationInput callback={this.doseOneCallback} />

      case StaffPhase.Result: {
        let unsignedCertificate: ClientData = {
          name: this.state.newUserDetails!.name,
          nhsNumber: this.state.newUserDetails!.nhsNumber,
          dateOfBirth: this.state.newUserDetails!.dateOfBirth,
          vaccinations: this.state.newUserVaccinations!
        };

        let unsignedCertificateString = JSON.stringify(unsignedCertificate);
        let signedCertificateString = this.state.staffData!.key.sign(unsignedCertificateString);

        let signedCertificate: Vaccert = {
          data: unsignedCertificate,
          signature: signedCertificateString,
          signatureId: this.state.staffData!.id
        }

        return <Client
          certificate={signedCertificate}
          actionButtonText="Finish"
          actionButtonCallback={() => this.setState({ phase: StaffPhase.Menu })} />
      }
    }
  }
}

export default Staff;