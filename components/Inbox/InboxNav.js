import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InboxHomeScreen from "./InboxHomeScreen";
import TrackUserLocation from "./TrackUserLocation";
import VerifyPayment from "./VerifyPayment";


const Inbox = createNativeStackNavigator()

export default function InboxNav() {
    return (
        <Inbox.Navigator screenOptions={{ headerShown: false }} initialRouteName="InboxHomeScreen">
            <Inbox.Screen name="InboxHomeScreen" component={InboxHomeScreen} />
            <Inbox.Screen name="TrackUserLocation" component={TrackUserLocation} />
            <Inbox.Screen name="VerifyPayment" component={VerifyPayment} />
        </Inbox.Navigator>
    );
}