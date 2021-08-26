import React from "react";
import { Dimensions, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import { IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Vaccert } from "../types";
import colours from "../colours";

import QRCode from "react-native-qrcode-svg";
import SizedImage from "../components/SizedImage";
import Button from "../components/Button";
import SmallButton from "../components/SmallButton";

const nhs = require("../../assets/nhs.png");

interface ClientProps {
  certificate: Vaccert
}

class Client extends React.Component<ClientProps> {
  parseTimestamp(timestamp: number): string {
    let date = new Date(timestamp * 1000);
    return date.getDate().toString().padStart(2, "0") + "/"
      + (date.getMonth() + 1).toString().padStart(2, "0") + "/"
      + date.getFullYear().toString();
  }

  render() {


    return (
      <View style={styles.container}>
        <StatusBar translucent={true} style="dark" />

        <View style={styles.codeContainer}>
          <QRCode
            value={JSON.stringify(this.props.certificate)}
            size={Dimensions.get("screen").width - 160} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.minimiseButton}>
            <IconButton
              icon="chevron-down"
              size={32}
              onPress={() => { }}
              background={TouchableNativeFeedback.Ripple("#bbccee", true)} />
          </View>

          <SizedImage source={nhs} width={100} />
          <Text style={styles.nameText}>{this.props.certificate.data.name}</Text>
          <Text style={styles.subtitle}>
            {this.props.certificate.data.nhsNumber} • {this.parseTimestamp(this.props.certificate.data.dateOfBirth)}
          </Text>

          <View style={styles.buttons}>
            <SmallButton
              text={this.parseTimestamp(this.props.certificate.data.vaccinations[0].date)}
              onPress={() => { }}
              style={[styles.button, { marginRight: 12 }]} />
            <SmallButton
              text={this.props.certificate.data.vaccinations.length > 1 ?
                this.parseTimestamp(this.props.certificate.data.vaccinations[1].date) :
                "Pending"}
              onPress={() => { }}
              style={[styles.button, { marginLeft: 12 }]} />
          </View>

          <Button text="Verify a Vaccert" onPress={() => { }} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colours.light
  },
  codeContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  infoContainer: {
    position: "relative",
    padding: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colours.accent
  },
  minimiseButton: {
    position: "absolute",
    top: 32,
    right: 32,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colours.lightest,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  nameText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 24,
    color: colours.lightest,
    marginTop: 16
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: colours.lightest,
    marginBottom: 20
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    flex: 1
  }
});

export default Client;