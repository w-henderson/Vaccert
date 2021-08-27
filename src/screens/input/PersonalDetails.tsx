import React from "react";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "../onboarding/OnboardingStyles";
import { nhs } from "../../globals";

import Button from "../../components/Button";
import SizedImage from "../../components/SizedImage";

class PersonalDetails extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} style="light" />

        <SizedImage source={nhs} width={100} />

        <View style={styles.text}>
          <Text style={styles.title}>Title</Text>
          <Text style={styles.body}>Body</Text>
        </View>

        <Button text="Okay" onPress={() => { }} />
      </View>
    )
  }
}

export default PersonalDetails;