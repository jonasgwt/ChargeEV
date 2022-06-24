import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Icon, Text } from "@rneui/themed";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { firestore, authentication } from "../../firebase/firebase-config";
import HostAlert from "./HostAlert";
import UserAlert from "./UserAlert";
import AnimatedLottieView from "lottie-react-native";

export default function InboxHomeScreen({ navigation }) {
  const [toggleUser, setToggleUser] = useState(true);
  const [toggleHost, setToggleHost] = useState(false);
  const [userAlerts, setUserAlerts] = useState([]);
  const [hostAlerts, setHostAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const NoAlerts = () => {
    return (
      <View
        style={{ paddingTop: "70%", display: "flex", justifyContent: "center" }}
      >
        <Text h4 h4Style={{ textAlign: "center" }}>
          There is nothing here yet.
        </Text>
      </View>
    );
  };

  const getNoti = async () => {
    setLoading(true);
    // get user's host ID
    const userDoc = await getDoc(
      doc(firestore, "users", authentication.currentUser.uid)
    );
    const hostID = userDoc.data().hostID;
    const bookingAlertsRef = collection(firestore, "BookingAlerts");
    // Find noti for user
    const userAlerts = await getDocs(
      query(
        bookingAlertsRef,
        where("user", "==", authentication.currentUser.uid),
        where("showUser", "==", true)
      )
    );
    const userAlertsTemp = [];
    userAlerts.forEach((doc) =>
      userAlertsTemp.push({ ...doc.data(), id: doc.id })
    );
    userAlertsTemp.sort((a, b) => a.priority < b.priority);
    setUserAlerts(userAlertsTemp);
    // Find noti for host
    const hostAlerts = await getDocs(
      query(
        bookingAlertsRef,
        where("host", "==", hostID),
        where("showHost", "==", true)
      )
    );
    const hostAlertsTemp = [];
    hostAlerts.forEach((doc) =>
      hostAlertsTemp.push({ ...doc.data(), id: doc.id })
    );
    hostAlertsTemp.sort((a, b) => a.priority < b.priority);
    setHostAlerts(hostAlertsTemp);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getNoti();
    });
    return unsubscribe;
  }, [navigation]);

  const userAlertPress = (stage) => {
    if (stage == "booked") navigation.navigate("ChargeMap");
  };

  const hostAlertPress = (stage, id, bgLocation) => {
    if (stage == "booked")
      navigation.navigate("TrackUserLocation", {
        bookingID: id,
        bgOn: bgLocation,
      });
    else if (stage == "paid")
      navigation.navigate("VerifyPayment", {
        bookingID: id,
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h1 h1Style={{ fontSize: 50 }}>
        Inbox
      </Text>
      {/* Toggle between host and user notifications */}
      <View style={styles.optionContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            title="User"
            containerStyle={{ marginRight: "5%" }}
            buttonStyle={
              toggleUser ? styles.buttonContainer : styles.disabledButton
            }
            titleStyle={
              toggleUser
                ? { color: "#1BB530", fontFamily: "Inter-SemiBold" }
                : { color: "gray", fontFamily: "Inter-Regular" }
            }
            onPress={() => {
              setToggleUser(true);
              setToggleHost(false);
            }}
          />
          <Button
            title="Host"
            buttonStyle={
              toggleHost ? styles.buttonContainer : styles.disabledButton
            }
            titleStyle={
              toggleHost
                ? { color: "#1BB530", fontFamily: "Inter-SemiBold" }
                : { color: "gray", fontFamily: "Inter-Regular" }
            }
            onPress={() => {
              setToggleUser(false);
              setToggleHost(true);
            }}
          />
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={getNoti}>
            <Icon name="refresh" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Content */}
      {!loading ? (
        <ScrollView style={styles.notiContainer}>
          {/* Alerts */}
          {toggleUser
            ? userAlerts.map((x, index) => (
                <UserAlert
                  key={index}
                  data={x}
                  onPress={() => userAlertPress(x.stage)}
                  refresh={getNoti}
                />
              ))
            : hostAlerts.map((x, index) => (
                <HostAlert
                  key={index}
                  data={x}
                  onPress={() => hostAlertPress(x.stage, x.id, x.bgLocation)}
                  refresh={getNoti}
                />
              ))}

          {/* screen when there are no alerts */}
          {toggleUser ? (
            userAlerts.length == 0 ? (
              <NoAlerts />
            ) : null
          ) : hostAlerts.length == 0 ? (
            <NoAlerts />
          ) : null}
        </ScrollView>
      ) : (
        <View
          style={{ height: "80%", display: "flex", justifyContent: "center" }}
        >
          <AnimatedLottieView
            autoPlay
            style={{
              width: 300,
              height: 300,
              marginTop: "-5%",
            }}
            source={require("../../assets/animations/findmessages.json")}
          />
          <Text
            h2
            h2Style={{ textAlign: "center" }}
            style={{ marginTop: "-10%" }}
          >
            Loading Messages...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: "5%",
    marginTop: "12%",
  },
  optionContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "2%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    borderRadius: 10,
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingLeft: "5%",
    paddingRight: "5%",
    backgroundColor: "#e8e8e8",
  },
  disabledButton: {
    borderWidth: 0,
    borderRadius: 10,
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingLeft: "5%",
    paddingRight: "5%",
    backgroundColor: "transparent",
  },
  notiContainer: {
    marginTop: "5%",
    height: "95%",
  },
  button: {
    backgroundColor: "#e8e8e8",
    padding: 7,
    borderRadius: 50,
  },
});
