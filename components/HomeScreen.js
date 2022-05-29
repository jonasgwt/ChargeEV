import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { authentication } from "../firebase/firebase-config";
import { Icon } from "@rneui/themed";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateUser,
  updateCurrentUser,
} from "firebase/auth";
import Welcome from "./Welcome";
import Host from "./Host/HostNavigator.js";
import { Button } from "react-native-elements";
import ChargeMap from "./ChargeMap/ChargeMap";

const Homepage = ({ navigation }) => {
  const SignOut = async () => {
    await AsyncStorage.clear();
    await signOut(authentication);
    navigation.navigate("Welcome");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>{authentication.currentUser.email}</Text>
      <Text>{authentication.currentUser.displayName}</Text>
      <Button title={"Sign Out"} onPress={SignOut}></Button>
    </SafeAreaView>
  );
};

const SettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>{authentication.currentUser.email}</Text>
    </SafeAreaView>
  );
};

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1BB530",
      }}
    >
      <Tab.Screen
        name="Homepage"
        component={Homepage}
        options={{
          tabBarLabel: (props) => (
            <Text style={{ color: props.color }}>Home</Text>
          ),
          tabBarIcon: (props) => <Icon color={props.color} name="home" />,
        }}
      />
      <Tab.Screen
        name="Host"
        component={Host}
        options={{
          tabBarLabel: (props) => (
            <Text style={{ color: props.color }}>Host</Text>
          ),
          tabBarIcon: (props) => <Icon color={props.color} name="group" />,
        }}
      />
      <Tab.Screen
        name="ChargeMap"
        component={ChargeMap}
        options={{
          tabBarLabel: (props) => (
            <Text style={{ color: props.color }}>Charge Map</Text>
          ),
          tabBarIcon: (props) => <Icon color={props.color} name="group" />,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
