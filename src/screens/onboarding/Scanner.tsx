import React from "react";
import { Dimensions, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconButton } from "react-native-paper";
import { BarCodeScanningResult, Camera } from "expo-camera";
import colours from "../../colours";

import SizedImage from "../../components/SizedImage";
import { Vaccert } from "../../types";

const nhs = require("../../../assets/nhs.png");

interface ScannerProps {
  styles: any,
  successCallback: (cert: Vaccert) => void,
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

        this.props.successCallback(json);
      }
    } catch (_) { }
  }

  render() {
    return (
      <View style={this.props.styles.container}>
        <StatusBar translucent={true} style="light" />

        <IconButton
          icon="arrow-left"
          size={24}
          color={colours.lightest}
          style={this.props.styles.backButton}
          onPress={this.props.backCallback} />

        <SizedImage source={nhs} width={100} />

        <View style={this.props.styles.cameraView}>
          <Camera
            style={this.props.styles.camera}
            ratio="16:9"
            onBarCodeScanned={this.parseVaccert} />
        </View>

        <View style={this.props.styles.text}>
          <Text style={this.props.styles.title}>Scan the code.</Text>
          <Text style={this.props.styles.body}>
            This QR code contains information about your vaccination and is the final step in obtaining your Vaccert.
          </Text>
        </View>
      </View>
    )
  }
}

export default Scanner;