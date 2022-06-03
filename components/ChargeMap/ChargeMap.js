import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button } from "@rneui/themed";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

export default function ChargeMap({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const [status, requestPermission] = Location.useForegroundPermissions();
  const mapRef = useRef(null);
  const origin = {latitude: 37.3318456, longitude: -122.0296002};
  const destination = {latitude: 1.313813, longitude: 103.815938};

  // Get initial location and zooms to that region
  useEffect(() => {
    const getLocation = async () => {
      await requestPermission();
      await Location.enableNetworkProviderAsync();
      const position = await Location.getCurrentPositionAsync();
      origin.latitude = position.coords.latitude
      origin.longitude = position.coords.longitude
      console.log(origin)
      const region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      mapRef.current.animateToRegion(region);
    };
    getLocation();
    console.log("done")
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        showsUserLocation={true}
        followsUserLocation={true}
        showsPointsOfInterest={false}
        showsBuildings={false}
        provider={PROVIDER_GOOGLE}
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey="AIzaSyDF8ECR3O5QiEaTRLms1fmu5HRW_K_G_xM"
          strokeWidth={3}
          strokeColor="#1BB530"
          onReady={(result) => {
            console.log("Distance: "+result.distance+" km");
            console.log("Duration: "+result.duration+" min.");

            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: width / 20,
                bottom: height / 20,
                left: width / 20,
                top: height / 20,
              },
            });
          }}
          onError={(errorMessage) => {
            console.log(errorMessage);
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    zIndex: -1,
  },
  actionButton: {
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 1,
  },
});
