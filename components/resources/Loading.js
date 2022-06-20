import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Loading({ navigation }) {

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <LinearGradient style={styles.bg} colors={["#23E83D", "#1BB530"]} />
      <LottieView
        autoPlay
        style={{
          width: 300,
          height: 300,
          marginTop: "-5%"
        }}
        source={require("../../assets/animations/loading.json")}
      />
      <Text h4 h4Style={{color: "white"}}>Loading...</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
})
