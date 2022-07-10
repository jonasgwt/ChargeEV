import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  View,
} from "react-native";
import { Text, Divider, Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc } from "firebase/firestore";
import { authentication, firestore } from "../../firebase/firebase-config";
import AnimatedLottieView from "lottie-react-native";

export default function ViewLocations({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [hostID, setHostID] = useState("");
  const [locations, setLocations] = useState([]);

  const getLocations = async () => {
    setLoading(true);
    const userDoc = await getDoc(
      doc(firestore, "users", authentication.currentUser.uid)
    );
    setHostID(userDoc.data().hostID);
    const hostDoc = await getDoc(doc(firestore, "Host", userDoc.data().hostID));
    const temp = hostDoc.data().locations;
    Promise.all(
      temp.map(async (x) => {
        const currentDoc = await getDoc(doc(firestore, "HostedLocations", x));
        return {
          id: x,
          address: currentDoc.data().address,
          image: currentDoc.data().locationImage,
        };
      })
    )
      .then((loc) => setLocations(loc))
      .then(() => setLoading(false));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await getLocations();
    });
    return unsubscribe;
  }, [navigation]);

  const editLocation = (id, image, address) => {
    navigation.navigate("EditLocation", {
      id: id,
      currImage: image,
      currAddress: address,
      hostID: hostID,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {loading ? (
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
              Fetching Information...
            </Text>
          </View>
        ) : locations.length != 0 ? (
          locations.map((x, index) => (
            <TouchableOpacity
              key={index}
              style={styles.selection}
              onPress={() => editLocation(x.id, x.image, x.address)}
            >
              <ImageBackground
                resizeMode="cover"
                source={{
                  url: "https://picsum.photos/2000",
                }}
                style={styles.bgImage}
                imageStyle={{ borderRadius: 10 }}
                blurRadius={3}
              />

              <LinearGradient
                style={styles.overlay}
                colors={["#ffffff", "#000000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              <Text
                h2
                h2Style={{
                  color: "white",
                  fontFamily: "Inter-Bold",
                  shadowOpacity: 0.7,
                  shadowOffset: { width: 5, height: 5 },
                }}
                style={{ maxWidth: "90%" }}
              >
                {x.address}
              </Text>
              <Icon name="arrow-forward-ios" color="white" />
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={{ height: "80%", display: "flex", justifyContent: "center" }}
          >
            <AnimatedLottieView
              autoPlay
              style={{
                width: 200,
                height: 200,
                marginTop: "10%",
              }}
              source={require("../../assets/animations/noresults.json")}
            />
            <Text
              h2
              h2Style={{ textAlign: "center" }}
              style={{ marginTop: "20%" }}
            >
              We do not have any records of locations hosted by you.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "5%",
  },
  scrollContainer: {
    width: "100%",
    height: "100%",
  },
  selection: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderRadius: 10,
    padding: "5%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    overflow: "hidden",
    marginBottom: "5%",
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    opacity: 0.5,
  },
});
