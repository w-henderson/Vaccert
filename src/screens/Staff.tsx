import React from "react";
import { Text, Dimensions, View, StyleSheet, Alert } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { BarCodeScanningResult } from "expo-camera";
import { ClientData, StaffData, Vaccert, Vaccination } from "../types";
import { styles } from "./onboarding/OnboardingStyles";
import { colours, nhs } from "../globals";
import * as SecureStore from "expo-secure-store";

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
  Loading,
  Permissions,
  Scan,
  Menu,
  PersonalDetails,
  OldCode,
  Vaccination,
  Result
}

interface StaffProps {
  backCallback: () => void,
  reset: () => void
}

interface StaffState {
  phase: StaffPhase,
  menuActive: boolean,
  newUserDetails?: PersonalDetailsResult,
  newUserVaccinations?: Vaccination[],
  staffData?: StaffData
}

class Staff extends React.Component<StaffProps, StaffState> {
  constructor(props: StaffProps) {
    super(props);
    this.state = { phase: StaffPhase.Loading, menuActive: false };
    this.parseStaffCode = this.parseStaffCode.bind(this);
    this.detailsCallback = this.detailsCallback.bind(this);
    this.vaccinationCallback = this.vaccinationCallback.bind(this);
    this.scannedOldCode = this.scannedOldCode.bind(this);
    this.removeStaffKey = this.removeStaffKey.bind(this);
  }

  componentDidMount() {
    SecureStore.getItemAsync("VACCERT_STAFF").then(staff => {
      if (staff !== null) {
        let staffData = JSON.parse(staff);

        let key = new PrivateKey(staffData.key);
        this.setState({
          staffData: {
            name: staffData.name,
            id: staffData.id,
            key
          },
          phase: StaffPhase.Menu
        });
      } else {
        this.setState({ phase: StaffPhase.Permissions });
      }
    });
  }

  async parseStaffCode(code: BarCodeScanningResult) {
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

        await SecureStore.setItemAsync("VACCERT_MODE", "staff");
        await SecureStore.setItemAsync("VACCERT_STAFF", code.data);
      }
    } catch (_) { }
  }

  detailsCallback(details: PersonalDetailsResult) {
    this.setState({
      newUserDetails: details,
      phase: StaffPhase.Vaccination
    });
  }

  vaccinationCallback(dose: Vaccination) {
    let vaccinations = this.state.newUserVaccinations;
    if (vaccinations !== undefined) vaccinations?.push(dose);
    else vaccinations = [dose];

    this.setState({
      newUserVaccinations: vaccinations,
      phase: StaffPhase.Result
    });
  }

  scannedOldCode(cert: Vaccert) {
    this.setState({
      newUserDetails: {
        name: cert.data.name,
        nhsNumber: cert.data.nhsNumber,
        dateOfBirth: cert.data.dateOfBirth
      },
      newUserVaccinations: cert.data.vaccinations,
      phase: StaffPhase.Vaccination
    });
  }

  removeStaffKey() {
    Alert.alert(
      "Remove Staff Key",
      "Are you sure you want to remove your staff key? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => this.setState({ menuActive: false })
        },
        {
          text: "OK",
          onPress: this.props.reset!
        }
      ]);
  }

  render() {
    switch (this.state.phase) {
      case StaffPhase.Loading:
        return <View style={{ backgroundColor: colours.accent }} />

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
            <StatusBar
              translucent={false}
              style="light"
              backgroundColor={colours.accent} />

            <IconButton
              icon="dots-vertical"
              size={28}
              color={colours.light}
              style={additionalStyles.icon}
              onPress={() => this.setState({ menuActive: true })} />

            <Menu
              visible={this.state.menuActive}
              onDismiss={() => this.setState({ menuActive: false })}
              anchor={{ x: Dimensions.get("screen").width - 16, y: 0 }}
              contentStyle={additionalStyles.menu}>

              <Menu.Item
                onPress={this.removeStaffKey}
                title="Remove Staff Key"
                titleStyle={additionalStyles.menuItem} />
            </Menu>

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

      case StaffPhase.Vaccination:
        return <VaccinationInput callback={this.vaccinationCallback} />

      case StaffPhase.OldCode:
        return <Scanner
          backCallback={() => this.setState({ phase: StaffPhase.Menu })}
          successCallback={this.scannedOldCode}
          bodyText="This code will be modified and re-signed to add and certify the second vaccine dose." />

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

const additionalStyles = StyleSheet.create({
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 24,
    color: colours.dark
  },
  menu: {
    color: colours.dark,
    backgroundColor: colours.light
  },
  menuItem: {
    color: colours.dark
  }
});

export default Staff;