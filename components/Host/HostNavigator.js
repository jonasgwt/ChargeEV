import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HostHomeScreen from "./HostHomeScreen";
import HostAddLocation from "./HostAddLocation";

const Host = createNativeStackNavigator();

export default function HostNavigator() {
  return (
    <Host.Navigator screenOptions={{ headerShown: false }} initialRouteName="HostHomeScreen">
          <Host.Screen name="HostHomeScreen" component={HostHomeScreen} />
    </Host.Navigator>
  );
}
