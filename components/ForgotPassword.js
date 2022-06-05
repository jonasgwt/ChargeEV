import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Alert,
} from "react-native";
import { Button, Text, Input } from "@rneui/themed";
import { authentication } from '../firebase/firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, sendPasswordResetEmail , getAuth } from "firebase/auth";


export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  //reset password code
  const auth = getAuth();

  const handleReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        console.log("Reset Email Sent")
        Alert.alert("Reset email sent. Check spam and junk for email")
        navigation.navigate("Login")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        switch (errorCode) {
          case "auth/missing-email":
            Alert.alert("Please fill in the field");
            break;
          case "auth/user-not-found":
            console.log("err type 2")
            Alert.alert("Email not registered");
            break;
        }
      });
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text h1>Reset</Text>
        <Text h2>Enter your email below</Text>
        <Text h4 style={{ color: "red", marginTop: 10, marginBottom: 10 }}>
        </Text>
      </View>
      <Input
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
        autoCapitalize='none'
        autoComplete={false}
      ></Input>
      <Button
        title="Reset"
        buttonStyle={{ width: 330, height: 50 }}
        containerStyle={{ marginTop: 10 }}
        onPress={() => handleReset()}
      ></Button>
      <Text h4 style={{ marginTop: 20 }}>
        <Text
          style={{ color: "#1BB530", textDecorationLine: "underline" }}
          onPress={() => navigation.navigate("Login")}
        >
          Return
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
  },
  titleContainer: {
    width: "95%",
  },
});
