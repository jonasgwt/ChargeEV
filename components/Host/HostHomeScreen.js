import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Touchable,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { authentication, firestore } from "../../firebase/firebase-config";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Button, Text, Input, Divider } from "@rneui/themed";
import Selection from "../resources/Selection";

export default function HostHomeScreen({ navigation }) {
  const [name, setName] = useState("");

  const userEditLocation = () => {
    navigation.navigate("ViewLocations")
  };

  // Get first name of the host
  const getFirstName = async () => {
    const docRef = doc(firestore, "users", authentication.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setName(docSnap.data().fname);
    else console.error("User not Found");
  };

  // Checks if user can add a location
  const userAddLocation = async () => {
    const userDoc = await getDoc(
      doc(firestore, "users", authentication.currentUser.uid)
    );
      const hostDoc = await getDoc(doc(firestore, "Host", userDoc.data().hostID));
    if (hostDoc.data().paymentMethods == undefined || hostDoc.data().paymentMethods.length == 0 ) {
      Alert.alert("No Payment Method", "Please add a payment method before adding a hosting location");
      return;
    }
    navigation.navigate("HostAddLocation")
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await getFirstName();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text h1 h1Style={{ fontSize: 35, color: "#1BB530" }}>
          Hello,{" "}
          <Text h1 h1Style={{ fontSize: 35, color: "black" }}>
            {name}
          </Text>
        </Text>
        <Divider style={{ width: "100%", margin: 20 }} color="black" />
        <Text
          h2
          h2Style={{
            fontFamily: "Inter-Bold",
            alignSelf: "flex-start",
            paddingLeft: "2%",
            marginBottom: 5,
          }}
        >
          Manage
        </Text>
        <Selection
          title="Manage Payment Information"
          logoName="wallet"
          logoType="entypo"
          onPress={() => navigation.navigate("HostPaymentInformation")}
        />
        <Text
          h2
          h2Style={{
            fontFamily: "Inter-Bold",
            alignSelf: "flex-start",
            paddingLeft: "2%",
            marginTop: 30,
            marginBottom: 5,
          }}
        >
          Hosting
        </Text>
        <Selection
          title="View and Edit Hosted Locations"
          logoName="location-pin"
          onPress={userEditLocation}
        />
        <Selection
          title="Add New Location"
          logoName="add-location"
          onPress={userAddLocation}
        />
        <Text
          h2
          h2Style={{
            fontFamily: "Inter-Bold",
            alignSelf: "flex-start",
            paddingLeft: "2%",
            marginTop: 30,
            marginBottom: 5,
          }}
        >
          Support
        </Text>
        <Selection
          title="Get Support"
          logoName="contact-support"
          onPress={() => Linking.openURL("https://t.me/ChargeEVHelpBot")}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "15%",
    alignItems: "center",
    margin: "5%",
  },
});
