import React from "react";
import { SafeAreaView } from "react-native";
import { Text, Button } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { authentication } from "../../firebase/firebase-config";


export default function Homepage ({ navigation }) {
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
          <Text style={{color:"gray", fontSize:15, marginTop:50, width:"80%", textAlign:"center"}}>Note that features here are still a work in progress</Text>
    </SafeAreaView>
  );
};