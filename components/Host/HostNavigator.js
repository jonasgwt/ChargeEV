import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HostHomeScreen from "./HostHomeScreen";
import HostAddLocation from "./HostAddLocation";
import HostPaymentInformation from "./HostPaymentInformation";
import { doc, getDoc } from "firebase/firestore";
import { authentication, firestore } from "../../firebase/firebase-config";

const Host = createNativeStackNavigator();

export default function HostNavigator({ navigation }) {
  useEffect(() => {
    const getData = async () => {
      const userDoc = await getDoc(
        doc(firestore, "users", authentication.currentUser.uid)
      );
      if (userDoc.data().hostID == undefined)
        navigation.navigate("HostWelcome");
    };
    getData();
  }, []);

  return (
    <Host.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HostHomeScreen"
    >
      <Host.Screen name="HostHomeScreen" component={HostHomeScreen} />
      <Host.Screen
        name="HostPaymentInformation"
        component={HostPaymentInformation}
      />
    </Host.Navigator>
  );
}
