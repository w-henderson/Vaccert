import { Dimensions, StyleSheet } from "react-native";
import { colours } from "../../globals";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colours.accent,
    padding: 64,
  },
  backButton: {
    position: "absolute",
    top: 32,
    left: 32
  },
  text: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    width: "100%"
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    textAlign: "center",
    color: colours.lightest,
    marginBottom: 24
  },
  body: {
    fontFamily: "Inter-Regular",
    fontSize: 22,
    textAlign: "center",
    color: colours.lightest
  },
  cameraView: {
    position: "relative",
    width: "100%",
    height: Dimensions.get("screen").width - 128,
    marginTop: 48,
    borderRadius: 8,
    overflow: "hidden",
  },
  camera: {
    position: "absolute",
    width: "100%",
    height: (Dimensions.get("screen").width - 128) * (16 / 9)
  }
});