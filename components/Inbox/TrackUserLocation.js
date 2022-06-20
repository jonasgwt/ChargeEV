import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Alert,
  View,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { firestore } from "../../firebase/firebase-config";
import { Icon, Text } from "@rneui/themed";
import { googleMapsAPIKey } from "../../firebase/firebase-config";

export default function TrackUserLocation({ navigation, route }) {
  const { bookingID, bgOn } = route.params;
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = height / width;
  const mapRef = useRef(null);
  const [destination, setDestination] = useState([null, null]);
  const [userLocation, setUserLocation] = useState([null, null]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [distanceAway, setDistanceAway] = useState("");
  const [timeAway, setTimeAway] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");

  const LoadingView = () => {
    return (
      <View>
        <Text h4 h4Style={{ textAlign: "center", marginBottom: "2%" }}>
          Loading...
        </Text>
        <Image
          source={require("../../assets/logo_nobg_black.png")}
          style={styles.loadingImage}
        />
      </View>
    );
  };

  const getUserLocation = async () => {
    const bookingDoc = await getDoc(doc(firestore, "Bookings", bookingID));
    if (!bookingDoc.exists()) {
      clearInterval(checkLocation);
      navigation.navigate("InboxHomeScreen");
      return;
    }
    if (bookingDoc.data().userReached) {
      clearInterval(checkLocation);
      navigation.navigate("InboxHomeScreen");
      return;
    }
    setUserLocation([
      bookingDoc.data().currentUserLocation.latitude,
      bookingDoc.data().currentUserLocation.longitude,
    ]);
  };

  const checkLocation = setInterval(getUserLocation, 5000);

  useEffect(() => {
    const getDestination = async () => {
      const bookingDoc = await getDoc(doc(firestore, "Bookings", bookingID));
      const locationDoc = await getDoc(
        doc(firestore, "HostedLocations", bookingDoc.data().location)
      );
      setAddress(locationDoc.data().address);
      setDestination([
        locationDoc.data().coords.latitude,
        locationDoc.data().coords.longitude,
      ]);
    };
    const getUserInfo = async () => {
      const bookingDoc = await getDoc(doc(firestore, "Bookings", bookingID));
      const userDoc = await getDoc(
        doc(firestore, "users", bookingDoc.data().user)
      );
      if (userDoc.data().userImg == undefined)
        setProfilePicture(
          "https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/photos%2F149071.png?alt=media&token=509b42b3-27ab-452f-a3e8-8c0e93fcb229"
        );
      else setProfilePicture(userDoc.data().userImg);
      setUserPhoneNumber(userDoc.data().phone);
      setDisplayName(userDoc.data().fname + " " + userDoc.data().lname);
    };
    getDestination()
      .then(() => getUserLocation())
      .then(() => getUserInfo())
      .then(() => setLoading(false))
      .then(() => console.log(profilePicture));
    if (!bgOn)
      Alert.alert(
        "User has not enabled background locations",
        "User location may not be updated"
      );
    return () => {
      clearInterval(getUserLocation);
    };
  }, []);

  useEffect(() => {
    if (userLocation[0] != null && destination[0] != null && !loading) {
      mapRef.current.fitToElements({
        animated: true,
        edgePadding: {
          top: ASPECT_RATIO > 2 ? 200 : 200,
          left: 70,
          right: 70,
          bottom: ASPECT_RATIO > 2 ? 350 : 300,
        },
      });
    }
  }, [userLocation, destination, loading]);

  const callUser = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Call " + userPhoneNumber],
        cancelButtonIndex: 0,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          Linking.openURL("tel:" + userPhoneNumber);
        }
      }
    );
  };

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <MapView
        style={styles.map}
        ref={mapRef}
        showsPointsOfInterest={false}
        showsBuildings={false}
        provider={PROVIDER_GOOGLE}
      >
        {!loading ? (
          <Marker
            coordinate={{
              latitude: destination[0],
              longitude: destination[1],
            }}
            title={address}
          />
        ) : null}

        {!loading ? (
          <Marker
            coordinate={{
              latitude: userLocation[0],
              longitude: userLocation[1],
            }}
            title="User Location"
          />
        ) : null}

        {!loading ? (
          <MapViewDirections
            origin={{ latitude: userLocation[0], longitude: userLocation[1] }}
            destination={{
              latitude: destination[0],
              longitude: destination[1],
            }}
            apikey={googleMapsAPIKey}
            strokeWidth={10}
            strokeColor="#1BB530"
            onStart={(x) => console.log("Starting routing")}
            onReady={(result) => {
              setDistanceAway(result.distance);
              setTimeAway(result.duration);
            }}
            onError={(errorMessage) => {
              console.log(errorMessage);
            }}
          />
        ) : null}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          clearInterval(checkLocation);
          navigation.navigate("InboxHomeScreen");
        }}
      >
        <Icon name="arrow-back" />
      </TouchableOpacity>

      {/* Reframe Button */}
      <TouchableOpacity
        style={[styles.refreshButton, { right: "5%" }]}
        onPress={() => {
          mapRef.current.fitToElements({
            animated: true,
            edgePadding: {
              top: ASPECT_RATIO > 2 ? 200 : 200,
              left: 70,
              right: 70,
              bottom: ASPECT_RATIO > 2 ? 350 : 300,
            },
          });
        }}
      >
        <Icon name="crop-free" />
      </TouchableOpacity>

      {/* Bottom Box */}
      <View style={styles.bottomBox}>
        <Text style={styles.upperText}>User Location is updated every 5s.</Text>
        {loading ? (
          <LoadingView />
        ) : (
          <View>
            {/* User Container */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: "65%",
                marginTop: "5%",
              }}
            >
              <Image source={{ url: "profilePicture" }} style={styles.userdp} />
              <View>
                <Text h3 h3Style={{ fontFamily: "Inter-SemiBold" }}>
                  {displayName}
                </Text>
                <Text h3>{Math.round(distanceAway * 10) / 10}m away</Text>
                <Text h3>{Math.round(timeAway * 10) / 10} min</Text>
              </View>
            </View>
            {/* Button Container */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={styles.button} onPress={callUser}>
                <Icon name="call" color="white" size={25} />
                <Text h4 h4Style={{ color: "white" }}>
                  Contact User
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    zIndex: -1,
  },
  userdp: {
    width: 75,
    height: 75,
    borderRadius: 50,
    borderWidth: 1,
  },
  backButton: {
    position: "absolute",
    top: "7%",
    width: "10%",
    height: "5%",
    backgroundColor: "white",
    left: "5%",
    borderRadius: "100%",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
    display: "flex",
    justifyContent: "center",
  },
  refreshButton: {
    position: "absolute",
    top: "7%",
    width: "10%",
    height: "5%",
    backgroundColor: "white",
    right: "17%",
    borderRadius: "100%",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
    display: "flex",
    justifyContent: "center",
  },
  bottomBox: {
    position: "absolute",
    bottom: "2%",
    backgroundColor: "white",
    width: "95%",
    height: "25%",
    borderRadius: 20,
    padding: "2%",
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingImage: {
    width: 313.6,
    height: 100,
  },
  button: {
    backgroundColor: "#1BB530",
    padding: "3%",
    borderRadius: 5,
    marginTop: "5%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "60%",
  },
  upperText: {
    position: "absolute",
    top: 5,
    color: "gray",
  },
});
