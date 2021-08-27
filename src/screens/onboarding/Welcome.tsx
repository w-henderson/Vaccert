import React from "react";
import { Dimensions, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./OnboardingStyles";
import { nhs } from "../../globals";

import SizedImage from "../../components/SizedImage";
import Button from "../../components/Button";

const hello = require("../../../assets/illustrations/hello.png");

interface WelcomeProps {
  installCallback: () => void,
  verifyCallback: () => void,
  staffCallback: () => void
}

class Welcome extends React.Component<WelcomeProps> {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} style="light" />

        <SizedImage
          source={nhs}
          width={100}
          onPress={this.props.staffCallback} />
        <SizedImage
          source={hello}
          width={Dimensions.get("window").width - 128}
          style={{ marginTop: 48 }} />

        <View style={styles.text}>
          <Text style={styles.title}>Welcome to the Vaccert app!</Text>
          <Text style={styles.body}>Let's start getting your Vaccert set up.</Text>
        </View>

        <Button text="Install a Vaccert" onPress={this.props.installCallback} />
        <Button text="Verify a Vaccert" onPress={this.props.verifyCallback} style={{ marginTop: 18 }} />
      </View>
    )
  }
}

export default Welcome;