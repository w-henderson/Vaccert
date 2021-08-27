import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "../onboarding/OnboardingStyles";
import { colours, nhs } from "../../globals";
import { Vaccination } from "../../types";
import DateTimePicker from '@react-native-community/datetimepicker';

import Button from "../../components/Button";
import SizedImage from "../../components/SizedImage";

interface VaccinationInputProps {
  callback: (vaccination: Vaccination) => void
}

interface VaccinationInputState {
  vaccine: string,
  batch: string,
  date: Date,
  dateEdited: boolean,
  displayDatePicker: boolean
}

class VaccinationInput extends React.Component<VaccinationInputProps, VaccinationInputState> {
  constructor(props: VaccinationInputProps) {
    super(props);
    this.state = {
      vaccine: "",
      batch: "",
      date: new Date(),
      dateEdited: false,
      displayDatePicker: false
    };

    this.updateDate = this.updateDate.bind(this);
    this.submit = this.submit.bind(this);
  }

  updateDate() {
    this.setState({ displayDatePicker: true });
  }

  submit() {
    this.props.callback({
      vaccine: this.state.vaccine,
      batch: this.state.batch,
      date: Math.floor(this.state.date.getTime() / 1000)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} style="light" />

        <SizedImage source={nhs} width={100} style={{ marginBottom: 32 }} />

        <View style={[styles.text, { flex: 0, marginBottom: 32 }]}>
          <Text style={styles.title}>Vaccination Details</Text>

          <TextInput
            placeholder="Vaccine Name"
            placeholderTextColor="#999"
            style={additionalStyles.textInput}
            autoCompleteType="off"
            value={this.state.vaccine}
            onChangeText={(name: string) => this.setState({ vaccine: name })} />
          <TextInput
            placeholder="Batch"
            placeholderTextColor="#999"
            style={additionalStyles.textInput}
            autoCompleteType="off"
            value={this.state.batch}
            onChangeText={(batch: string) => this.setState({ batch })} />
          <Text
            style={[additionalStyles.textInput, { color: this.state.dateEdited ? colours.dark : "#999" }]}
            onPress={this.updateDate}
            children={this.state.dateEdited ? dateFormat(this.state.date) : "Date of Vaccination"} />

          {this.state.displayDatePicker &&
            <DateTimePicker
              value={this.state.date}
              onChange={(_: any, date?: Date) => date !== undefined && this.setState({ date, displayDatePicker: false, dateEdited: true })} />
          }
        </View>

        <Button text="Generate QR Code" onPress={this.submit} />
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

export default VaccinationInput;