import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Button } from "@rneui/themed";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";

export default function ChargeMap({ navigation }) {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const mapRef = useRef(null);

  // Get initial location and zooms to that region
  useEffect(() => {
    const getLocation = async () => {
      await requestPermission();
      await Location.enableNetworkProviderAsync();
      const position = await Location.getCurrentPositionAsync();
      const region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      mapRef.current.animateToRegion(region);
    };
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        showsUserLocation={true}
        followsUserLocation={true}
        showsTraffic={true}
        provider={PROVIDER_GOOGLE}
      >
        <Button
          style={styles.actionButton}
          title="Back"
          onPress={() => navigation.goBack()}
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
