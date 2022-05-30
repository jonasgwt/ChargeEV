import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InboxHomeScreen from "./InboxHomeScreen";


const Inbox = createNativeStackNavigator()

export default function InboxNav() {
    return (
        <Inbox.Navigator screenOptions={{ headerShown: false }} initialRouteName="InboxHomeScreen">
            <Inbox.Screen name="InboxHomeScreen" component={InboxHomeScreen} />
        </Inbox.Navigator>
    );
}