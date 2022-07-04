import { React, useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ImageBackground } from "react-native";
import { Text, Button, Divider, Image } from "@rneui/themed";
import { authentication, firestore } from "../../firebase/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import AnimatedLottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Homepage({ navigation }) {
  const [userData, setUserData] = useState(null);

  const getUser = async () => {
    const docRef = doc(firestore, "users", authentication.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await getUser();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          marginTop: "2%",
          marginBottom: 0,
          justifyContent: "center",
        }}
      >
        <Avatar.Image
          source={{
            uri:
              userData != null && userData.get("userImg") != null
                ? userData.get("userImg")
                : "https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/photos%2F1B2C5C85-6253-4C85-9355-BE0AEC1B9A921654325573980.png?alt=media&token=3a176203-5203-403f-b63e-d0aa37912875",
          }}
          size={100}
          imageStyle={{ borderRadius: 15 }}
        />
      </View>
      <View styles={{ marginTop: 20 }}>
        <View style={{ marginTop: 10 }}>
          <Text
            h1
            h1Style={{ fontSize: 35, color: "#1BB530", textAlign: "center" }}
          >
            Hi,{" "}
            <Text h1 h1Style={{ fontSize: 35, color: "black" }}>
              {userData != null
                ? userData.get("fname")
                : authentication.currentUser.displayName}
            </Text>
          </Text>
          <Text
            h1
            h1Style={{
              fontSize: 35,
              color: "#1BB530",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Need A Charge?
          </Text>
        </View>
        <Divider style={{ width: "95%", margin: "2%" }} color="black" />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 10,
            marginLeft: "2%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ChargeMap");
            }}
          >
            <View style={styles.horiwelcome}>
              <Image
                source={require("./Icons/charger.png")}
                style={{ width: 70, height: 70, borderRadius: 30 }}
              />
              <View style={{ padding: "2%" }}></View>
              <Text style={{ textAlign: "center" }}>Charge Map</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Host");
            }}
          >
            <View style={styles.horiwelcome}>
              <Image
                source={require("./Icons/host.png")}
                style={{ width: 70, height: 70, borderRadius: 30 }}
              />
              <View style={{ padding: "2%" }} />
              <Text style={{ textAlign: "center" }}>Host</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Inbox");
            }}
          >
            <View style={styles.horiwelcome}>
              <Image
                source={require("./Icons/inbox.png")}
                style={{ width: 70, height: 70, borderRadius: 30 }}
              />
              <View style={{ padding: "2%" }} />
              <Text style={{ textAlign: "center" }}>Inbox</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile");
            }}
          >
            <View style={styles.horiwelcome}>
              <Image
                source={require("./Icons/profile.png")}
                style={{ width: 70, height: 70, borderRadius: 30 }}
              />
              <View style={{ padding: "2%" }} />
              <Text style={{ textAlign: "center" }}>Profile</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("https://t.me/ChargeEVHelpBot");
            }}
          >
            <View style={styles.horiwelcome}>
              <Image
                source={require("./Icons/support.png")}
                style={{ width: 70, height: 70, borderRadius: 30 }}
              />
              <Text style={{ textAlign: "center" }}>Support</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={{
          marginTop: 10,
        }}
        contentContainerStyle={{ paddingBottom: "90%" }}
      >
        {/* Find Chargers */}
        <TouchableOpacity
          style={styles.welcome}
          onPress={() => {
            navigation.navigate("ChargeMap");
          }}
        >
          <ImageBackground
            source={{
              url: "https://motoristprod.s3.amazonaws.com/uploads/redactor_rails/picture/data/6125/ev-charging-stations-in-shopping-malls-singapore-featured.jpeg",
            }}
            style={{ height: 175, width: "100%", marginLeft: "2.5%" }}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              style={styles.overlay}
              colors={["#ffffff", "#000000"]}
              start={{ x: 0, y: 1.25 }}
              end={{ x: 0, y: 0 }}
            />
            <Text
              style={{
                textAlign: "center",
                color: "white",
                marginTop: "2%",
                fontFamily: "Inter-Bold",
                fontSize: 20,
              }}
            >
              Find Chargers
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        {/* Hosting */}
        <TouchableOpacity
          style={styles.welcome}
          onPress={() => {
            navigation.navigate("Host");
          }}
        >
          <ImageBackground
            source={{
              url: "https://cleantechnica.com/files/2018/03/Toyota-Prius-Prime-garage-plugging-in.jpg",
            }}
            style={{ height: 175, width: "100%", marginLeft: "2.5%" }}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              style={styles.overlay}
              colors={["#ffffff", "#000000"]}
              start={{ x: 0, y: 1.25 }}
              end={{ x: 0, y: 0 }}
            />
            <Text
              style={{
                textAlign: "center",
                color: "white",
                marginTop: "2%",
                fontFamily: "Inter-Bold",
                fontSize: 20,
              }}
            >
              Hosting
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        {/* EV News */}
        <TouchableOpacity
          style={styles.welcome}
          onPress={() => {
            navigation.navigate("News");
          }}
        >
          <ImageBackground
            source={{
              url: "https://images.mktw.net/im-309602?width=1280&size=1.33333333",
            }}
            style={{ height: 175, width: "100%", marginLeft: "2.5%" }}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              style={styles.overlay}
              colors={["#ffffff", "#000000"]}
              start={{ x: 0, y: 1.25 }}
              end={{ x: 0, y: 0 }}
            />
            <Text
              style={{
                textAlign: "center",
                color: "white",
                marginTop: "2%",
                fontFamily: "Inter-Bold",
                fontSize: 20,
              }}
            >
              EV News
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  chargeMap: {
    borderWidth: 1,
  },
  horiwelcome: {
    marginRight: 15,
    width: "100%",
    alignItems: "center",
  },
  welcome: {
    marginBottom: 10,
    width: "95%",
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "20%",
    alignItems: "center",
    margin: "5%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  top: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginTop: 50,
    alignItems: "center",
    margin: "5%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    opacity: 0.5,
  },
});
