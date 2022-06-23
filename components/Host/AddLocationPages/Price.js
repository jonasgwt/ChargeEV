import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { Icon, Input, Text } from "@rneui/themed";
import { DismissKeyboardView } from "../../resources/DismissKeyboardView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { firestore } from "../../../firebase/firebase-config";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
import {
  getDocs,
  query,
  collection,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";

export default function Price({ price, setPrice, coords }) {
  const [isLoading, setIsLoading] = useState(true);
  const [infoSource, setInfoSource] = useState([]);
  const [cost, setCost] = useState(0);
  const [utilityName, setUtilityName] = useState("");
  const [dataAvailable, setDataAvailable] = useState(true);
  const [priceChargersNear, setPriceChargersNear] = useState(0);
  const [chargersNear, setChargersNear] = useState([]);
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = height / width;

  const getElectricityPricingData = async () => {
    const data = await fetch(
      "https://developer.nrel.gov/api/utility_rates/v3.json?api_key=tTWuQl3cs6AzDswjFMzc4f3VizYQotTokN2D50R3&lat=" +
        coords[0] +
        "&lon=" +
        coords[1]
    ).then((response) => response.json());
    if (data.errors.length != 0) Alert.alert(data.errors[0]);
    if (data.outputs.residential == "no data") setDataAvailable(false);
    setInfoSource(data.metadata.sources);
    setCost(data.outputs.residential);
    setUtilityName(data.outputs.utility_name);
  };

  // Charges in a 50km radius
  const getChargerPricesNear = async () => {
    const radiusInM = 50 * 1000;
    const bounds = geohashQueryBounds(coords, radiusInM);
    const promises = [];
    for (const b of bounds) {
      const q = await getDocs(
        query(
          collection(firestore, "HostedLocations"),
          orderBy("locationHash"),
          startAt(b[0]),
          endAt(b[1])
        )
      );
      promises.push(q);
    }
    Promise.all(promises)
      .then(async (snapshots) => {
        const matchingDocs = [];
        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const doccoords = doc.get("coords");
            const lat = doccoords.latitude;
            const lng = doccoords.longitude;
            const distanceInKm = distanceBetween([lat, lng], coords);
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push({
                price: doc.data().costPerCharge,
                location: doc.data().address,
                chargerType: doc.data().chargerType,
              });
            }
          }
        }
        return matchingDocs;
      })
      .then((locations) => {
        // Process the matching documents
        const data = [];
        setPriceChargersNear(
          (
            locations.reduce((total, loc) => {
              data.push(loc);
              return (total += parseInt(loc.price));
            }, 0) / locations.length
          ).toFixed(2)
        );
        setChargersNear(data);
      });
  };

  useEffect(() => {
    const initialise = async () => {
      setIsLoading(true);
      await getElectricityPricingData();
      await getChargerPricesNear();
      setIsLoading(false);
    };
    initialise();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { maxHeight: ASPECT_RATIO > 2 ? "70%" : "60%" },
      ]}
    >
      <View style={styles.priceContainer}>
        <Input
          containerStyle={styles.input}
          keyboardType="decimal-pad"
          placeholder="Enter Price"
          leftIcon={<MaterialCommunityIcons name="currency-usd" size={30} />}
          inputStyle={{
            fontSize: 20,
            fontFamily: "Inter-Regular",
            marginLeft: "5%",
          }}
          onChangeText={setPrice}
          value={price}
        />
        <Text h2 h2Style={{ fontSize: 25 }}>
          / charge
        </Text>
      </View>
      {!isLoading ? (
        <ScrollView style={styles.text}>
          <DismissKeyboardView>
            {dataAvailable ? (
              <>
                <Text h4 h4Style={{ marginBottom: "5%" }}>
                  According to data from {infoSource} cost of electricity is{" "}
                  <Text h4 h4Style={{ fontFamily: "Inter-Bold" }}>
                    ${cost.toFixed(2)}/kwh{" "}
                  </Text>
                  from {utilityName}.
                </Text>
                <Text h4 h4Style={{ marginBottom: "5%" }}>
                  Average cost of a full charge is{" "}
                  <Text h4 h4Style={{ fontFamily: "Inter-Bold" }}>
                    ${(cost * 40).toFixed(2)} - ${(cost * 100).toFixed(2)}
                  </Text>{" "}
                  (40kwh - 100kwh)
                </Text>
              </>
            ) : (
              <Text h4 h4Style={{ marginBottom: "5%" }}>
                Sorry! We are only able to provide electricity cost data to
                locations in United States
              </Text>
            )}
            <Text h4>
              Chargers near you are charging
              <Text h4 h4Style={{ fontFamily: "Inter-Bold" }}>
                {" "}
                ${priceChargersNear}
              </Text>
            </Text>
            <View
              style={{
                marginTop: "7%",
                flex: 1,
              }}
            >
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 17 }}>
                Chargers Near You
              </Text>
              <View style={styles.chargerExplorer}>
                {chargersNear.map((x, index) => (
                  <View key={index} style={styles.chargerContainer}>
                    <View>
                      <Text>{x.location}</Text>
                      <Text>{x.chargerType}</Text>
                    </View>
                    <Text>${parseInt(x.price).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </DismissKeyboardView>
        </ScrollView>
      ) : (
        <Text>Loading Data...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
  },
  input: {
    width: "70%",
  },
  priceContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "5%",
    flex: 1,
  },
  chargerExplorer: {
    marginTop: "3%",
  },
  chargerContainer: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "5%",
    borderRadius: 10,
    marginBottom: "5%",
    justifyContent: "space-between",
  },
});
