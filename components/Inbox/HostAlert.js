import { Icon, Text } from "@rneui/themed";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { firestore } from "../../firebase/firebase-config";

export default function HostAlert({ data, onPress, refresh }) {
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const statusTotitle = {
    booked: "Location Booked",
    paid: "Verify Payment",
    arrived: "User has arrived",
    cancelled: "Booking cancelled",
  };
  const statusTosubtitle = {
    booked: "A user has booked your location at " + address + ".",
    paid: "User has made their payment. Verify now.",
    arrived: "User has arrived at " + address + ".",
    cancelled: "User has cancelled booking.",
  };

  useEffect(() => {
    const getAddress = async () => {
      const bookingDoc = await getDoc(doc(firestore, "Bookings", data.id));
      const locationDoc = await getDoc(
        doc(firestore, "HostedLocations", bookingDoc.data().location)
      );
      setAddress(locationDoc.data().address);
    };
    if (data.stage == "booked" || data.stage == "arrived") getAddress();
  }, []);

  const deleteNoti = async () => {
    const showUser = await getDoc(
      doc(firestore, "BookingAlerts", data.id)
    ).then((x) => x.data().showUser);
    if (!showUser) await deleteDoc(doc(firestore, "BookingAlerts", data.id));
    else
      await updateDoc(doc(firestore, "BookingAlerts", data.id), {
        showHost: false,
      });
    await refresh();
  };

  return data.actionRequired || data.action ? (
    <TouchableOpacity style={styles.container} onPress={onPress}>
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
      {data.stage == "arrived" ? (
        <Icon name="arrow-forward-ios" style={{ opacity: 0 }} />
      ) : (
        <TouchableOpacity onPress={deleteNoti}>
          <Icon name="delete" size={35} color="red" />
        </TouchableOpacity>
      )}
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
