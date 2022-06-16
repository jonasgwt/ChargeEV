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
  getDoc,
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  GeoPoint,
} from "firebase/firestore";
import {
  authentication,
  firestore,
  googleMapsAPIKey,
} from "../../firebase/firebase-config";
import { Text, Divider, Button, Icon } from "@rneui/themed";
import PlaceType from "./AddLocationPages/PlaceType";
import * as Location from "expo-location";
import Address from "./AddLocationPages/Address";
import ChargerType from "./AddLocationPages/ChargerType";
import AddImage from "./AddLocationPages/AddImage";
import Price from "./AddLocationPages/Price";
import PaymentMethod from "./AddLocationPages/PaymentMethod";
import { uploadImage } from "../resources/uploadImage";
import { geohashForLocation } from "geofire-common";

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
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  // Data
  const [locationType, setLocationType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState([]);
  const [placeID, setPlaceID] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locationHash, setLocationHash] = useState("");
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
  const move = async () => {
    if (page == 1) {
      setLoading(true);
      checkAddress();
    } else if (page < 5) setPage((page) => page + 1);
    else if (page == 5) {
      await uploadData();
    }
  };
  // Navigate back to page before
  const back = () => {
    if (page != 0) setPage((page) => page - 1);
    else {
      navigation.goBack();
    }
  };

  // Check address validity
  const checkAddress = () => {
    Location.geocodeAsync(address + " " + city)
      .then((coords) => {
        if (coords.length == 0) {
          Alert.alert("Invalid Address");
          setLoading(false);
          return;
        }
        Location.reverseGeocodeAsync(coords[0]).then((locations) => {
          const check =
            locations[0].postalCode == postalCode &&
            locations[0].isoCountryCode == country;
          if (check) {
            setCoords([coords[0].latitude, coords[0].longitude]);
            setLocationHash(
              geohashForLocation([coords[0].latitude, coords[0].longitude])
            );
            setLoading(false);
            setPage((page) => page + 1);
          } else {
            Alert.alert("Invalid Address");
            setLoading(false);
          }
        });
      })
      .catch((err) => console.log(err));
  };

  // Updates placeID when coords change
  useEffect(() => {
    if (coords.length != 0) getPlaceID();
  }, [coords]);

  // Get placeID
  const getPlaceID = () => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        coords[0] +
        "," +
        coords[1] +
        "&key=" +
        { googleMapsAPIKey }.googleMapsAPIKey
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setPlaceID(responseJson.results[0].place_id);
      });
  };

  // Uploade to firestore
  const uploadData = async () => {
    // Checks if there is a similar address in dataabse
    const docSnap = await getDoc(doc(firestore, "HostedLocations", placeID));
    if (docSnap.exists()) {
      Alert.alert("We already have that location in database!");
      return;
    }
    // Navigate to loading page
    navigation.navigate("Loading");
    // Get user
    const userRef = doc(firestore, "users", authentication.currentUser.uid);
    const userDoc = await getDoc(userRef);
    let hostID = userDoc.data().hostID;

    // if no record of hosting in user, create one
    if (hostID == undefined) {
      const hostRef = await addDoc(collection(firestore, "Host"), {
        userID: authentication.currentUser.uid,
        rating: 0,
        totalRatings: 0,
        reviewCount: 0,
        bookings: [],
        locations: [placeID],
      });
      hostID = hostRef.id;
      await updateDoc(userRef, {
        hostID: hostRef.id,
      });
    } else {
      // else append new placeID to array of locations hosted
      const hostDoc = doc(firestore, "Host", userDoc.data().hostID);
      await updateDoc(hostDoc, {
        locations: arrayUnion(placeID),
      });
    }

    // Add location to database
    await setDoc(doc(firestore, "HostedLocations", placeID), {
      address: address,
      chargerType: chargerTypes,
      city: city,
      placeID: placeID,
      costPerCharge: price,
      country: country,
      hostedBy: hostID,
      housingType: locationType,
      locationImage: await uploadImage(pickedImagePath),
      paymentMethod: paymentMethods,
      postalCode: postalCode,
      unitNumber: unitNumber,
      coords: new GeoPoint(coords[0], coords[1]),
      locationHash: locationHash,
      bookings: [],
      available: true,
    });
    // Navigate to success page
    navigation.navigate("Success");
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
        {titleArr[page]}
      </Text>
      <Divider style={{ width: "90%", margin: 20 }} color="black" />
      <Animated.View
        style={[
          styles.progressBar,
          {
            transform: [{ translateX: progressAnim }],
          },
        ]}
      >
        <View style={styles.inside} />
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
          setLoading={setLoading}
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
          loading={loading}
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
