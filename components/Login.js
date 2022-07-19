import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, View, Alert, SafeAreaView } from "react-native";
import { Button, Text, Input } from "@rneui/themed";
import { authentication } from "../firebase/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
} from "firebase/auth";
import { DismissKeyboardView } from "./resources/DismissKeyboardView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidAccount, setInvalidAccount] = useState(false);

  // Login user
  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then((re) => {
        setInvalidAccount(false);
        AsyncStorage.setItem("email", email);
        AsyncStorage.setItem("password", password);
        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
        setInvalidAccount(true);
        Alert.alert("Invalid Password Or Email");
      });
  };

  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: "50%" }}
    >
      <DismissKeyboardView>
        <SafeAreaView
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "125%"
          }}
        >
          <View style={styles.titleContainer}>
            <Text h1>Login</Text>
            <Text h2>Login to your ChargeEV account</Text>
            <Text h4 style={{ color: "red", marginTop: 10, marginBottom: 10 }}>
              {invalidAccount ? "Invalid Password Or Email" : ""}
            </Text>
          </View>
          <Input
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete={false}
          ></Input>
          <Input
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          ></Input>
          <Button
            title="Login"
            buttonStyle={{ width: 330, height: 50 }}
            containerStyle={{ marginTop: 10 }}
            onPress={handleLogin}
          ></Button>
          <Text h4 style={{ marginTop: 20 }}>
            Don't have an account?{" "}
            <Text
              style={{ color: "#1BB530", textDecorationLine: "underline" }}
              onPress={() => navigation.navigate("Register")}
            >
              Register
            </Text>
          </Text>
          <Text h4 style={{ marginTop: 30 }}>
            Forgot password?{" "}
            <Text
              style={{ color: "red", textDecorationLine: "underline" }}
              onPress={() => navigation.navigate("Reset")}
            >
              Reset
            </Text>
          </Text>
        </SafeAreaView>
      </DismissKeyboardView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    background:
      "linear-gradient(225deg, #FFFFFF 0%, #EFF1F5 100%, #EFF1F5 100%)",
    padding: "5%",
  },
  titleContainer: {
    width: "95%",
  },
});
