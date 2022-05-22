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
  updateProfile
} from "firebase/auth";
import Welcome from './Welcome';
import { Button } from 'react-native-elements';



const NextScreen = ({ navigation }) => {


  const SignOut = () => {
    AsyncStorage.clear();
    signOut(authentication)
    navigation.navigate("Welcome");
  }

  return (
    <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"center"}}>
      <Text>{authentication.currentUser.displayName}</Text>
      <Button title={"Sign Out"} onPress={SignOut}></Button>
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
  //updateProfile(authentication.currentUser, {displayName: "Jonas"})
  console.log(authentication.currentUser.displayName)
  return (
      <Tab.Navigator>
        <Tab.Screen name="Next Screen" component={NextScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
  );
}
    

