import React from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { Text, Divider } from "@rneui/themed";

export default function ChargeMapLocationBox({ location, onPress }) {
  return (
    <TouchableOpacity style={styles.locationBox} onPress={onPress}>
      {/* Remove "" in image source when deploy */}
      {/* Rendering images burn through Firestore bandwidth */}
      <Image source={{ url: "location.locationImage" }} style={styles.image} />
      <View style={{ width: "50%" }}>
        <Text h4 h4Style={{ fontFamily: "Inter-Black", maxHeight: "40%"}}>
          {location.address}
        </Text>
        <Text h4 h4Style={{ fontSize: 10 }}>
          {location.distance > 1000
            ? Math.round(location.distance / 100) / 10 + " km"
            : Math.round(location.distance) + "m"}{" "}
          away
        </Text>
        <Divider
          style={{ marginTop: "2%", marginBottom: "2%" }}
          color="black"
        />
        <Text h3 h3Style={{ fontSize: 10 }} style={{marginBottom: "2%"}}>
          {location.rating != 0 ? Math.round(location.rating*10)/10 + "⭐" : "No Reviews"}
        </Text>
        <Text h3 h3Style={{ fontSize: 12 }}>
          {location.chargerType.join()} Charger
        </Text>
        <Text h3 h3Style={{ fontSize: 12 }}>
          ${location.costPerCharge} / charge
        </Text>
        {location.chargerType.length < 2 ? (
          <Image
            source={
              location.chargerType.includes("CCS2")
                ? require("../../assets/chargers/CCS.png")
                : require("../../assets/chargers/type2.png")
            }
            style={styles.charger}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  locationBox: {
    width: "90%",
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "2%",
    marginBottom: "5%",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  charger: {
    width: 20,
    height: 20,
    position: "absolute",
    right: "-10%",
    bottom: 0,
  },
});
