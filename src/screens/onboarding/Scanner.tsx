import React from "react";
import { Dimensions, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconButton } from "react-native-paper";
import { Camera } from "expo-camera";
import colours from "../../colours";

import SizedImage from "../../components/SizedImage";

const nhs = require("../../../assets/nhs.png");

interface ScannerProps {
  styles: any,
  successCallback: (data: string) => void,
  backCallback: () => void
}

class Scanner extends React.Component<ScannerProps> {
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
            onBarCodeScanned={({ data }) => this.props.successCallback(data)} />
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