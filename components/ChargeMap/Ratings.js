import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { AirbnbRating } from "@rneui/themed";
import { getDoc, increment, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase-config";

export default function Ratings({ navigation, route }) {
  const { booking } = route.params;
  const [rating, setRating] = useState(-1);

  // Add rating to host data
  const rate = async () => {
    navigation.navigate("Loading");
    const bookingRef = doc(firestore, "Bookings", booking);
    const bookingDoc = await getDoc(bookingRef);
    const hostRef = doc(firestore, "Host", bookingDoc.data().host);
    await updateDoc(hostRef, {
      totalRatings: increment(rating),
      reviewCount: increment(1),
    });
    const hostDoc = await getDoc(hostRef);
    await updateDoc(hostRef, {
      rating: hostDoc.data().totalRatings / hostDoc.data().reviewCount,
    });
    navigation.navigate("Home");
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <LinearGradient
        colors={["#23E83D", "#1BB530"]}
        style={{ height: "100%", width: "100%", position: "absolute" }}
      />
      <SafeAreaView
        style={{ height: "100%", alignItems: "center", marginTop: "50%" }}
      >
        <Text h1 h1Style={{ fontSize: 25, color: "white" }}>
          Rate your host
        </Text>
        <AirbnbRating
          count={5}
          reviewColor="white"
          selectedColor="white"
          defaultRating={0}
          size={30}
          onFinishRating={setRating}
        />
      </SafeAreaView>
      <TouchableOpacity style={styles.nextButton} onPress={rate}>
        <Text style={{ color: "white", fontSize: 17 }}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
