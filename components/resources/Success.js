import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
import { Text } from "react-native-elements";
import { Button } from "@rneui/themed";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Success({ navigation }) {
  const animation = useRef(null)
  useEffect(() => {
    animation.current.play()
  }, [])
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
        loop={false}
        ref={animation}
        style={{
          width: 300,
          height: 300,
          marginTop: "-10%",
        }}
        source={require("../../assets/animations/done.json")}
      />
      <Text h2 h2Style={{color: "white", marginTop: "-20%"}}>You are all set!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Homepage")}>
        <Text h4 h4Style={{color: "white"}}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  button: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: "2%",
    paddingLeft: "20%",
    paddingRight: "20%",
    position: "absolute",
    bottom: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
})
