import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileHomeScreen from "./Profile";
import EditProfile from "./EditProfile";
import Support from "./Support";

const Profile = createNativeStackNavigator()

export default function ProfileNav() {
    return (
        <Profile.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfileHomeScreen">
            <Profile.Screen name="ProfileHomeScreen" component={ProfileHomeScreen} />
            <Profile.Screen name="EditProfile" component={EditProfile} />
            <Profile.Screen name="Support" component={Support} />
        </Profile.Navigator>
    );
}