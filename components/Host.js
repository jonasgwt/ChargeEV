import { async } from "@firebase/util";
import { collection } from "firebase/firestore";
import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { authentication, firestore } from "../firebase/firebase-config";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Button, Text, Input, Divider } from "@rneui/themed";
import Selection from "./resources/Selection";

export default function Host({ navigation }) {
  const test = async () => {
    const querySnapshot = await getDocs(collection(firestore, "users"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  };

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
      <Text h2 h2Style={{ fontFamily: "Inter-Bold", alignSelf: "flex-start", paddingLeft: "2%" }}>
        Manage
      </Text>
      <Selection
        title="Update Payment Information"
        logoName="wallet"
        logoType="entypo"
        onPress={log}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5%",
  },
});
