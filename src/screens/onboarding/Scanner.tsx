import React from "react";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconButton } from "react-native-paper";
import { BarCodeScanningResult, Camera } from "expo-camera";
import { styles } from "./OnboardingStyles";
import { colours, nhs } from "../../globals";

import SizedImage from "../../components/SizedImage";
import { Vaccert } from "../../types";

interface ScannerProps {
  bodyText: string,
  successCallback?: (cert: Vaccert) => void,
  parseCallback?: (data: BarCodeScanningResult) => void,
  backCallback: () => void
}

class Scanner extends React.Component<ScannerProps> {
  constructor(props: ScannerProps) {
    super(props);
    this.parseVaccert = this.parseVaccert.bind(this);
  }

  parseVaccert(data: BarCodeScanningResult) {
    try {
      let json = JSON.parse(data.data);

      // Check whether the required fields are present
      if (json.data !== undefined &&
        json.signatureId !== undefined &&
        json.signature !== undefined &&
        json.data.name !== undefined &&
        json.data.nhsNumber !== undefined &&
        json.data.dateOfBirth !== undefined &&
        Array.isArray(json.data.vaccinations) &&
        json.data.vaccinations.map((v: any) => {
          return v.date !== undefined && v.vaccine !== undefined && v.batch !== undefined;
        }).every((x: any) => x === true)) {

        this.props.successCallback!(json);
      }
    } catch (_) { }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} style="light" />

        <IconButton
          icon="arrow-left"
          size={24}
          color={colours.lightest}
          style={styles.backButton}
          onPress={this.props.backCallback} />

        <SizedImage source={nhs} width={100} />

        <View style={styles.cameraView}>
          <Camera
            style={styles.camera}
            ratio="16:9"
            onBarCodeScanned={this.props.parseCallback ?? this.parseVaccert} />
        </View>

        <View style={styles.text}>
          <Text style={styles.title}>Scan the code.</Text>
          <Text style={styles.body}>
            {this.props.bodyText}
          </Text>
        </View>
      </View>
    )
  }
}

export default Scanner;