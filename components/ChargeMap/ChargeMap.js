import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button } from "@rneui/themed";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

export default function ChargeMap({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const [status, requestPermission] = Location.useForegroundPermissions();
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState([null, null]);
  const API_KEY = "AIzaSyDF8ECR3O5QiEaTRLms1fmu5HRW_K_G_xM";

  // Get initial location and zooms to that region
  useEffect(() => {
    const getLocation = async () => {
      await requestPermission();
      await Location.enableNetworkProviderAsync();
      const position = await Location.getCurrentPositionAsync();
      setOrigin([position.coords.latitude, position.coords.longitude]);
      Location.watchPositionAsync({}, (position) => updateLocation(position));
    };
    getLocation();
  }, []);

  // Updates map zoom and position according to curr location
  const updateLocation = (position) => {
    // Animate without camera rotation
    const region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: position.coords.speed * 0.0009 + 0.002,
      longitudeDelta: ASPECT_RATIO * (position.coords.speed * 0.0009 + 0.002),
    };
    // Animate with camera rotation
    const camera = {
      center: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      heading: position.coords.heading,
      zoom: -position.coords.speed * 0.1 + 18,
    };
    mapRef.current.animateCamera(camera, {});
  };

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
        {origin[0] != null ? (
          <MapViewDirections
            origin={{ latitude: origin[0], longitude: origin[1] }}
            destination={{ latitude: 37.79441, longitude: -122.43424 }}
            apikey="{API_KEY}"
            strokeWidth={10}
            strokeColor="#1BB530"
            onReady={(result) => {
              console.log("Distance: " + result.distance + " km");
              console.log("Duration: " + result.duration + " min.");

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
        ) : null}
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
