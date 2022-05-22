import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, Input } from "@rneui/themed";
import { authentication } from '../firebase/firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut} from "firebase/auth";


export default function Login({ navigation }) {
  const [error, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidAccount, setInvalidAccount] = useState(false);
  
  // Login user
  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then((re) => {
        setInvalidAccount(false);
        AsyncStorage.setItem('email', email);
        AsyncStorage.setItem('password', password);
        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
        setInvalidAccount(true);
      })
  };

  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text h1>Login</Text>
        <Text h2>Lorem ipsum dolor sit amet</Text>
        <Text h4 style={{ color: "red", marginTop: 10, marginBottom: 10 }}>
        {invalidAccount? "Invalid Password Or Email" : ""}
        </Text>
      </View>
      <Input
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
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
