import React from "react";
import { SafeAreaView } from "react-native";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  GeoPoint,
  query,
  where,
} from "firebase/firestore";
import { authentication, firestore } from "../../firebase/firebase-config";
import { Button } from "react-native-elements";

export default function HostAddLocation({ navigation }) {
  const post = async () => {
    const docRef = await addDoc(collection(firestore, "HostedLocations"), {
      address: "1 Trash Lane",
      chargerType: "human powered",
      city: "Singapore",
      coordinates: new GeoPoint(1, 1),
      costPerCharge: 1,
      country: "Singapore",
      hostedBy: "userID",
      housingType: "rubbish dump",
      locationImage: "poop",
      paymentMethod: "blood",
      postalCode: 2245,
      unitNumber: "1",
    });
    console.log("Location added with ID: ", docRef.id);
  };

  const get = async () => {
    const q = query(
      collection(firestore, "HostedLocations"),
      where("hostedBy", "==", "userID")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  return (
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button title="POST" style={{ marginBottom: 10 }} onPress={post}></Button>
      <Button title="GET" onPress={get}></Button>
    </SafeAreaView>
  );
}
