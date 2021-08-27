import React from "react";
import { Dimensions, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconButton } from "react-native-paper";
import { styles } from "./OnboardingStyles";
import { colours, nhs } from "../../globals";

import SizedImage from "../../components/SizedImage";
import Button from "../../components/Button";

const camera = require("../../../assets/illustrations/camera.png");

interface PermissionsProps {
  permissionCallback: () => void,
  backCallback: () => void
}

class Permissions extends React.Component<PermissionsProps> {
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
        <SizedImage
          source={camera}
          width={Dimensions.get("screen").width - 128}
          style={{ marginTop: 48 }} />

        <View style={styles.text}>
          <Text style={styles.title}>Please allow camera access.</Text>
          <Text style={styles.body}>This is required to scan the Vaccert QR code.</Text>
        </View>

        <Button text="Grant Permission" onPress={this.props.permissionCallback} />
      </View>
    )
  }
}

export default Permissions;