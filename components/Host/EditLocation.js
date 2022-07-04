import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
} from "react-native";
import { Button, Icon, Input, Text } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  arrayRemove,
  deleteDoc,
  doc,
  GeoPoint,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore, googleMapsAPIKey } from "../../firebase/firebase-config";
import AnimatedLottieView from "lottie-react-native";
import RNPickerSelect from "react-native-picker-select";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DismissKeyboardView } from "../resources/DismissKeyboardView";
import { TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SelectionHosting from "../resources/SelectionHosting";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../resources/uploadImage";
import { geohashForLocation } from "geofire-common";
import * as Location from "expo-location";

export default function EditLocation({ navigation, route }) {
  const { id, currImage, currAddress, hostID } = route.params;
  const [loading, setLoading] = useState(false);
  const [housingType, setHousingType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [costPerCharge, setCostPerCharge] = useState("");
  const [qrCode, setQrCode] = useState(false);
  const [cash, setCash] = useState(false);
  const [type2, setType2] = useState(false);
  const [ccs2, setCcs2] = useState(false);
  const [states, setStates] = useState([]);
  const [locationHash, setLocationHash] = useState("");
  const [coords, setCoords] = useState("");
  const [placeID, setPlaceID] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const isMounted = useRef(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // make a reqeust to api to get all the states from a given country
  async function getStates(countryCode) {
    if (countryCode == "") {
      setCity("");
      return;
    }
    await fetch(
      "https://battuta.medunes.net/api/region/" +
        countryCode +
        "/all/?key=848a8d354030b7e0ae7a3a18d9f828ef"
    )
      .catch((err) => console.log(err))
      .then((response) => response.json())
      .then((data) => {
        let check = city == "";
        setStates(
          data.map((x) => {
            check = check || x.region == city;
            return {
              label: x.region,
              value: x.region,
            };
          })
        );
        if (!check) setCity("");
      });
  }

  // Driver function
  // TODO: Change image to firebase image for production
  useEffect(() => {
    const getInfo = async () => {
      setLoading(true);
      const locationDoc = await getDoc(doc(firestore, "HostedLocations", id));
      setHousingType(locationDoc.data().housingType);
      setCountry(locationDoc.data().country);
      await getStates(locationDoc.data().country);
      setCity(locationDoc.data().city);
      setAddress(locationDoc.data().address);
      setUnitNumber(locationDoc.data().unitNumber);
      setPostalCode(locationDoc.data().postalCode);
      setImage(currImage);
      setCostPerCharge(locationDoc.data().costPerCharge);
      const chargersTemp = locationDoc.data().chargerType;
      const paymentTemp = locationDoc.data().paymentMethod;
      paymentTemp.forEach((x) => {
        if (x == "Cash") setCash(true);
        else if (x == "QR Code") setQrCode(true);
      });
      chargersTemp.forEach((x) => {
        if (x == "Type 2") setType2(true);
        else if (x == "CCS2") setCcs2(true);
      });
      isMounted.current = true;
      setLoading(false);
    };
    getInfo().then(() => setImage("https://picsum.photos/2000"));
  }, []);

  // handles multi select
  useEffect(() => {
    if (isMounted.current && !type2 && !ccs2) setCcs2(true);
  }, [type2]);

  useEffect(() => {
    if (isMounted.current && !type2 && !ccs2) setType2(true);
  }, [ccs2]);

  useEffect(() => {
    if (isMounted.current && !qrCode && !cash) setCash(true);
  }, [qrCode]);

  useEffect(() => {
    if (isMounted.current && !qrCode && !cash) setQrCode(true);
  }, [cash]);

  // Show choice when user selects change image
  const showChoice = () => {
    Alert.alert("Hosting", "Select an image of your hosting location", [
      {
        text: "Select from Photos",
        onPress: showImagePicker,
      },
      {
        text: "Take a Photo",
        onPress: openCamera,
      },
      {
        text: "Cancel",
      },
    ]);
  };

  // Opens user camera for image
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your camera!");
      return;
    }
    setLoading(true);
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setImage(result.uri);
      setImageChanged(true);
    }
    setLoading(false);
  };

  // Choose image
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your photos!");
      return;
    }
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setImage(result.uri);
      setImageChanged(true);
    }
    setLoading(false);
  };

  // Check address validity
  const checkAddress = async () => {
    return await Location.geocodeAsync(address + " " + city)
      .then(async (coords) => {
        if (coords.length == 0) {
          Alert.alert("Invalid Address");
          setLoadingSave(false);
          return;
        }
        return await Location.reverseGeocodeAsync(coords[0]).then(
          (locations) => {
            const check =
              locations[0].postalCode == postalCode &&
              locations[0].isoCountryCode == country;
            if (check) {
              setCoords([coords[0].latitude, coords[0].longitude]);
              setLocationHash(
                geohashForLocation([coords[0].latitude, coords[0].longitude])
              );
            } else {
              Alert.alert(
                "Invalid Address",
                "It is likely that your postal code do not match your written address"
              );
              setLoadingSave(false);
            }
            return check;
          }
        );
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

  // driver function when user clicks on save changes
  const handleChange = async () => {
    setLoadingSave(true);
    if (
      housingType == "" ||
      country == "" ||
      city == "" ||
      address == "" ||
      unitNumber == "" ||
      postalCode == "" ||
      costPerCharge == "" ||
      image == ""
    ) {
      Alert.alert("Please ensure all fields are filled up");
      return;
    }
    if (await checkAddress()) await uploadData();
    else return;
    setLoadingSave(false);
    navigation.navigate("ViewLocations");
  };

  // updates data to firebase
  const uploadData = async () => {
    const chargerType = [];
    const paymentMethod = [];
    if (ccs2) chargerType.push("CCS2");
    if (type2) chargerType.push("Type 2");
    if (cash) paymentMethod.push("Cash");
    if (qrCode) paymentMethod.push("QR Code");
    await updateDoc(doc(firestore, "HostedLocations", id), {
      address: address,
      chargerType: chargerType,
      city: city,
      costPerCharge: parseInt(costPerCharge).toFixed(2),
      country: country,
      housingType: housingType,
      locationHash: locationHash,
      paymentMethod: paymentMethod,
      placeID: placeID,
      postalCode: postalCode,
      unitNumber: unitNumber,
      locationImage: imageChanged ? await uploadImage(image) : image,
    });
    if (coords.length != 0)
      await updateDoc(doc(firestore, "HostedLocations", id), {
        coords: new GeoPoint(coords[0], coords[1]),
      });
  };

  const deleteLocation = async () => {
    setLoadingDelete(true);
    await deleteDoc(doc(firestore, "HostedLocations", id));
    await updateDoc(doc(firestore, "Host", hostID), {
      locations: arrayRemove(id),
    });
    setLoadingDelete(false);
    navigation.navigate("View Locations");
  };

  return (
    <DismissKeyboardView>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back-ios" />
      </TouchableOpacity>
      <ImageBackground
        source={{ url: image }}
        style={styles.image}
        blurRadius={1}
      >
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
            fontSize: 25,
            shadowOpacity: 0.7,
          }}
        >
          {currAddress}
        </Text>
        <Text
          h2
          h2Style={{
            color: "white",
            fontFamily: "Inter-Regular",
            fontSize: 20,
            shadowOpacity: 0.7,
          }}
          style={{ marginBottom: "5%" }}
        >
          {loading ? "Loading..." : postalCode}
        </Text>
      </ImageBackground>

      {loading ? (
        <View
          style={{ height: "50%", display: "flex", justifyContent: "center" }}
        >
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
            Loading...
          </Text>
        </View>
      ) : (
        <KeyboardAwareScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: "135%" }}
        >
          <RNPickerSelect
            onValueChange={setHousingType}
            value={housingType}
            placeholder={{
              label: "Select your housing type",
              value: "",
            }}
            items={[
              { label: "Apartment", value: "Apartment" },
              { label: "Landed Housing", value: "Landed Housing" },
            ]}
            style={pickerSelectStyles}
          />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              paddingLeft: "1%",
              paddingRight: "1%",
              marginBottom: "3%",
            }}
          >
            <RNPickerSelect
              onValueChange={async (x) => {
                await getStates(x);
                setCountry(x);
              }}
              value={country}
              placeholder={{
                label: "Country",
                value: "",
              }}
              items={[
                { label: "United States", value: "US" },
                { label: "Singapore", value: "SG" },
              ]}
              style={pickerSelectStylesHalved}
            />
            <RNPickerSelect
              onValueChange={setCity}
              value={city}
              placeholder={{
                label: "City",
                value: "",
              }}
              items={
                country == "SG"
                  ? [{ label: "Singapore", value: "Singapore" }]
                  : states
              }
              style={pickerSelectStylesHalved}
            />
          </View>
          <Input
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            containerStyle={{ marginBottom: "-3%" }}
          />
          <View style={{ flexDirection: "row", marginBottom: "-3%" }}>
            <Input
              placeholder="Unit Number"
              value={unitNumber}
              onChangeText={setUnitNumber}
              containerStyle={{ width: "50%" }}
            />
            <Input
              placeholder="Postal Code"
              value={postalCode}
              onChangeText={setPostalCode}
              containerStyle={{ width: "50%" }}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.priceContainer}>
            <Input
              containerStyle={{ width: "50%" }}
              keyboardType="decimal-pad"
              placeholder="Enter Price"
              leftIcon={
                <MaterialCommunityIcons name="currency-usd" size={30} />
              }
              inputStyle={{
                fontSize: 18,
                fontFamily: "Inter-Regular",
                marginLeft: "5%",
              }}
              onChangeText={setCostPerCharge}
              value={costPerCharge}
            />
            <TouchableOpacity style={styles.picture} onPress={showChoice}>
              <Icon name="image" style={{ marginRight: "5%" }} />
              <Text style={{ fontSize: 18, fontFamily: "Inter-Regular" }}>
                Select Image
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "95%",
              marginLeft: "2.5%",
              justifyContent: "space-between",
              marginBottom: "-20%",
            }}
          >
            <View
              style={{
                width: "52.5%",
              }}
            >
              <SelectionHosting
                selectionTitle="Type 2"
                imageName={require("../../assets/chargers/type2.png")}
                selected={type2}
                setSelected={setType2}
                height="40%"
              />
            </View>
            <View
              style={{
                width: "52.5%",
              }}
            >
              <SelectionHosting
                selectionTitle="CCS2"
                imageName={require("../../assets/chargers/CCS.png")}
                selected={ccs2}
                setSelected={setCcs2}
                height="40%"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "95%",
              marginLeft: "2.5%",
              justifyContent: "space-between",
              marginBottom: "-15%",
            }}
          >
            <View
              style={{
                width: "52.5%",
              }}
            >
              <SelectionHosting
                selectionTitle="QR Code"
                iconName="qr-code"
                selected={qrCode}
                setSelected={setQrCode}
                height="40%"
              />
            </View>
            <View
              style={{
                width: "52.5%",
              }}
            >
              <SelectionHosting
                selectionTitle="Cash"
                iconName="money"
                selected={cash}
                setSelected={setCash}
                height="40%"
              />
            </View>
          </View>
          <Button
            title="Save Changes"
            containerStyle={{ alignSelf: "center", width: "60%" }}
            onPress={handleChange}
            loading={loadingSave}
            buttonStyle={{
              justifyContent: "space-around",
            }}
          >
            <Icon name="done" color="white" />
            <Text h3 h3Style={{ color: "white" }}>
              Save Changes
            </Text>
          </Button>
          <Button
            containerStyle={{
              alignSelf: "center",
              marginTop: "5%",
              width: "60%",
            }}
            buttonStyle={{
              backgroundColor: "#f24660",

              justifyContent: "space-around",
            }}
            onPress={deleteLocation}
            loading={loadingDelete}
          >
            <Icon name="cancel" color="white" />
            <Text h3 h3Style={{ color: "white" }}>
              Delete Location
            </Text>
          </Button>
        </KeyboardAwareScrollView>
      )}
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 200,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  content: {
    marginTop: "5%",
  },
  priceContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "-2%",
  },
  picture: {
    borderColor: "#707070",
    marginLeft: "2.5%",
    fontFamily: "Inter-Regular",
    fontSize: 18,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.101961)",
    shadowOpacity: 100,
    shadowRadius: 10,
    borderRadius: 8,
    marginBottom: "5%",
    padding: "5%",
    width: "45%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: "5%",
    width: "9%",
    height: "3%",
    backgroundColor: "white",
    left: "5%",
    borderRadius: 10,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "95%",
    padding: "5%",
    borderColor: "#707070",
    marginLeft: "2.5%",
    fontFamily: "Inter-Regular",
    fontSize: 18,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.101961)",
    shadowOpacity: 100,
    shadowRadius: 10,
    borderRadius: 8,
    marginBottom: "3%",
  },
});

const pickerSelectStylesHalved = StyleSheet.create({
  inputIOS: {
    width: (Dimensions.get("window").width / 100) * 45,
    padding: "5%",
    borderColor: "#707070",
    marginLeft: "2.5%",
    fontFamily: "Inter-Regular",
    fontSize: 18,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.101961)",
    shadowOpacity: 100,
    shadowRadius: 10,
    borderRadius: 8,
    flex: 1,
  },
});
