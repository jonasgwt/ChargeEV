import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import RNPickerSelect from "react-native-picker-select";
import { DismissKeyboardView } from "../../resources/DismissKeyboardView";
import { ScrollView } from "react-native-gesture-handler";

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
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const asyncFunc = async () => {
      console.log(city);
      await getStates(country);
    };
    asyncFunc();
  }, [country]);

  async function getStates(countryCode) {
    if (countryCode == "") {
      setCity("");
      return;
    } else if (countryCode == "SG") {
      setStates([{ label: "Singapore", value: "Singapore" }]);
      return;
    }
    setLoading(true);
    await fetch(
      "https://battuta.medunes.net/api/region/" +
        countryCode +
        "/all/?key=848a8d354030b7e0ae7a3a18d9f828ef"
    )
      .catch((err) => console.log(err))
      .then((response) => response.json())
      .then((data) => {
        let check = city == "";
        setStates(
          data.map((x) => {
            check = check || x.region == city;
            return {
              label: x.region,
              value: x.region,
            };
          })
        );
        if (!check) setCity("");
      });
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <DismissKeyboardView>
          <RNPickerSelect
            onValueChange={async (input) => {
              setCountry(input);
              await getStates(input);
            }}
            placeholder={{
              label: "Select your country",
              value: "",
            }}
            value={country}
            items={[
              { label: "United States", value: "US" },
              { label: "Singapore", value: "SG" },
            ]}
            style={{
              ...pickerSelectStyles,
            }}
          />
          <View style={{ padding: "2.5%" }} />
          {loading ? (
            <Input
              inputContainerStyle={styles.input}
              containerStyle={{ width: "105%", marginBottom: "-7.5%" }}
              placeholder="Loading..."
              inputStyle={{ fontSize: 20, fontFamily: "Inter-Regular" }}
              disabled={true}
            />
          ) : (
            <RNPickerSelect
              onValueChange={setCity}
              value={city}
              placeholder={{
                label: "Select your city",
                value: "",
              }}
              items={states}
              style={pickerSelectStyles}
            />
          )}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "95%",
    padding: "5%",
    borderColor: "#707070",
    marginLeft: "2.5%",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
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
    alignContent: "center",
    width: "100%",
  },
});
