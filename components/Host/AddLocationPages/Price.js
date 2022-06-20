import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
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
              matchingDocs.push(doc.data().costPerCharge);
            }
          }
        }
        return matchingDocs;
      })
      .then((locations) => {
        // Process the matching documents
        setPriceChargersNear(
          (
            locations.reduce((total, num) => (total += parseInt(num)), 0) /
            locations.length
          ).toFixed(2)
        );
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
    <DismissKeyboardView style={styles.container}>
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
        <View style={styles.text}>
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
                  ${(cost * 40).toFixed(2)} - $
                  {(cost * 100).toFixed(2)}
                </Text>{" "}
                (40kwh - 100kwh)
              </Text>
            </>
          ) : (
            <Text h4 h4Style={{ marginBottom: "5%" }}>
              Sorry! We are only able to provide electricity cost data to locations in United
              States
            </Text>
          )}
          <Text h4>
            Chargers near you are charging
            <Text h4 h4Style={{ fontFamily: "Inter-Bold" }}>
              {" "}
              ${priceChargersNear}
            </Text>
          </Text>
        </View>
      ) : (
        <Text>Loading Data...</Text>
      )}
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
    justifyContent: "center",
    flexDirection: "column",
    paddingLeft: "5%",
  },
});
