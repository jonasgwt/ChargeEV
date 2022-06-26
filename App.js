import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { fontsToBeLoaded } from "./fontsToBeLoaded.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, createTheme } from "@rneui/themed";
import Welcome from "./components/Welcome";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import { themeConfig } from "./themeConfig.js";
import { authentication, firestore } from "./firebase/firebase-config";
import HomeScreen from "./components/HomeScreen.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { signInWithEmailAndPassword } from "firebase/auth";
import HostAddLocation from "./components/Host/HostAddLocation.js";
import Loading from "./components/resources/Loading.js";
import Success from "./components/resources/Success.js";
import ForgotPassword from "./components/ForgotPassword.js";
import Payment from "./components/ChargeMap/Payment.js";
import PaymentDone from "./components/ChargeMap/PaymentDone.js";
import Ratings from "./components/ChargeMap/Ratings.js";
import { doc, updateDoc } from "firebase/firestore";
import ProfileHomeScreen from "./components/Profile/Profile";
import { LogBox } from "react-native";
import HostAddPayment from "./components/Host/HostAddPayment";
import HostWelcome from "./components/Host/HostWelcome";
import { StatusBar } from 'expo-status-bar';

LogBox.ignoreLogs([
  "ViewPropTypes will be removed",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);

const Stack = createNativeStackNavigator();
const theme = createTheme(themeConfig);

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Loads in Fonts and AsyncStorage data
  useEffect(() => {
    const storeData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const email = await AsyncStorage.getItem("email");
        const password = await AsyncStorage.getItem("password");
        await Font.loadAsync(fontsToBeLoaded);
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

  // Checks if data is loaded in and hide splash screen
  useEffect(() => {
    const check = async () => {
      if (!isLoading) await SplashScreen.hideAsync();
    };
    check();
  }, [isLoading]);

  // Notification handlers
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (isLoading) {
    return null;
  }

  // Gets and sets token for notifications
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      const userRef = doc(firestore, "users", authentication.currentUser.uid);
      await updateDoc(userRef, {
        notificationToken: token,
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer style={styles.container}>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          style={styles.container}
          initialRouteName={isSignedIn ? "Home" : "Welcome"}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Reset" component={ForgotPassword} />

          {/*Hosts*/}
          <Stack.Screen name="HostAddLocation" component={HostAddLocation} />
          <Stack.Screen name="HostAddPayment" component={HostAddPayment} />
          <Stack.Screen
            name="HostWelcome"
            component={HostWelcome}
            options={{ gestureEnabled: false }}
          />

          {/*Loading & Success*/}
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="Success"
            component={Success}
            options={{ gestureEnabled: false }}
          />

          {/* Charge Map */}
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen
            name="PaymentDone"
            component={PaymentDone}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Ratings" component={Ratings} />
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
