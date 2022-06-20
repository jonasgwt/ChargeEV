import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Image, View, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Icon, Text } from "@rneui/themed";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase-config";
import sendNotification from "../resources/sendNotifications";

export default function VerifyPayment({ navigation, route }) {
  const { bookingID } = route.params;
  const [cost, setCost] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [userDP, setUserDP] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      const bookingDoc = await getDoc(doc(firestore, "Bookings", bookingID));
      setPaymentMode(bookingDoc.data().paidVia);
      const locationDoc = await getDoc(
        doc(firestore, "HostedLocations", bookingDoc.data().location)
      );
      setCost(locationDoc.data().costPerCharge);
      const userDoc = await getDoc(
        doc(firestore, "users", bookingDoc.data().user)
      );
      setUserDP(
        userDoc.data().userImg == undefined
          ? "https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/photos%2F149071.png?alt=media&token=509b42b3-27ab-452f-a3e8-8c0e93fcb229"
          : userDoc.data().userImg
      );
      setUserDisplayName(userDoc.data().fname + " " + userDoc.data().lname);
    };
    getUserInfo();
  }, []);

  const verifyPayment = async () => {
    Alert.alert(
      "Confirm Verification",
      "Check if you have received payment. This action is irreversible",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            navigation.navigate("Loading");
            const bookingRef = doc(firestore, "Bookings", bookingID);
            await updateDoc(bookingRef, {
              hostVerified: true,
            });
            const userNotiToken = await getDoc(bookingRef)
              .then(
                async (x) =>
                  await getDoc(doc(firestore, "users", x.data().user))
              )
              .then((x) => x.data().notificationToken);
            const alertRef = doc(firestore, "BookingAlerts", bookingID);
            await deleteDoc(alertRef);
            await sendNotification(
              userNotiToken,
              "Host has verified your payment",
              "Booking has been closed"
            );
            navigation.navigate("InboxHomeScreen");
          },
        },
      ]
    );
  };

  return (
    <View style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <LinearGradient style={styles.semiCircle} colors={["#23E83D", "#1BB530"]}>
        <Image
          source={require("../../assets/logo_white_black_shadow.png")}
          style={styles.image}
        />
        <Text h1 h1Style={{ color: "white" }} style={{ marginBottom: "10%" }}>
          Verify Payment
        </Text>
      </LinearGradient>
      <View style={styles.optionContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "65%",
          }}
        >
          <Image source={{ url: userDP }} style={{ width: 75, height: 75 }} />
          <Text h2 h2Style={{ fontSize: 25 }}>
            {userDisplayName}
          </Text>
        </View>
        <View style={{ marginTop: "7%" }}>
          <Text h2>Amount Payable: ${cost}</Text>
          <Text h2>Payment Method: {paymentMode}</Text>
        </View>
        <View style={{ marginTop: "7%" }}>
          <Button
            buttonStyle={{
              paddingLeft: "7%",
              paddingRight: "7%",
              justifyContent: "space-around",
            }}
            onPress={verifyPayment}
          >
            <Icon name="done" color="white" />
            <Text h3 h3Style={{ color: "white" }}>
              Verify Payment
            </Text>
          </Button>
          <Button
            buttonStyle={{
              paddingLeft: "7%",
              paddingRight: "7%",
              justifyContent: "space-around",
              backgroundColor: "#f24660",
            }}
            containerStyle={{ marginTop: "2%" }}
          >
            <Icon name="error" color="white" />
            <Text h3 h3Style={{ color: "white" }}>
              Not Received
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  semiCircle: {
    width: "200%",
    height: "130%",
    position: "absolute",
    borderRadius: 375,
    top: "-80%",
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
    top: "55%",
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
