import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Axios from "axios";
import { color } from "react-native-elements/dist/helpers";
import { Button, Text, Input } from "@rneui/themed";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrorMessage] = useState("");

  const handleRegister = () => {
    if (
      email.length == 0 ||
      firstName.length == 0 ||
      lastName.length == 0 ||
      password.length == 0
    ) {
      setErrorMessage("Ensure all fields are filled up");
    } else {
      setErrorMessage("");
      Axios.post("http://chargeev.api.nhhs-sjb.org:3000/api/register", {
        userEmail: email,
        userFirstName: firstName,
        userLastName: lastName,
        userPassword: password,
      })
        .then(() => {
          console.log("successfully registered");
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.titleContainer}>
        <Text h1>Create Account</Text>
        <Text h2>Lorem ipsum dolor sit amet</Text>
        <Text h4 style={{ color: "red", marginTop: 10 }}>
          {error}
        </Text>
      </SafeAreaView>
      <Input
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <View style={styles.nameContainer}>
        <Input
          inputContainerStyle={{ width: "100%" }}
          containerStyle = {{width: "50%"}}
          placeholder="First Name"
          onChangeText={setfirstName}
          textContentType="name"
          autoCompleteType="name"
        />
        <Input
          inputContainerStyle={{ width: "100%" }}
          containerStyle = {{width: "50%"}}
          placeholder="Last Name"
          onChangeText={setlastName}
          textContentType="name"
          autoCompleteType="name"
        />
      </View>
      <Input
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button
        title="Register"
        buttonStyle={{ width: 330, height: 50 }}
        containerStyle={{ marginTop: 10 }}
        onPress={handleRegister}
      />
      <Text h4 style={{ marginTop: 20 }}>
        Already have an account?{" "}
        <Text
          style={{ color: "#1BB530", textDecorationLine: "underline" }}
          onPress={() => navigation.navigate("Login")}
        >
          Sign in
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    background:
      "linear-gradient(225deg, #FFFFFF 0%, #EFF1F5 100%, #EFF1F5 100%)",
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
    marginBottom: "30%"
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    width: "95%",
  },
});
