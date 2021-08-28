import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { styles } from "../onboarding/OnboardingStyles";
import { colours, dateFormat, nhs } from "../../globals";
import DateTimePicker from '@react-native-community/datetimepicker';

import Button from "../../components/Button";
import SizedImage from "../../components/SizedImage";

interface ExpiryDateProps {
  callback: (date: number) => void,
  backCallback?: () => void
}

interface ExpiryDateState {
  date: Date,
  dateEdited: boolean,
  displayDatePicker: boolean
}

class ExpiryDate extends React.Component<ExpiryDateProps, ExpiryDateState> {
  constructor(props: ExpiryDateProps) {
    super(props);
    this.state = {
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
    this.props.callback(Math.floor(this.state.date.getTime() / 1000));
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
          <Text style={styles.title}>Expiry Date</Text>
          <Text style={styles.body}>The code will be valid until the end of the specified day.</Text>

          <Text
            style={[additionalStyles.textInput, { color: this.state.dateEdited ? colours.dark : "#999" }]}
            onPress={this.updateDate}
            children={this.state.dateEdited ? dateFormat(this.state.date) : "Expiry Date"} />

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
    marginTop: 32,
    marginBottom: 16
  }
});

export default ExpiryDate;