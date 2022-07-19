import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Icon, Text } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { authentication, firestore } from "../../firebase/firebase-config";
import sendNotification from "../resources/sendNotifications";

export default function Payment({ navigation, route }) {
  const { hostNotiToken } = route.params;

  // User indicated that they have paid
  const paid = async (type) => {
    navigation.navigate("Loading");
    // update user active booking field
    const userRef = doc(firestore, "users", authentication.currentUser.uid);
    const userDoc = await getDoc(userRef);
    const bookingID = userDoc.data().activeBooking;
    await updateDoc(userRef, {
      activeBooking: "",
    });
    // update booking to reflect that user has paid
    const bookingRef = doc(firestore, "Bookings", bookingID);
    const bookingDoc = await getDoc(bookingRef);
    await updateDoc(bookingRef, {
      userPaid: true,
      paidVia: type
    });
    // update location to be available 
    const locationRef = doc(
      firestore,
      "HostedLocations",
      bookingDoc.data().location
    );
    await updateDoc(locationRef, {
      available: true,
    });
    // update booking alerts
    await updateDoc(doc(firestore, "BookingAlerts", bookingID), {
      stage: "paid",
      priority: 2,
      actionRequired: true,
      timestamp: serverTimestamp()
    });
    // send notification
    await sendNotification(
      hostNotiToken,
      authentication.currentUser.displayName + " has paid for their booking",
      "Verify their payment now"
    );
    navigation.navigate("PaymentDone", { type: type, booking: bookingID });
  };

  return (
    <View style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <LinearGradient style={styles.semiCircle} colors={["#23E83D", "#1BB530"]}>
        <Image
          source={require("../../assets/logo_white_black_shadow.png")}
          style={styles.image}
        />
        <Text h1 h1Style={{ color: "white" }} style={{ marginBottom: "10%" }}>
          Payment
        </Text>
      </LinearGradient>
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option} onPress={async () => await paid("Cash")}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="money" />
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 17,
                marginLeft: "5%",
              }}
            >
              Paid by Cash
            </Text>
          </View>
          <Icon name="arrow-forward-ios" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => paid("QR")}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="qr-code" />
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 17,
                marginLeft: "5%",
              }}
            >
              Paid by QR Code
            </Text>
          </View>
          <Icon name="arrow-forward-ios" />
        </TouchableOpacity>
      </View>
      <View style={styles.warningContainer}>
        <Icon name="warning" size={35} />
        <Text style={{ maxWidth: "60%", fontSize: 15 }}>
          Do take a screenshot of payment confirmation where applicable
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  semiCircle: {
    width: "200%",
    height: "150%",
    position: "absolute",
    borderRadius: 375,
    top: "-90%",
    left: "-50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    width: "15%",
    height: "15%",
    marginBottom: "5%",
  },
  optionContainer: {
    position: "absolute",
    top: "65%",
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  option: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "75%",
    borderWidth: 1,
    borderRadius: 5,
    padding: "5%",
    backgroundColor: "white",
    marginBottom: "5%",
  },
  warningContainer: {
    position: "absolute",
    bottom: "5%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
  },
});
