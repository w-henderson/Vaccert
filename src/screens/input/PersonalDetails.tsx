import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { styles } from "../onboarding/OnboardingStyles";
import { colours, dateFormat, nhs } from "../../globals";
import DateTimePicker from '@react-native-community/datetimepicker';

import Button from "../../components/Button";
import SizedImage from "../../components/SizedImage";

export interface PersonalDetailsResult {
  name: string,
  nhsNumber: string,
  dateOfBirth: number
}

interface PersonalDetailsProps {
  addVaccinationCallback: (details: PersonalDetailsResult) => void,
  addExpiryCallback: (details: PersonalDetailsResult) => void,
  backCallback: () => void
}

interface PersonalDetailsState {
  name: string,
  nhsNumber: string,
  dateOfBirth: Date,
  dateEdited: boolean,
  displayDatePicker: boolean
}

class PersonalDetails extends React.Component<PersonalDetailsProps, PersonalDetailsState> {
  constructor(props: PersonalDetailsProps) {
    super(props);
    this.state = {
      name: "",
      nhsNumber: "",
      dateOfBirth: new Date(),
      dateEdited: false,
      displayDatePicker: false
    };

    this.updateName = this.updateName.bind(this);
    this.updateNhsNumber = this.updateNhsNumber.bind(this);
    this.updateDob = this.updateDob.bind(this);
    this.addVaccination = this.addVaccination.bind(this);
    this.addExpiry = this.addExpiry.bind(this);
  }

  updateName(newName: string) {
    this.setState({ name: newName });
  }

  updateNhsNumber(newNumber: string) {
    let numberWithoutSpaces = newNumber.replace(/ /g, "");
    let formattedNumber = "";

    for (let i = 0; i < numberWithoutSpaces.length; i++) {
      if (i === 3 || i === 6) formattedNumber += " ";
      formattedNumber += numberWithoutSpaces[i];
    }

    this.setState({ nhsNumber: formattedNumber });
  }

  updateDob() {
    this.setState({ displayDatePicker: true });
  }

  addVaccination() {
    this.props.addVaccinationCallback({
      name: this.state.name,
      nhsNumber: this.state.nhsNumber,
      dateOfBirth: Math.floor(this.state.dateOfBirth.getTime() / 1000)
    });
  }

  addExpiry() {
    this.props.addExpiryCallback({
      name: this.state.name,
      nhsNumber: this.state.nhsNumber,
      dateOfBirth: Math.floor(this.state.dateOfBirth.getTime() / 1000)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} style="light" />

        {this.props.backCallback &&
          <IconButton
            icon="arrow-left"
            size={24}
            color={colours.lightest}
            style={styles.backButton}
            onPress={this.props.backCallback} />
        }

        <SizedImage source={nhs} width={100} style={{ marginBottom: 32 }} />

        <View style={[styles.text, { flex: 0, marginBottom: 32 }]}>
          <Text style={styles.title}>Personal Details</Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#999"
            style={additionalStyles.textInput}
            autoCompleteType="off"
            value={this.state.name}
            onChangeText={this.updateName} />
          <TextInput
            placeholder="NHS Number"
            placeholderTextColor="#999"
            style={additionalStyles.textInput}
            keyboardType="number-pad"
            autoCompleteType="off"
            value={this.state.nhsNumber}
            onChangeText={this.updateNhsNumber} />
          <Text
            style={[additionalStyles.textInput, { color: this.state.dateEdited ? colours.dark : "#999" }]}
            onPress={this.updateDob}
            children={this.state.dateEdited ? dateFormat(this.state.dateOfBirth) : "Date of Birth"} />

          {this.state.displayDatePicker &&
            <DateTimePicker
              value={this.state.dateOfBirth}
              onChange={(_: any, date?: Date) => date !== undefined && this.setState({ dateOfBirth: date, displayDatePicker: false, dateEdited: true })} />
          }
        </View>

        <View style={additionalStyles.buttons}>
          <Button text="Add Vaccination" onPress={this.addVaccination} />
          <Button text="Add Expiry Date" onPress={this.addExpiry} style={{ marginTop: 18 }} />
        </View>
      </View>
    )
  }
}

const additionalStyles = StyleSheet.create({
  textInput: {
    color: colours.dark,
    backgroundColor: colours.light,
    fontFamily: "Inter-Regular",
    fontSize: 18,
    padding: 12,
    borderRadius: 4,
    marginBottom: 16
  },
  buttons: {
    width: "100%"
  }
});

export default PersonalDetails;