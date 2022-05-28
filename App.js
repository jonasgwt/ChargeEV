import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { fontsToBeLoaded } from "./fontsToBeLoaded.js";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, createTheme } from "@rneui/themed";
import Welcome from "./components/Welcome";
import Register from "./components/Register.js";
import EditProfile from "./components/EditProfile.js";
import Login from "./components/Login.js";
import Profile from "./components/Profile.js";
import { themeConfig } from "./themeConfig.js";
import AppLoading from "expo-app-loading";
import { authentication } from "./firebase/firebase-config";
import HomeScreen from "./components/HomeScreen.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const Stack = createNativeStackNavigator();
const theme = createTheme(themeConfig);

export default function App() {
  
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // Auto login if available
  useEffect(() => {
    const storeData = async () => {
      try {
        const email = await AsyncStorage.getItem("email");
        const password = await AsyncStorage.getItem("password");
        if (email != "" && password != "") {
          signInWithEmailAndPassword(authentication, email, password)
            .then((res) => {
              setIsSignedIn(true);
              setLoading(false);
            })
            .catch((err) => {
              console.log("Cannot auto-login");
              setLoading(false);
            });
        }
      } catch (err) {
        console.log(err);
      }
    };
    storeData();
  }, []);


  // Loads in fonts
  const [loaded] = useFonts(fontsToBeLoaded);

  // Show splash screen if loading
  if (!loaded || isLoading) return <AppLoading />;

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer style={styles.container}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          style={styles.container}
          initialRouteName={isSignedIn ? "Home" : "Welcome"}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name = "EditProfile" component={EditProfile}/>
          <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    background:
      "linear-gradient(225deg, #FFFFFF 0%, #EFF1F5 100%, #EFF1F5 100%)",
    alignItems: "center",
    justifyContent: "center",
  },
});
