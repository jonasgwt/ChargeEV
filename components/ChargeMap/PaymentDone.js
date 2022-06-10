import React from "react";
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, Text } from "@rneui/themed";

export default function PaymentDone({ navigation, route }) {
  const { type, booking } = route.params;
  return (
    <View style={{ height: "100%", width: "100%" }}>
      <LinearGradient
        colors={["#23E83D", "#1BB530"]}
        style={{ height: "100%", width: "100%", position: "absolute" }}
      />
      <SafeAreaView style={styles.container}>
        {type == "QR" ? (
          <View style={styles.warningContainer}>
            <Icon name="warning" size={35} />
            <Text style={{ maxWidth: "60%", fontSize: 15 }}>
              Remember to take a screenshot of the payment confirmation
            </Text>
          </View>
        ) : null}
        <Icon
          name="verified"
          size={100}
          color="white"
          iconStyle={styles.iconStyle}
        />
        <Text
          h2
          h2Style={{
            color: "white",
            fontFamily: "Inter-Bold",
            marginBottom: "5%",
            fontSize: 30,
          }}
        >
          You are all set!
        </Text>
        <Text
          h4
          h4Style={{
            color: "white",
            textAlign: "center",
            maxWidth: "80%",
            marginBottom: "5%",
          }}
        >
          {type == "QR"
            ? "Transaction will be closed when the host has received the payment"
            : "Please ensure that the hosts has verified that they have received payment before leaving"}
        </Text>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate("Ratings", {booking: booking})}>
          <Text style={{ color: "white", fontSize: 17 }}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    marginBottom: "5%",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  warningContainer: {
    position: "absolute",
    top: "10%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#ffcc00",
    paddingTop: "3%",
    paddingBottom: "3%",
  },
  nextButton: {
    borderWidth: 1,
    borderColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    padding: "5%",
    position: "absolute",
    bottom: "10%",
  },
});
