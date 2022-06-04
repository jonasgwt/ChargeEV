import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, Input } from "@rneui/themed";
import { authentication, firestore } from "../firebase/firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrorMessage] = useState("");

  // Registers user
  const handleRegister = async (e) => {
    if (firstName == "" || lastName == "" || email == "" || password == "") {
      setErrorMessage("Ensure that all fields are filled");
    } else {
      try {
        const { user } = await createUserWithEmailAndPassword(
          authentication,
          email,
          password
        );
        await setDoc(doc(firestore, "users", user.uid), {
          email: email,
          fname: firstName,
          lname: lastName,
          userImg: null,
          phone: phone,
        });
        console.log(`User ${user.uid} created`);
        await updateProfile(user, {
          displayName: firstName + " " + lastName,
        });
        console.log(`User profile ${user.displayName} updated`);
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
        navigation.navigate("Home");
      } catch (err) {
        console.log(err)
        console.log(err.code);
        switch (err.code) {
          case "auth/invalid-email":
            setErrorMessage("Email is not valid");
            Alert.alert("Email is not valid");
            break;
          case "auth/email-already-in-use":
            setErrorMessage("Email already in use");
            Alert.alert("Email already in use");
            break;
          case "auth/weak-password":
            setErrorMessage("Password needs to be at least 6 characters");
            Alert.alert("Password needs to be at least 6 characters");
            break;
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.titleContainer}>
        <Text h1>Create Account</Text>
        <Text h2>An account for all your EV needs</Text>
        <Text h4 style={{ color: "red", marginTop: 5 }}>
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
          containerStyle={{ width: "50%" }}
          placeholder="First Name"
          onChangeText={setfirstName}
          textContentType="name"
          autoCompleteType="name"
        />
        <Input
          inputContainerStyle={{ width: "100%" }}
          containerStyle={{ width: "50%" }}
          placeholder="Last Name"
          onChangeText={setlastName}
          textContentType="name"
          autoCompleteType="name"
        />
      </View>
      <Input
        placeholder="Phone"
        onChangeText={setPhone}
      />
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
    marginBottom: "30%",
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
