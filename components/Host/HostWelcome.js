import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, Text, Button } from "@rneui/themed";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { authentication, firestore } from "../../firebase/firebase-config";

export default function HostWelcome({ navigation }) {
  const [loading, setLoading] = useState(false);

  const goNext = async () => {
    setLoading(true);
    const hostRef = await addDoc(collection(firestore, "Host"), {
      userID: authentication.currentUser.uid,
      rating: 0,
      totalRatings: 0,
      reviewCount: 0,
      bookings: [],
      locations: [],
      paymentMethods: [],
    });
    await updateDoc(doc(firestore, "users", authentication.currentUser.uid), {
      hostID: hostRef.id,
    });
    setLoading(false);
    navigation.navigate("HostPaymentInformation");
  };

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <LinearGradient style={styles.semiCircle} colors={["#23E83D", "#1BB530"]}>
        <View style={styles.iconContainer}>
          <Icon
            name="domain"
            size={150}
            color="white"
            style={{ marginBottom: "2%" }}
          />
          <Text h1 h1Style={{ fontSize: 30, color: "white" }}>
            ChargeEV Hosting
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.content}>
        <Text
          h3
          h3Style={{
            fontFamily: "Inter-Bold",
            fontSize: 22,
            textAlign: "center",
            marginBottom: "2%",
          }}
        >
          Hosting with ChargeEV
        </Text>
        <Text
          h3
          h3Style={{
            fontFamily: "Inter-Regular",
            fontSize: 17,
            textAlign: "center",
          }}
          style={{ maxWidth: "80%" }}
        >
          Welcome to ChargeEV Hosting. Be part of our extensive EV charger
          network today!
        </Text>
      </View>
      <Button
        title="Let's Begin"
        containerStyle={{ position: "absolute", bottom: "5%", width: "50%" }}
        disabledStyle={{ backgroundColor: "gray" }}
        loading={loading}
        onPress={goNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  semiCircle: {
    width: "200%",
    height: "150%",
    position: "absolute",
    borderRadius: 375,
    top: "-95%",
    left: "-50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconContainer: {
    shadowColor: "gray",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 1,
    marginBottom: "15%",
  },
  content: {
    position: "absolute",
    top: "60%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    maxHeight: 150,
  },
});
