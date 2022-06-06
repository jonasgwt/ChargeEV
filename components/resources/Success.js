import React from "react";
import { SafeAreaView } from "react-native";
import { Text } from "react-native-elements";
import { Button } from "@rneui/themed";

export default function Success({ navigation }) {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Text>Its done!</Text>
      <Button title="Home" onPress={() => navigation.navigate("Homepage")} />
    </SafeAreaView>
  );
}
