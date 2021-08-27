import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "../onboarding/OnboardingStyles";
import { colours, nhs } from "../../globals";
import DateTimePicker from '@react-native-community/datetimepicker';

import Button from "../../components/Button";
import SizedImage from "../../components/SizedImage";

export interface PersonalDetailsResult {
  name: string,
  nhsNumber: string,
  dateOfBirth: number
}

interface PersonalDetailsProps {
  callback: (details: PersonalDetailsResult) => void
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
    this.submit = this.submit.bind(this);
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

  submit() {
    this.props.callback({
      name: this.state.name,
      nhsNumber: this.state.nhsNumber,
      dateOfBirth: Math.floor(this.state.dateOfBirth.getTime() / 1000)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} style="light" />

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

        <Button text="Continue" onPress={this.submit} />
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
  }
});

const dateFormat = (date: Date) => date.getDate().toString().padStart(2, "0") + "/"
  + (date.getMonth() + 1).toString().padStart(2, "0") + "/"
  + date.getFullYear().toString();

export default PersonalDetails;