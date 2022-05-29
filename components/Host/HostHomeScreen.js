import { async } from "@firebase/util";
import React from "react";
import { View, SafeAreaView, StyleSheet, Touchable } from "react-native";
import { authentication, firestore } from "../../firebase/firebase-config";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Button, Text, Input, Divider } from "@rneui/themed";
import Selection from "../resources/Selection";

export default function HostHomeScreen({ navigation }) {

  const log = () => {
    console.log("clicked");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 h1Style={{ fontSize: 30 }}>
        Hello,{" "}
        <Text h1 h1Style={{ fontSize: 30, color: "#1BB530" }}>
          {authentication.currentUser.displayName}
        </Text>
      </Text>
      <Divider style={{ width: "100%", margin: 20 }} color="black" />
      <Text
        h2
        h2Style={{
          fontFamily: "Inter-Bold",
          alignSelf: "flex-start",
          paddingLeft: "2%",
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
        onPress={() => navigation.navigate('Host', {screen: "HostAddLocation"})}
      />
      <Text
        h2
        h2Style={{
          fontFamily: "Inter-Bold",
          alignSelf: "flex-start",
          paddingLeft: "2%",
          marginTop: 30,
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "20%",
    alignItems: "center",
    margin: "5%",
  },
});
