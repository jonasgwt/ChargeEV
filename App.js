import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { fontsToBeLoaded } from "./fontsToBeLoaded.js";
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, createTheme } from '@rneui/themed';
import Welcome from "./components/Welcome";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import { themeConfig } from "./themeConfig.js"
import AppLoading from "expo-app-loading";
import LoginScreen from "./components/LoginScreen.js";
import HomeScreen from "./components/HomeScreen.js";


const Stack = createNativeStackNavigator();
const theme = createTheme(themeConfig);

export default function App() {

  const [loaded] = useFonts(fontsToBeLoaded);
  if (!loaded) return <AppLoading />

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer style={styles.container}>
        <Stack.Navigator screenOptions={{headerShown: false}} style={styles.container} initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    background: "linear-gradient(225deg, #FFFFFF 0%, #EFF1F5 100%, #EFF1F5 100%)",
    alignItems: 'center',
    justifyContent: 'center',
  },
});
