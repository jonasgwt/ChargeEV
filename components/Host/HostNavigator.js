import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HostHomeScreen from "./HostHomeScreen";
import HostAddLocation from "./HostAddLocation";
import HostPaymentInformation from "./HostPaymentInformation";
import { doc, getDoc } from "firebase/firestore";
import { authentication, firestore } from "../../firebase/firebase-config";
import ViewLocations from "./ViewLocations";

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
    const unsubscribe = navigation.addListener("focus", async () => {
      await getData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Host.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HostHomeScreen"
    >
      <Host.Screen name="HostHomeScreen" component={HostHomeScreen} />
      <Host.Screen
        name="Payment Information"
        component={HostPaymentInformation}
        options={{
            headerShown: true,
          }}
      />
      <Host.Screen name="View Locations" component={ViewLocations} options={{
            headerShown: true,
          }}/>
    </Host.Navigator>
  );
}
