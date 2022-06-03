import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Animated,
  View,
  Dimensions,
  Alert,
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
import * as Location from "expo-location";
import Address from "./AddLocationPages/Address";
import ChargerType from "./AddLocationPages/ChargerType";
import AddImage from "./AddLocationPages/AddImage";
import Price from "./AddLocationPages/Price";
import PaymentMethod from "./AddLocationPages/PaymentMethod";

export default function HostAddLocation({ navigation }) {
  const [page, setPage] = useState(0);
  const [completion, setCompletion] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const titleArr = [
    "What kind of place will you host at?",
    "What is your address?",
    "What is your charger type(s)?",
    "Add an image",
    "How much do you want to charge?",
    "Choose payment method(s)",
  ];
  const [numPagesCompleted, setNumPagesCompleted] = useState(0);
  const [disabledStatus, setDisabledStatus] = useState(true);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Data
  const [locationType, setLocationType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState([]);
  const [unitNumber, setUnitNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [chargerTypes, setChargerTypes] = useState([]);
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Update button status and counter for pages completed
  useEffect(() => {
    setDisabledStatus(!completion[page]);
    setNumPagesCompleted(completion.filter((x) => x == true).length);
  }, [page, completion]);

  // Update Completion status for page 0
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

  // Update Completion status for page 1
  useEffect(() => {
    if (
      country != "" &&
      city != "" &&
      address != "" &&
      unitNumber != "" &&
      postalCode != ""
    )
      setCompletion((completion) => {
        return [completion[0], true, ...completion.slice(2)];
      });
    else
      setCompletion((completion) => {
        return [completion[0], false, ...completion.slice(2)];
      });
  }, [country, city, address, unitNumber, postalCode]);

  // Update Completion status for page 2
  useEffect(() => {
    if (chargerTypes.length == 0)
      setCompletion((completion) => {
        return [...completion.slice(0, 2), false, ...completion.slice(3)];
      });
    else
      setCompletion((completion) => {
        return [...completion.slice(0, 2), true, ...completion.slice(3)];
      });
  }, [chargerTypes]);

  // Update Completion status for page 3
  useEffect(() => {
    if (pickedImagePath == "")
      setCompletion((completion) => {
        return [...completion.slice(0, 3), false, ...completion.slice(4)];
      });
    else
      setCompletion((completion) => {
        return [...completion.slice(0, 3), true, ...completion.slice(4)];
      });
  }, [pickedImagePath]);

  // Update Completion status for page 4
  useEffect(() => {
    if (price == "")
      setCompletion((completion) => {
        return [...completion.slice(0, 4), false, ...completion.slice(5)];
      });
    else
      setCompletion((completion) => {
        return [...completion.slice(0, 4), true, ...completion.slice(5)];
      });
  }, [price]);

  // Update Completion status for page 5
  useEffect(() => {
    if (paymentMethods.length == 0)
      setCompletion((completion) => {
        return [...completion.slice(0, 5), false, ...completion.slice(6)];
      });
    else
      setCompletion((completion) => {
        return [...completion.slice(0, 5), true, ...completion.slice(6)];
      });
  }, [paymentMethods]);

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
    if (page == 1) {
      checkAddress();
      if (isValidAddress) setPage((page) => page + 1);
      else {
        Alert.alert("Invalid Address");
        return;
      }
    } else if (page < 6) setPage((page) => page + 1);
  };
  // Navigate back to page before
  const back = () => {
    if (page != 0) setPage((page) => page - 1);
    else navigation.goBack();
  };

  // Check address validity
  const checkAddress = () => {
    Location.geocodeAsync(address + " " + city)
      .then((coords) => {
        setCoords[(coords[0].latitude, coords[0].latitude)];
        Location.reverseGeocodeAsync(coords[0]).then((locations) => {
          setIsValidAddress(
            locations[0].postalCode == postalCode &&
              locations[0].isoCountryCode == country &&
              locations[0].city == city
          );
        });
      })
      .catch((err) => console.log(err));
  };

  // Test
  useEffect(() => {}, []);

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
        {titleArr[page]}
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

      {page == 0 ? (
        <PlaceType
          setLocationType={setLocationType}
          locationType={locationType}
        />
      ) : page == 1 ? (
        <Address
          country={country}
          setCountry={setCountry}
          city={city}
          setCity={setCity}
          address={address}
          setAddress={setAddress}
          unitNumber={unitNumber}
          setUnitNumber={setUnitNumber}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
        />
      ) : page == 2 ? (
        <ChargerType
          chargerTypes={chargerTypes}
          setChargerTypes={setChargerTypes}
        />
      ) : page == 3 ? (
        <AddImage
          pickedImagePath={pickedImagePath}
          setPickedImagePath={setPickedImagePath}
        />
      ) : page == 4 ? (
        <Price price={price} setPrice={setPrice} />
      ) : page == 5 ? (
        <PaymentMethod
          paymentMethods={paymentMethods}
          setPaymentMethods={setPaymentMethods}
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
        <Button
          onPress={move}
          titleStyle={{ marginRight: 20 }}
          disabled={disabledStatus}
          disabledStyle={{ backgroundColor: "gray" }}
          disabledTitleStyle={{ color: "white" }}
        >
          {page == 5 ? "Done" : "Next"}
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
