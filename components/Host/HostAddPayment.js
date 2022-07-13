import { Text, Icon, Button } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore, authentication } from "../../firebase/firebase-config";

export default function HostAddPayment({ navigation, route }) {
  const { type } = route.params;
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const QRCode = [
    { key: "I will display the QR Code on location" },
    { key: "I have verified that the QR Code is valid" },
  ];
  const Cash = [
    { key: "I will be at location to receieve the payment" },
    {
      key: "It is my responsibility to ensure that users have made their payment",
    },
  ];

  const addPaymentMethod = async () => {
    setLoading(true);
    const userDoc = await getDoc(
      doc(firestore, "users", authentication.currentUser.uid)
    );
    const hostDoc = doc(firestore, "Host", userDoc.data().hostID);
    await updateDoc(hostDoc, {
      paymentMethods: arrayUnion(type),
    });
    setLoading(false);
    navigation.navigate("Payment Information");
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
            name={type == "Cash" ? "money" : "qr-code"}
            size={150}
            color="white"
            style={{ marginBottom: "2%" }}
          />
          <Text h1 h1Style={{ fontSize: 30, color: "white" }}>
            {type} Payment
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.content}>
        <FlatList
          data={type == "Cash" ? Cash : QRCode}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {"⊛" + " "}
              {item.key}
            </Text>
          )}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10%",
            width: "60%",
            justifyContent: "space-around",
          }}
        >
          <Checkbox
            value={verified}
            onValueChange={setVerified}
            disabled={false}
            color={verified ? "#1BB530" : undefined}
          />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 17 }}>
            I have done the above
          </Text>
        </View>
      </View>
      <Button
        title="Done"
        containerStyle={{ position: "absolute", bottom: "5%", width: "50%" }}
        disabled={!verified}
        disabledStyle={{ backgroundColor: "gray" }}
        loading={loading}
        onPress={addPaymentMethod}
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
  item: {
    fontFamily: "Inter-Regular",
    fontSize: 17,
    marginBottom: "2%",
  },
});
