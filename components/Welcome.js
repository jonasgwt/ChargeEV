import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Image } from "react-native";
import { Button, Text } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";

export default function Welcome({ navigation }) {
  // Content
  const titles = ["Welcome", "Hosts", "Users"];
  const subTitles = [
    "We are ChargeEV",
    "Loan out your Charger",
    "Loan a charger",
  ];
  const texts = [
    "Your EV Partner",
    "Be a part of our extensive network.",
    "Never worry about charging!",
  ];

  // States
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState(titles[0]);
  const [subTitle, setSubTitle] = useState(subTitles[0]);
  const [text, setText] = useState(texts[0]);
  const [buttonText, setButtonText] = useState("Next");

  // Update Content upon page change
  useEffect(() => {
    if (page >= 2) setButtonText("Get Started");
    setTitle(titles[page]);
    setSubTitle(subTitles[page]);
    setText(texts[page]);
  }, [page]);

  // handles onclick of next
  const handleNext = () => {
    if (page < 2) setPage((page) => page + 1);
    else {
      navigation.navigate("Register");
      setPage(0);
      setButtonText("Next");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {page == 0 ? <Image
        style={styles.image}
        source={require("../assets/welcomeLogo.png")}
      /> : <AnimatedLottieView autoPlay
        style={{
          width: 300,
          height: 300,
          marginTop: "-5%"
        }}
        source={page == 1 ? require("../assets/animations/host.json/"):require("../assets/animations/loading.json/")} />}
      <Text h1 style={{ marginBottom: 10 }}>
        {title}
      </Text>
      <Text h2 h2Style={{ fontSize: 25, marginBottom: 5 }}>
        {subTitle}
      </Text>
      <Text h4>{text}</Text>
      <Button
        title={buttonText}
        buttonStyle={{ width: 250, height: 50 }}
        containerStyle={styles.nextButton}
        onPress={handleNext}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20%",
  },
  image: {
    height: 170,
    width: 150,
    marginBottom: 30,
  },
  nextButton: {
    position: "absolute",
    top: "100%",
    borderRadius: 5,
  },
});
