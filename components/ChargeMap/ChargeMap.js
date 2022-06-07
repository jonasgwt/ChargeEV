import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActionSheetIOS,
  Image,
  Animated,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
import { firestore } from "../../firebase/firebase-config";
import { Icon, Text } from "@rneui/themed";
import ChargeMapLocationBox from "../resources/ChargeMapLocationBox";
import RNPickerSelect from "react-native-picker-select";
import {
  collection,
  startAt,
  endAt,
  orderBy,
  query,
  getDocs,
  where,
  getDoc,
  doc,
} from "firebase/firestore";

export default function ChargeMap({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const [status, requestPermission] = Location.useForegroundPermissions();
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState([null, null]);
  const [locations, setLocations] = useState([]);
  const [originalLocations, setOriginalLocations] = useState([]);
  const [destination, setDestination] = useState([null, null]);
  const [searching, setSearching] = useState(true);
  const firstCharger = useRef(null);
  const [chargerIndex, setChargerIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [filterCharger, setFilterCharger] = useState("");
  const [sortOption, setSortOption] = useState("Nearest");
  const heightAnim = useRef(new Animated.Value(0)).current;
  const heightAnimInter = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["30%", "80%"],
  });

  // Get initial location and zooms to that region
  useEffect(() => {
    const getLocation = async () => {
      await requestPermission();
      await Location.enableNetworkProviderAsync();
      const position = await Location.getCurrentPositionAsync();
      setOrigin([position.coords.latitude, position.coords.longitude]);
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

  // Gets nearby chargers in a 50km radius
  const getChargers = async () => {
    if (origin[0] != null) {
      setSearching(true);
      const radiusInM = 50 * 1000;
      const bounds = geohashQueryBounds(origin, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = await getDocs(
          query(
            collection(firestore, "HostedLocations"),
            where("available", "==", true),
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
              const coords = doc.get("coords");
              const lat = coords.latitude;
              const lng = coords.longitude;
              const distanceInKm = distanceBetween([lat, lng], origin);
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                matchingDocs.push({
                  ...doc.data(),
                  distance: distanceInM,
                  rating: await getRatings(doc.data()),
                });
              }
            }
          }
          return matchingDocs;
        })
        .then((locations) => {
          // Process the matching documents
          locations.sort((a, b) => a.distance > b.distance);
          setLocations(locations);
          setOriginalLocations(locations);
          setSearching(false);
        });
    }
  };

  // Finds chargers when origin changes
  useEffect(() => {
    getChargers();
  }, [origin]);

  // Get ratings of host
  const getRatings = async (data) => {
    const hostRef = await getDoc(doc(firestore, "Host", data.hostedBy));
    return hostRef.data().rating;
  };

  // Sets the zoom
  useEffect(() => {
    if (origin[0] != null && locations.length != 0) {
      mapRef.current.fitToElements({
        animated: true,
        edgePadding: { top: 50, left: 50, right: 50, bottom: 100 },
      });
      firstCharger.current.showCallout();
    } else if (locations.length == 0)
      Location.watchPositionAsync({}, (position) => updateLocation(position));
  }, [locations]);

  // Select Filter
  const selectFilter = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Charger Type", "Clear Filters"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "light",
      },
      (index) => {
        if (index == 1)
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Cancel", "CCS2", "Type 2"],
              cancelButtonIndex: 0,
              userInterfaceStyle: "light",
            },
            (option) => {
              if (option == 1) {
                setLocations(
                  originalLocations.filter((x) => x.chargerType.includes("CCS2"))
                );
                setFilterCharger("CCS2");
              } else if (option == 2) {
                setLocations(
                  originalLocations.filter((x) => x.chargerType.includes("Type 2"))
                );
                setFilterCharger("Type 2");
              } else null;
            }
          );
        else if (index == 2) {
          setLocations(originalLocations);
          setFilterCharger("");
        }
      }
    );
  };

  // Select Sorting
  const selectSort = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Nearest", "Cheapest"],
        cancelButtonIndex: 0,
        userInterfaceStyle: "light",
      },
      (option) => {
        if (option == 1) {
          if (sortOption == "Nearest") return;
          else {
            setSortOption("Nearest");
            const locationsCopy = [...locations];
            locationsCopy.sort((a, b) => a.distance > b.distance);
            setLocations(locationsCopy);
          }
        } else {
          if (sortOption == "Cheapest") return;
          else {
            setSortOption("Cheapest");
            const locationsCopy = [...locations];
            locationsCopy.sort((x, y) => {
              if (x.costPerCharge != y.costPerCharge)
                return x.costPerCharge > y.costPerCharge;
              else return x.distance > y.distance;
            });
            setLocations(locationsCopy);
          }
        }
      }
    );
  };

  // Animate closing of bottom container
  const animateCloseBottomContainer = () => {
    Animated.timing(heightAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setExpanded(false);
  };

  // Animate expanding of bottom container
  const animateExpandBottomContainer = () => {
    Animated.timing(heightAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setExpanded(true);
  };

  // No chargers found view
  const NoChargersFound = () => {
    return (
      <View style={{ marginTop: "15%", width: "80%" }}>
        <Text h1 style={{ textAlign: "center" }}>
          Uh oh!
        </Text>
        <Text
          h3
          h3Style={{ fontSize: 17 }}
          style={{ textAlign: "center", color: "gray", marginTop: "2%" }}
        >
          There are no ChargeEV locations near you.
        </Text>
      </View>
    );
  };

  // Loading Screen
  const LoadingView = () => {
    return (
      <View>
        <Image
          source={require("../../assets/logo_nobg_black.png")}
          style={styles.loadingImage}
        />
      </View>
    );
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
        onPress={animateCloseBottomContainer}
      >
        {/* Navigation */}
        {destination[0] != null ? (
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

        {/* Current Location */}
        {origin[0] != null ? (
          <Marker
            coordinate={{ latitude: origin[0], longitude: origin[1] }}
            opacity={0}
          />
        ) : null}

        {/* Charger Location Markers */}
        {locations.map((loc, index) => (
          <Marker
            key={index}
            ref={index == 0 ? firstCharger : null}
            coordinate={{
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            }}
            title={loc.address}
            description={loc.chargerType.join()}
            onPress={() => setChargerIndex(index)}
          />
        ))}
      </MapView>

      {/* Bottom Container */}
      <Animated.ScrollView
        style={[styles.bottomBox, { height: heightAnimInter }]}
        contentContainerStyle={styles.bottomBoxContent}
        onScrollBeginDrag={() => animateExpandBottomContainer()}
        onScroll={(e) => {
          if (e.nativeEvent.contentOffset.y < -100)
            animateCloseBottomContainer();
        }}
      >
        <Text h4 h4Style={styles.textGreyed} style={{ marginBottom: "5%" }}>
          {searching
            ? "Loading..."
            : "There are " + locations.length + " chargers near you."}
        </Text>

        {/* Sorting Container */}
        {!searching && expanded && locations.length != 0 ? (
          <View style={styles.sortingContainer}>
            <TouchableOpacity
              style={[styles.filterButton, { width: "50%" }]}
              onPress={selectSort}
            >
              <Icon name="sort" color="white" />
              <Text style={{ color: "white" }}>Sorted by {sortOption}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Filter Container */}
        {!searching && locations.length != 0 ? (
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={selectFilter}
            >
              <Icon name="filter-list" color="white" />
              <Text style={{ color: "white" }}>Filter by</Text>
            </TouchableOpacity>
            {filterCharger != "" ? (
              <View style={styles.filteredIcon}>
                <Image
                  source={
                    filterCharger == "CCS2"
                      ? require("../../assets/chargers/CCS.png")
                      : require("../../assets/chargers/type2.png")
                  }
                  style={styles.filteredImage}
                />
                <Text>{filterCharger}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Content */}
        {!searching ? (
          locations.length != 0 ? (
            expanded ? (
              locations.map((location, index) => (
                <ChargeMapLocationBox key={index} location={location} />
              ))
            ) : (
              <ChargeMapLocationBox location={locations[chargerIndex]} />
            )
          ) : (
            <NoChargersFound />
          )
        ) : (
          <LoadingView />
        )}
      </Animated.ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" />
      </TouchableOpacity>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={getChargers}>
        <Icon name="refresh" />
      </TouchableOpacity>
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
  bottomBox: {
    position: "absolute",
    bottom: "2%",
    backgroundColor: "white",
    width: "95%",
    height: "30%",
    borderRadius: 20,
    padding: "2%",
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 0.2
  },
  bottomBoxContent: {
    alignItems: "center",
    justifyContent: "center",
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
    right: "5%",
    borderRadius: "100%",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
    display: "flex",
    justifyContent: "center",
  },
  textGreyed: {
    fontFamily: "Inter-Light",
    fontSize: 12,
    color: "gray",
  },
  loadingImage: {
    width: 313.6,
    height: 100,
    marginTop: "10%",
  },
  filterButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    padding: "1%",
    borderRadius: 10,
    width: "30%",
  },
  filterContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
  },
  filteredIcon: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "20%",
    padding: "1%",
    borderRadius: 10,
    marginLeft: "5%",
    width: "25%",
  },
  filteredImage: {
    width: 20,
    height: 20,
  },
  sortingContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "2%",
  },
});
