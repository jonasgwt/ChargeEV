import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { authentication } from "../firebase/firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const NextScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"center"}}>
      <Text>{authentication.currentUser.email}</Text>
    </SafeAreaView>
  )
}

const SettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"center"}}>
      <Text>{authentication.currentUser.email}</Text>
    </SafeAreaView>
  )
}



const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="NextScreen" component={NextScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
  );
}
    

