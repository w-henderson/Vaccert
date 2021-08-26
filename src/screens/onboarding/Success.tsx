import React from "react";
import { Dimensions, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import SizedImage from "../../components/SizedImage";
import Button from "../../components/Button";

const success = require("../../../assets/illustrations/confirmed.png");
const nhs = require("../../../assets/nhs.png");

interface SuccessProps {
  styles: any,
  finishCallback: () => void,
}

class Success extends React.Component<SuccessProps> {
  render() {
    return (
      <View style={this.props.styles.container}>
        <StatusBar translucent={true} style="light" />

        <SizedImage source={nhs} width={100} />
        <SizedImage
          source={success}
          width={Dimensions.get("window").width - 128}
          style={{ marginTop: 48 }} />

        <View style={this.props.styles.text}>
          <Text style={this.props.styles.title}>Success!</Text>
          <Text style={this.props.styles.body}>Your Vaccert has been successfully installed.</Text>
        </View>

        <Button text="Show Me" onPress={this.props.finishCallback} />
      </View>
    )
  }
}

export default Success;