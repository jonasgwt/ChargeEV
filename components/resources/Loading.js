import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { Text } from "react-native-elements";
import Success from "./Success";

export default function Loading({ navigation }) {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Text>Chillex its loading</Text>
    </SafeAreaView>
  );
}
