import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Image, Pressable } from "react-native";
import { Button, Text } from "@rneui/themed";

export default function Welcome({ navigation }) {
  
  // Content
  const titles = ["Welcome", "Hosts", "Users"];
  const subTitles = [
    "Lorem Ipsum dolor sit atment,",
    "Lorem Ipsum dolor sit atment,",
    "Lorem Ipsum dolor sit atment,",
  ];
  const texts = [
    "onsectetur adipiscing elit.",
    "onsectetur adipiscing elit.",
    "onsectetur adipiscing elit.",
  ];

  // States
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState(titles[0]);
  const [subTitle, setSubTitle] = useState(subTitles[0]);
  const [text, setText] = useState(texts[0]);
  const [buttonText, setButtonText] = useState("Next");

  // Update Content upon page change
  useEffect(() => {
    if (page >= 2) setButtonText("Let's Begin");
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
      setButtonText("Next")
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/welcomeLogo.png")}
      ></Image>
      <Text h1 style={{ marginBottom: 20 }}>
        {title}
      </Text>
      <Text h2>{subTitle}</Text>
      <Text h3>{text}</Text>
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
