import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, Image, Pressable } from "react-native";

export default function Welcome({ navigation }) {

  const [page, setPage] = useState(0);
  const titles = ['Welcome', 'Hosts', 'Users'];
  const subTitles = ['Lorem Ipsum dolor sit atment,', 'Lorem Ipsum dolor sit atment,', 'Lorem Ipsum dolor sit atment,'];
  const texts = ['onsectetur adipiscing elit.', 'onsectetur adipiscing elit.', 'onsectetur adipiscing elit.'];

  const [title, setTitle] = useState(titles[0])
  const [subTitle, setSubTitle] = useState(subTitles[0])
  const [text, setText] = useState(texts[0])
  const [buttonText, setButtonText] = useState("Next");

  useEffect(() => {
    if (page >= 2) setButtonText("Let's Begin")
    setTitle(titles[page]);
    setSubTitle(subTitles[page]);
    setText(texts[page]);
  }, [page])

  const handleNext = () => {
    if (page < 2) setPage(page => page + 1)
    else navigation.navigate('Register');
  }


  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/welcomeLogo.png")}
      ></Image>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
      <Text style={styles.text}>{text}</Text>
      <Pressable style={styles.nextButton} onPress={handleNext}><Text style={styles.buttonText}>{buttonText}</Text></Pressable>
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
  title: {
    fontFamily: "Inter-Black",
    fontSize: 33,
    marginBottom: 15,
  },
  subTitle: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
  }, 
  text: {
    fontFamily: "Inter-Light",
    fontSize: 20,
  },
  nextButton: {
    backgroundColor: "#1BB530",
    height: 50,
    width: 250,
    position: "absolute",
    top: "100%",
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, 
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "white",
  }
});
