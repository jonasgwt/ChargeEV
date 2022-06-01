import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Animated,
  View,
  Dimensions,
} from "react-native";
import {
  getDocs,
  addDoc,
  collection,
  GeoPoint,
  query,
  where,
} from "firebase/firestore";
import { authentication, firestore } from "../../firebase/firebase-config";
import { Text, Divider, Button, Icon } from "@rneui/themed";
import PlaceType from "./AddLocationPages/PlaceType";

export default function HostAddLocation({ navigation }) {
  const [page, setPage] = useState(1);
  const [completion, setCompletion] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [numPagesCompleted, setNumPagesCompleted] = useState(0);
  const [disabledStatus, setDisabledStatus] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Data
  const [locationType, setLocationType] = useState("");

  // Update button status and counter for pages completed
  useEffect(() => {
    setDisabledStatus(!completion[page - 1]);
    setNumPagesCompleted(completion.filter((x) => x == true).length);
  }, [completion, page]);

  // Update Completion status for page 1
  useEffect(() => {
    if (locationType != "") {
      setCompletion((completion) => {
        return [true, ...completion.slice(1)];
      });
    } else
      setCompletion((completion) => {
        return [false, ...completion.slice(1)];
      });
  }, [locationType]);

  // Update Completion Bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (Dimensions.get("window").width / 6) * numPagesCompleted,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [numPagesCompleted]);

  // Navigate to Next page
  const move = () => {
    if (page <= 6) setPage((page) => page + 1);
  };
  // Navigate back to page before
  const back = () => {
    if (page != 1) setPage((page) => page - 1);
    else navigation.goBack()
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        h1
        h1Style={{
          fontSize: 30,
          textAlign: "center",
          paddingTop: "5%",
          width: "85%",
        }}
      >
        What kind of place will you host at?
      </Text>
      <Divider style={{ width: "90%", margin: 20 }} color="black" />
      <Animated.View
        style={[
          styles.progressBar,
          { transform: [{ translateX: progressAnim }] },
        ]}
      >
        <View style={styles.inside}></View>
      </Animated.View>

      {page == 1 ? (
        <PlaceType
          setLocationType={setLocationType}
          locationType={locationType}
        />
      ) : null}

      <View style={styles.bottomContainer}>
        <Button
          buttonStyle={{ backgroundColor: "gray" }}
          titleStyle={{ marginLeft: 20 }}
          onPress={back}
        >
          <Icon name="west" color="white" />
          Back
        </Button>
        <Text>{page}</Text>
        <Button
          onPress={move}
          titleStyle={{ marginRight: 20 }}
          disabled={disabledStatus}
          disabledStyle={{ backgroundColor: "gray" }}
          disabledTitleStyle={{ color: "white" }}
        >
          Next
          <Icon name="east" color="white" />
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  progressBar: {
    position: "absolute",
    bottom: "15%",
    width: "100%",
    height: "0.2%",
    backgroundColor: "gray",
  },
  inside: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1BB530",
    transform: [{ translateX: -Dimensions.get("window").width }],
  },
  bottomContainer: {
    position: "absolute",
    bottom: "7%",
    width: "100%",
    paddingLeft: "5%",
    paddingRight: "5%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
