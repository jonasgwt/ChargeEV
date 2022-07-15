import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { Text } from "@rneui/themed";
import { newsAPIKey } from "../firebase/firebase-config";

export default function EVNews({ navigation }) {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);

  const getNews = async () => {
    setLoadingNews(true);
    await fetch(
      "https://newsapi.org/v2/everything?q=electric%20cars&apiKey="+ newsAPIKey
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
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={{
          marginTop: 10,
        }}
      >
        {loadingNews ? (
          <View style={{ marginTop: "-15%" }}>
            <AnimatedLottieView
              autoPlay
              style={{
                width: 300,
                height: 300,
              }}
              source={require("../assets/animations/findmessages.json")}
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
                    <Text
                      numberOfLines={3}
                      ellipsizeMode="tail"
                      style={{ fontSize: 15 }}
                    >
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
              source={require("../assets/animations/noresults.json")}
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
