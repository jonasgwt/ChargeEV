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

export default function Login({ navigation }) {
  const [error, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("clicked");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text h1>Login</Text>
        <Text h2>Lorem ipsum dolor sit amet</Text>
        <Text h4 style={{ color: "red", marginTop: 10 }}>
          {error}
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
