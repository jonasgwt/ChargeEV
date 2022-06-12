import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import RNPickerSelect from "react-native-picker-select";
import { DismissKeyboardView } from "../../resources/DismissKeyboardView";

export default function Address({
  country,
  setCountry,
  city,
  setCity,
  address,
  setAddress,
  unitNumber,
  setUnitNumber,
  postalCode,
  setPostalCode,
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <DismissKeyboardView
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <RNPickerSelect
          onValueChange={setCountry}
          placeholder={{
            label: "Select your country",
            value: "",
          }}
          value={country}
          items={[{ label: "United States", value: "US" }]}
          style={{
            ...pickerSelectStyles,
          }}
        />
        <View style={{ padding: "2.5%" }} />
        <RNPickerSelect
          onValueChange={setCity}
          value={city}
          placeholder={{
            label: "Select your city",
            value: "",
          }}
          items={[
            { label: "San Jose", value: "San Jose" },
            { label: "San Francisco", value: "San Francisco" },
            { label: "Los Angeles", value: "Los Angeles" },
            { label: "New York", value: "New York" },
          ]}
          style={pickerSelectStyles}
        />
        <View style={{ padding: "2.5%" }} />
        <Input
          inputContainerStyle={styles.input}
          containerStyle={{ width: "105%" }}
          value={address}
          textContentType="fullStreetAddress"
          placeholder="Enter your address"
          inputStyle={{ fontSize: 20, fontFamily: "Inter-Regular" }}
          onChangeText={setAddress}
        />
        <View style={styles.addressContainer}>
          <Input
            inputContainerStyle={styles.input}
            containerStyle={{ width: "52.5%" }}
            value={unitNumber}
            placeholder="Unit Number"
            inputStyle={{ fontSize: 20, fontFamily: "Inter-Regular" }}
            onChangeText={setUnitNumber}
          />
          <Input
            inputContainerStyle={styles.input}
            containerStyle={{ width: "52.5%" }}
            value={postalCode}
            placeholder="Postal Code"
            textContentType="postalCode"
            keyboardType="number-pad"
            inputStyle={{ fontSize: 20, fontFamily: "Inter-Regular" }}
            onChangeText={setPostalCode}
          />
        </View>
      </DismissKeyboardView>
    </KeyboardAvoidingView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    padding: "5%",
    borderColor: "#707070",
    borderWidth: 1,
    fontFamily: "Inter-Regular",
    fontSize: 20,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.101961)",
    shadowOpacity: 100,
    shadowRadius: 10,
    borderRadius: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    fontSize: 20,
    borderColor: "#707070",
  },
  addressContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
  },
});
