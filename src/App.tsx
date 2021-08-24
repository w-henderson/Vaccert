import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { loadAsync } from "expo-font";

import SvgQRCode from "react-native-qrcode-svg";

interface AppState {
  loaded: boolean
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = { loaded: false };
  }

  componentDidMount() {
    loadAsync({
      "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
      "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
      "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf")
    }).then(() => {
      this.setState({ loaded: true });
    })
  }

  render() {
    if (!this.state.loaded) return null;

    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <SvgQRCode value="https://google.com" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter-Bold"
  }
});

export default App;