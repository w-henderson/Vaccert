import React from "react";
import {
  Dimensions,
  LayoutAnimation,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ViewStyle
} from "react-native";

import { IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Vaccert } from "../types";
import { colours, nhs } from "../globals";

import QRCode from "react-native-qrcode-svg";
import SizedImage from "../components/SizedImage";
import Button from "../components/Button";
import SmallButton from "../components/SmallButton";
import Verify from "./Verify";

enum ClientPhase {
  Default,
  Verify
}

interface ClientProps {
  certificate: Vaccert,
  actionButtonText?: string,
  actionButtonCallback?: () => void
}

interface ClientState {
  informationHeight?: number,
  minimised: boolean,
  phase: ClientPhase
}

class Client extends React.Component<ClientProps, ClientState> {
  constructor(props: ClientProps) {
    super(props);
    this.state = { minimised: false, phase: ClientPhase.Default };
    this.updateHeight = this.updateHeight.bind(this);
    this.toggleMinimised = this.toggleMinimised.bind(this);
  }

  parseTimestamp(timestamp: number): string {
    let date = new Date(timestamp * 1000);
    return date.getDate().toString().padStart(2, "0") + "/"
      + (date.getMonth() + 1).toString().padStart(2, "0") + "/"
      + date.getFullYear().toString();
  }

  updateHeight(e: LayoutChangeEvent) {
    if (!this.state.informationHeight) {
      this.setState({ informationHeight: e.nativeEvent.layout.height });
    }
  }

  toggleMinimised() {
    LayoutAnimation.configureNext({
      duration: 200,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut
      }
    });

    this.setState({ minimised: !this.state.minimised });
  }

  render() {
    if (this.state.phase === ClientPhase.Default) {
      let minimisedStyling: ViewStyle = this.state.minimised ?
        { position: "absolute", bottom: 88 - this.state.informationHeight! } :
        { position: "relative" };
      let rotation: ViewStyle = this.state.minimised ?
        { transform: [{ rotate: "180deg" }] } :
        {};

      return (
        <View style={styles.container}>
          <StatusBar translucent={true} style="dark" />

          <View style={styles.codeContainer}>
            <QRCode
              value={JSON.stringify(this.props.certificate)}
              size={Dimensions.get("screen").width - (this.state.minimised ? 128 : 160)} />
          </View>

          <View style={[styles.infoContainer, minimisedStyling]} onLayout={this.updateHeight}>
            <View style={[styles.minimiseButton, rotation]}>
              <IconButton
                icon="chevron-down"
                size={32}
                onPress={this.toggleMinimised}
                background={TouchableNativeFeedback.Ripple("#bbccee", true)} />
            </View>

            <SizedImage source={nhs} width={100} />
            <Text style={[styles.nameText, { marginTop: this.state.minimised ? 32 : 16 }]}>
              {this.props.certificate.data.name}
            </Text>
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

            <Button
              text={this.props.actionButtonText ?? "Verify a Vaccert"}
              onPress={this.props.actionButtonCallback ?? (() => this.setState({ phase: ClientPhase.Verify }))}
              style={{ marginTop: 24 }} />
          </View>
        </View>
      );
    } else if (this.state.phase === ClientPhase.Verify) {
      return <Verify finishCallback={() => this.setState({ phase: ClientPhase.Default })} />
    }
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
    padding: 32,
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colours.accent
  },
  minimiseButton: {
    position: "absolute",
    top: 32,
    right: 32,
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: colours.lightest,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  nameText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 24,
    color: colours.lightest
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