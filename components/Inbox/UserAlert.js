import { Icon, Text } from "@rneui/themed";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { firestore } from "../../firebase/firebase-config";

export default function UserAlert({ data, onPress }) {
  const [address, setAddress] = useState("");
  const statusTotitle = {
    booked: "Location Booked",
    paid: "Awaiting Confirmation",
    arrived: "Arrived",
    cancelled: "Booking cancelled",
  };
  const statusTosubtitle = {
    booked: "You have booked a location at " + address + ".",
    paid: "We are waiting for the host to verify your payment.",
    arrived: "You have arrived at " + address + ".",
    cancelled: "Your booking at " + address + " has been cancelled.",
  };

  useEffect(() => {
    const getAddress = async () => {
      const bookingDoc = await getDoc(doc(firestore, "Bookings", data.id));
      const locationDoc = await getDoc(
        doc(firestore, "HostedLocations", bookingDoc.data().location)
      );
      setAddress(locationDoc.data().address);
    };
    getAddress();
  }, []);

  return data.actionRequired || data.action ? (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      {data.stage == "booked" ? (
        <Icon name="book" size={50} />
      ) : (
        <Icon name="warning" size={50} />
      )}
      <View style={{ maxWidth: "70%" }}>
        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: 20,
            marginBottom: "2%",
          }}
        >
          {data.stage == "booked" ? statusTotitle.booked : statusTotitle.paid}
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 17 }}>
          {data.stage == "booked"
            ? statusTosubtitle.booked
            : statusTosubtitle.paid}
        </Text>
      </View>
      <Icon name="arrow-forward-ios" />
    </TouchableOpacity>
  ) : (
    <View style={styles.container}>
      {data.stage == "arrived" ? (
        <Icon name="drive-eta" size={50} />
      ) : (
        <Icon name="cancel" size={50} />
      )}
      <View style={{ maxWidth: "70%" }}>
        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: 20,
            marginBottom: "2%",
          }}
        >
          {data.stage == "arrived"
            ? statusTotitle.arrived
            : statusTotitle.cancelled}
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 17 }}>
          {data.stage == "arrived"
            ? statusTosubtitle.arrived
            : statusTosubtitle.cancelled}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10%",
  },
});
