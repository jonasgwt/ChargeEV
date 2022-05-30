import { Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import Host from "./Host/HostNavigator.js";
import ChargeMap from "./ChargeMap/ChargeMap";
import Profile from "./Profile/ProfileNav";
import Inbox from "./Inbox/InboxNav";
import Homepage from "./HomePage/HomePage"


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
            <Text style={{ color: props.color }}>Map</Text>
          ),
          tabBarIcon: (props) => <Icon color={props.color} name="map" />,
          //tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen name="Inbox" component={Inbox} options={{
          tabBarLabel: (props) => (
            <Text style={{ color: props.color }}>Inbox</Text>
          ),
          tabBarIcon: (props) => (
            <Icon color={props.color} name="inbox"/>
          ),
        }}/>
      <Tab.Screen name="Profile" component={Profile} options={{
          tabBarLabel: (props) => (
            <Text style={{ color: props.color }}>Profile</Text>
          ),
          tabBarIcon: (props) => (
            <Icon color={props.color} name="account-circle"/>
          ),
        }}/>
    </Tab.Navigator>
  );
}
