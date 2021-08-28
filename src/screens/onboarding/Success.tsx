import React from "react";
import { Dimensions, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./OnboardingStyles";
import { nhs } from "../../globals";

import SizedImage from "../../components/SizedImage";
import Button from "../../components/Button";

const success = require("../../../assets/illustrations/confirmed.png");

interface SuccessProps {
  finishCallback: () => void,
}

class Success extends React.Component<SuccessProps> {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} style="light" />

        <SizedImage source={nhs} width={100} />
        <SizedImage
          source={success}
          width={Dimensions.get("window").width - 192}
          style={{ marginTop: 48 }} />

        <View style={styles.text}>
          <Text style={styles.title}>Success!</Text>
          <Text style={styles.body}>Your Vaccert has been successfully installed.</Text>
        </View>

        <Button text="Show Me" onPress={this.props.finishCallback} />
      </View>
    )
  }
}

export default Success;