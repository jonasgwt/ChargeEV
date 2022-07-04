import { React, useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ImageBackground } from "react-native";
import { Text, Button, Divider, Image } from "@rneui/themed";
import { authentication, firestore } from "../../firebase/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import AnimatedLottieView from "lottie-react-native";

export default function Homepage({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

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

  const getNews = async () => {
    setLoadingNews(true);
    await fetch(
      "https://newsapi.org/v2/everything?q=electric%20cars&apiKey=2d9f2e2251bc45e2a8b0470e53ec11ab"
    )
      .then((response) => response.json())
      .then((data) => {
        setNews(data.articles.splice(0, 10));
      })
      .then(() => setLoadingNews(false));
  };

  useEffect(() => {
    getNews();
  }, []);

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
        contentContainerStyle={{ paddingBottom: "100%" }}
      >
        {loadingNews ? (
          <View style={{ marginTop: "-15%" }}>
            <AnimatedLottieView
              autoPlay
              style={{
                width: 300,
                height: 300,
              }}
              source={require("../../assets/animations/findmessages.json")}
            />
            <Text
              h2
              h2Style={{ textAlign: "center" }}
              style={{ marginTop: "-10%" }}
            >
              Getting News...
            </Text>
          </View>
        ) : news.length > 0 ? (
          <>
            {news.map((x, index) => {
              return (
                <TouchableOpacity
                  style={styles.newsContainer}
                  key={index}
                  onPress={() => Linking.openURL(x.url)}
                >
                  <Image
                    source={{ url: x.urlToImage }}
                    style={{ width: 150, height: 100, borderRadius: 10 }}
                  />
                  <View
                    style={{ width: "50%", maxHeight: 100, overflow: "hidden" }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-Bold",
                        fontSize: 17,
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {x.title}
                    </Text>
                    <Text numberOfLines={3} ellipsizeMode="tail" style={{fontSize: 15}}>
                      {x.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <Text
              style={{ textAlign: "center", color: "gray", marginTop: "2%" }}
            >
              Data from newsapi.org
            </Text>
          </>
        ) : !loadingNews ? (
          <View style={{ height: "80%", alignItems: "center" }}>
            <AnimatedLottieView
              autoPlay
              style={{
                width: 150,
                height: 150,
              }}
              source={require("../../assets/animations/noresults.json")}
            />
            <Text
              h2
              h2Style={{ textAlign: "center", fontFamily: "Inter-Bold" }}
              style={{ marginTop: "10%" }}
            >
              Uh oh!
            </Text>
            <Text style={{ textAlign: "center" }}>
              We are unable to get any news right now.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  horiwelcome: {
    marginRight: 15,
    width: "100%",
    alignItems: "center"
  },

  welcome: {
    textAlign: "center",
    fontSize: 20,
    borderRadius: 20,
    alignContent: "center",
    alignItems: "center",
    marginBottom: 10,
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
  newsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "95%",
    margin: "2%",
    borderBottomWidth: 0.5,
    paddingBottom: "2%",
  },
});
