import React from "react";
import { Dimensions, Text, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconButton } from "react-native-paper";
import colours from "../../colours";

import SizedImage from "../../components/SizedImage";
import Button from "../../components/Button";

const camera = require("../../../assets/illustrations/camera.png");
const nhs = require("../../../assets/nhs.png");

interface PermissionsProps {
  styles: any,
  permissionCallback: () => void,
  backCallback: () => void
}

class Permissions extends React.Component<PermissionsProps> {
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
        <SizedImage
          source={camera}
          width={Dimensions.get("screen").width - 128}
          style={{ marginTop: 48 }} />

        <View style={this.props.styles.text}>
          <Text style={this.props.styles.title}>Please allow camera access.</Text>
          <Text style={this.props.styles.body}>This is required to scan the Vaccert QR code.</Text>
        </View>

        <Button text="Grant Permission" onPress={this.props.permissionCallback} />
      </View>
    )
  }
}

export default Permissions;