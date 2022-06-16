import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Touchable, ScrollView } from "react-native";
import { authentication, firestore } from "../../firebase/firebase-config";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Button, Text, Input, Divider } from "@rneui/themed";
import Selection from "../resources/Selection";

export default function HostHomeScreen({ navigation }) {
  const [name, setName] = useState("");

  const log = () => {
    console.log("clicked");
  };

  // Get first name of the host
  useEffect(() => {
    const getFirstName = async () => {
      const docRef = doc(firestore, "users", authentication.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setName(docSnap.data().fname);
      else console.error("User not Found");
    };
    getFirstName();
  }, []);

  return (
    <ScrollView>
    <SafeAreaView style={styles.container}>
      <Text h1 h1Style={{ fontSize: 35, color: "#1BB530"}}>
        Hello,{" "}
        <Text h1 h1Style={{ fontSize: 35, color: "black" }}>
          {name}
        </Text>
      </Text>
      <Divider style={{ width: "100%", margin: 20, }} color="black" />
      <Text
        h2
        h2Style={{
          fontFamily: "Inter-Bold",
          alignSelf: "flex-start",
          paddingLeft: "2%",
          marginBottom: 5
        }}
      >
        Manage
      </Text>
      <Selection
        title="Update Payment Information"
        logoName="wallet"
        logoType="entypo"
        onPress={log}
      />
      <Selection
        title="Update Contact Information"
        logoName="phone"
        onPress={log}
      />
      <Text
        h2
        h2Style={{
          fontFamily: "Inter-Bold",
          alignSelf: "flex-start",
          paddingLeft: "2%",
          marginTop: 30,
          marginBottom: 5
        }}
      >
        Hosting
      </Text>
      <Selection
        title="View and Edit Hosted Locations"
        logoName="location-pin"
        onPress={log}
      />
      <Selection
        title="Add New Location"
        logoName="add-location"
        onPress={() =>
          navigation.navigate("HostAddLocation")
        }
      />
      <Text
        h2
        h2Style={{
          fontFamily: "Inter-Bold",
          alignSelf: "flex-start",
          paddingLeft: "2%",
          marginTop: 30,
          marginBottom: 5
        }}
      >
        Report
      </Text>
      <Selection title="Report Errant Usage" logoName="report" onPress={log} />
      <Text
        h2
        h2Style={{
          fontFamily: "Inter-Bold",
          alignSelf: "flex-start",
          paddingLeft: "2%",
          marginTop: 30,
          marginBottom: 5
        }}
      >
        Support
      </Text>
      <Selection
        title="How Does It Work?"
        logoName="contact-support"
        onPress={log}
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
