import React from "react";
import { Dimensions, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import SizedImage from "../../components/SizedImage";
import Button from "../../components/Button";

const hello = require("../../../assets/illustrations/hello.png");
const nhs = require("../../../assets/nhs.png");

interface WelcomeProps {
  styles: any,
  installCallback: () => void,
  verifyCallback: () => void
}

class Welcome extends React.Component<WelcomeProps> {
  render() {
    return (
      <View style={this.props.styles.container}>
        <StatusBar translucent={true} style="light" />

        <SizedImage source={nhs} width={100} />
        <SizedImage
          source={hello}
          width={Dimensions.get("window").width - 128}
          style={{ marginTop: 48 }} />

        <View style={this.props.styles.text}>
          <Text style={this.props.styles.title}>Welcome to the Vaccert app!</Text>
          <Text style={this.props.styles.body}>Let's start getting your Vaccert set up.</Text>
        </View>

        <Button text="Install a Vaccert" onPress={this.props.installCallback} />
        <Button text="Verify a Vaccert" onPress={this.props.verifyCallback} marginTop={true} />
      </View>
    )
  }
}

export default Welcome;