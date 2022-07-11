import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActionSheetIOS,
  Image,
  Animated,
  Alert,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
import {
  authentication,
  firestore,
  googleMapsAPIKey,
} from "../../firebase/firebase-config";
import { Divider, Icon, Text } from "@rneui/themed";
import ChargeMapLocationBox from "../resources/ChargeMapLocationBox";
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
  setDoc,
  addDoc,
  Timestamp,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  GeoPoint,
} from "firebase/firestore";
import sendNotification from "../resources/sendNotifications";
import { GeofencingEventType } from "expo-location";
import * as TaskManager from "expo-task-manager";
import AnimatedLottieView from "lottie-react-native";

export default function ChargeMap({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = height / width;
  const [statusBackground, requestBackgroundPermission] =
    Location.useBackgroundPermissions();
  const [statusForeground, requestForegroundPermission] =
    Location.useForegroundPermissions();
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
  const [locationSelected, setLocationSelected] = useState(false);
  const [locationBooked, setLocationBooked] = useState(false);
  const [userNearLocation, setUserNearLocation] = useState(false);
  const [hostNotiToken, setHostNotiToken] = useState("");
  const [userNotiToken, setUserNotiToken] = useState("");
  const [bookingID, setBookingID] = useState("");
  const [bgLocation, setBgLocation] = useState(false);
  const [currLocationInFirestore, setCurrLocationInFirestore] = useState([]);
  const [hostMobileNumber, setHostMobileNumber] = useState("");
  const heightAnim = useRef(new Animated.Value(0)).current;
  const heightAnimInter = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [ASPECT_RATIO > 2 ? "30%" : "35%", "80%"],
  });

  // Geofence Tasks
  TaskManager.defineTask(
    "GEOFENCE_BOOKED_LOCATION",
    async ({ data: { eventType, region }, error }) => {
      if (error) {
        console.log(error.message);
        return;
      }
      if (eventType === GeofencingEventType.Enter) await userReached();
      else if (eventType === GeofencingEventType.Exit) await userLeft();
    }
  );

  TaskManager.defineTask(
    "GET_BG_LOCATION",
    async ({ data: { locations }, error }) => {
      if (error) {
        console.log(error);
        return;
      }
      const location = locations[0];

      if (
        currLocationInFirestore[0] != location.coords.latitude ||
        currLocationInFirestore[1] != location.coords.longitude
      ) {
        console.log("update");
        await updateDoc(doc(firestore, "Bookings", bookingID), {
          currentUserLocation: new GeoPoint(
            location.coords.latitude,
            location.coords.longitude
          ),
        });
        await updateDoc(doc(firestore, "BookingAlerts", bookingID), {
          bgLocation: true,
        });
        setCurrLocationInFirestore([
          location.coords.latitude,
          location.coords.longitude,
        ]);
      }
    }
  );

  // Get initial location and checks if user is currently in an active booking
  // else search for chargers
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setSearching(true);
      setSortOption("Nearest");
      setFilterCharger("");
      getUserNotiToken()
        .then(async () => await getLocation())
        .then(async (currLocation) => await checkIfInBooking(currLocation))
        .then(async (x) => (x[0] != "" ? await setBookedLocation(x) : null))
        .then(() =>
          Location.watchPositionAsync({ distanceInterval: 500 }, (location) => {
            setOrigin([
              location.coords.latitude,
              location.coords.longitude,
              location.coords.heading,
              location.coords.speed,
            ]);
          })
        )
        .then(() => setSearching(false));
    });
    return unsubscribe;
  }, [navigation]);

  // If user is in a booking get and add booking info
  const setBookedLocation = async (params) => {
    const bookingDoc = await getDoc(doc(firestore, "Bookings", params[0]));
    setBookingID(params[0]);
    const locationRef = doc(
      firestore,
      "HostedLocations",
      bookingDoc.data().location
    );
    const locationDoc = await getDoc(locationRef);
    const hostData = await getDPHost(locationDoc.data());
    const distanceInKm = distanceBetween(
      [locationDoc.data().coords.latitude, locationDoc.data().coords.longitude],
      params[1].slice(0, 2)
    );
    const distanceInM = distanceInKm * 1000;
    setLocations([
      {
        ...locationDoc.data(),
        distance: distanceInM,
        rating: await getRatings(locationDoc.data()),
        hostDP: hostData[1],
        hostName: hostData[0],
        type: "ChargeEV",
      },
    ]);
    if (bookingDoc.data().userReached) {
      setUserNearLocation(true);
      setDestination([null, null]);
    } else {
      setDestination([
        locationDoc.data().coords.latitude,
        locationDoc.data().coords.longitude,
      ]);
      setOrigin(params[1]);
    }
    setLocationBooked(true);
  };

  // Gets user notification token
  const getUserNotiToken = async () => {
    const userDoc = await getDoc(
      doc(firestore, "users", authentication.currentUser.uid)
    );
    setUserNotiToken(userDoc.data().notificationToken);
  };

  // Asks and gets user current location
  const getLocation = async () => {
    await requestForegroundPermission()
      .then((status) => {
        if (!status.granted) {
          Alert.alert(
            "Enable Background Locations",
            "Open Settings > ChargeEV > Location > Always",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
      })
    Location.getBackgroundPermissionsAsync()
      .then(async (res) => {
        if (!res.granted)
          await requestBackgroundPermission().then((status) => {
            if (!status.granted) {
              Alert.alert(
                "Enable Background Locations",
                "Open Settings > ChargeEV > Location > Always",
                [
                  {
                    text: "Open Settings",
                    onPress: () => Linking.openSettings(),
                  },
                ]
              );
            }
          });
        else setBgLocation(true);
      })
      .catch((err) => {
        if (err.code == "ERR_LOCATION_INFO_PLIST") {
          console.log("unable to activate bg tracking");
        }
      });
    await Location.enableNetworkProviderAsync()
    const position = await Location.getLastKnownPositionAsync().catch((err) =>
      Alert.alert(
        "There is an error getting your location",
        "Please restart the app and try again"
      )
    )
    return [
      position.coords.latitude,
      position.coords.longitude,
      position.coords.heading,
      position.coords.speed,
    ];
  };

  // Upon render checks if user is in a current booking
  const checkIfInBooking = async (currLocation) => {
    const userDoc = await getDoc(
      doc(firestore, "users", authentication.currentUser.uid)
    );
    if (userDoc.data().activeBooking == undefined) return ["", currLocation];
    return [userDoc.data().activeBooking, currLocation];
  };

  // Tracks user location when location is booked
  useEffect(() => {
    if (locationBooked) {
      // For background tracking
      Location.startGeofencingAsync("GEOFENCE_BOOKED_LOCATION", [
        {
          latitude: locations[0].coords.latitude,
          longitude: locations[0].coords.longitude,
          radius: 500,
        },
      ])
        .then(() => {
          Location.startLocationUpdatesAsync("GET_BG_LOCATION", {
            deferredUpdatesDistance: 5000,
            deferredUpdatesInterval: 5000,
            pausesUpdatesAutomatically: true,
          });
        })
        .catch((err) => {
          if (err) {
            // For foreground tracking
            Location.watchPositionAsync(
              { distanceInterval: 500 },
              async (position) => {
                if (destination[0] != null)
                  setOrigin([
                    position.coords.latitude,
                    position.coords.longitude,
                    position.coords.heading,
                    position.coords.speed,
                  ]);
                await updateDoc(doc(firestore, "BookingAlerts", bookingID), {
                  bgLocation: false,
                });
                await updateDoc(doc(firestore, "Bookings", bookingID), {
                  currentUserLocation: new GeoPoint(
                    position.coords.latitude,
                    position.coords.longitude
                  ),
                });
                if (
                  distanceBetween(
                    [position.coords.latitude, position.coords.longitude],
                    [
                      locations[0].coords.latitude,
                      locations[0].coords.longitude,
                    ]
                  ) *
                    1000 <
                  100
                ) {
                  await userReached();
                } else {
                  if (userNearLocation) await userLeft();
                }
              }
            );
          }
        });
    }
  }, [locationBooked]);

  // Gets nearby ChargeEV chargers in a 50km radius
  const getChargeEVChargers = async (currLocation) => {
    setSearching(true);
    if (currLocation[0] != null) {
      const radiusInM = 50 * 1000;
      const bounds = geohashQueryBounds(currLocation.slice(0, 2), radiusInM);
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
      return Promise.all(promises)
        .then(async (snapshots) => {
          const matchingDocs = [];
          for (const snap of snapshots) {
            for (const doc of snap.docs) {
              const coords = doc.get("coords");
              const lat = coords.latitude;
              const lng = coords.longitude;
              const distanceInKm = distanceBetween(
                [lat, lng],
                currLocation.slice(0, 2)
              );
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                const hostData = await getDPHost(doc.data());
                matchingDocs.push({
                  ...doc.data(),
                  distance: distanceInM,
                  rating: await getRatings(doc.data()),
                  hostDP: hostData[1],
                  hostName: hostData[0],
                  type: "ChargeEV",
                });
              }
            }
          }
          return matchingDocs;
        })
        .then((locations) => {
          return locations;
        });
    }
  };

  // Gets public chargers in a 50km radius
  const getPublicChargers = async (currLocation) => {
    return await fetch(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=ev%20charger&location=" +
        currLocation[0] +
        "," +
        currLocation[1] +
        "&radius=50000&key=AIzaSyDF8ECR3O5QiEaTRLms1fmu5HRW_K_G_xM"
    )
      .then((response) => response.json())
      .then((data) => {
        const allLoc = data.results.filter(
          (x) =>
            x.business_status == "OPERATIONAL" &&
            x.opening_hours != undefined &&
            x.opening_hours.open_now
        );
        const res = allLoc.map((x) => {
          return {
            ...x,
            distance:
              distanceBetween(
                [x.geometry.location.lat, x.geometry.location.lng],
                currLocation.slice(0, 2)
              ) * 1000,
            type: "Public",
            coords: {
              latitude: x.geometry.location.lat,
              longitude: x.geometry.location.lng,
            },
          };
        });
        return res;
      });
  };

  // Get public and ChargeEV chargers in a 50km radius
  const getChargers = async (currLocation) => {
    const loc = [];
    setSortOption("Nearest");
    setFilterCharger("");
    loc.push(...(await getChargeEVChargers(currLocation)));
    loc.push(...(await getPublicChargers(currLocation)));
    loc.sort((a, b) => a.distance > b.distance);
    setOriginalLocations(loc);
    setLocations(loc);
    setSearching(false);
  };

  // when user reached location
  const userReached = async () => {
    if (!userNearLocation) {
      Alert.alert(
        "You have reached charger location",
        "You are not allowed to cancel the booking from now"
      );
      setUserNearLocation(true);
      setDestination([null, null]);
      // update user status
      const bookingRef = doc(firestore, "Bookings", bookingID);
      await updateDoc(bookingRef, {
        userReached: true,
      });
      // update booking alerts
      const bookingAlertRef = doc(firestore, "BookingAlerts", bookingID);
      await updateDoc(bookingAlertRef, {
        stage: "arrived",
        action: false,
        priority: 0,
        timestamp: serverTimestamp(),
      });
      await sendNotification(
        userNotiToken,
        "You have reached the charging station",
        "You are not allowed to cancel the booking from now"
      );
      await sendNotification(
        hostNotiToken,
        authentication.currentUser.displayName + " has reached ",
        ""
      );
    }
  };

  // when user leave location
  const userLeft = async () => {
    if (userNearLocation) {
      Alert.alert(
        "Thank you for using ChargeEV",
        "We have detected that you have left the charging location, please make your payment and verify with us.",
        [
          {
            text: "Proceed to Payment",
            onPress: async () => await proceedToPayment(),
          },
        ]
      );
      await sendNotification(
        userNotiToken,
        "Please confirm your payment",
        "We have detected that you have left the charging location, please make your payment and verify with us."
      );
    }
  };

  // Get ratings of host
  const getRatings = async (data) => {
    const hostRef = await getDoc(doc(firestore, "Host", data.hostedBy));
    return hostRef.data().rating;
  };

  // Get profile picture of host and name
  const getDPHost = async (data) => {
    const hostRef = await getDoc(doc(firestore, "Host", data.hostedBy));
    const userRef = await getDoc(
      doc(firestore, "users", hostRef.data().userID)
    );
    return [
      userRef.data().fname + " " + userRef.data().lname,
      userRef.data().userImg,
    ];
  };

  // Sets the zoom
  useEffect(() => {
    if (origin[0] != null && locations.length != 0) {
      fitElements();
      if (firstCharger != null) firstCharger.current.showCallout();
      setChargerIndex(0);
    } else if (origin[0] != null && locations.length == 0) {
      updateLocation();
    }
  }, [locations, origin]);

  useEffect(() => {
    if (!locationSelected && !locationBooked && !searching) getChargers(origin);
  }, [origin]);

  // Adjusts zoom when there are no charger location
  const updateLocation = () => {
    // Animate with camera rotation
    const camera = {
      center: {
        latitude: origin[0],
        longitude: origin[1],
      },
      heading: origin[2],
      zoom: -origin[3] * 0.1 + 18,
    };
    if (mapRef != null) mapRef.current.animateCamera(camera, { duration: 500 });
  };

  // Fits elements in map to viewport
  const fitElements = () => {
    mapRef.current.fitToElements({
      animated: true,
      edgePadding: {
        top: ASPECT_RATIO > 2 ? 250 : 200,
        left: 70,
        right: 70,
        bottom: ASPECT_RATIO > 2 ? 400 : 300,
      },
    });
  };

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
        setSearching(true);
        setChargerIndex(0);
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
                  originalLocations
                    .filter(
                      (x) =>
                        x.chargerType != null && x.chargerType.includes("CCS2")
                    )
                    .sort(
                      sortOption == "Nearest"
                        ? (a, b) => a.distance > b.distance
                        : (x, y) => {
                            if (x.costPerCharge != y.costPerCharge)
                              return x.costPerCharge > y.costPerCharge;
                            else return x.distance > y.distance;
                          }
                    )
                );
                setFilterCharger("CCS2");
              } else if (option == 2) {
                setLocations(
                  originalLocations
                    .filter(
                      (x) =>
                        x.chargerType != null &&
                        x.chargerType.includes("Type 2")
                    )
                    .sort(
                      sortOption == "Nearest"
                        ? (a, b) => a.distance > b.distance
                        : (x, y) => {
                            if (x.costPerCharge != y.costPerCharge)
                              return x.costPerCharge > y.costPerCharge;
                            else return x.distance > y.distance;
                          }
                    )
                );
                setFilterCharger("Type 2");
              } else null;
            }
          );
        else if (index == 2) {
          if (sortOption == "Cheapest") sortCheapest(originalLocations);
          else setLocations(originalLocations);
          setFilterCharger("");
        }
        setSearching(false);
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
        setSearching(true);
        if (option == 1) {
          if (sortOption == "Nearest") return;
          sortNearest(locations);
          setSortOption("Nearest");
        } else if (option == 2) {
          if (sortOption == "Cheapest") return;
          sortCheapest(locations);
          setSortOption("Cheapest");
        }
        setSearching(false);
      }
    );
  };

  // Sort given locations by nearest
  const sortNearest = () => {
    const locationsCopy = [...locations];
    locationsCopy.sort((a, b) => a.distance > b.distance);
    setLocations(locationsCopy);
  };

  // sort given locations by cheapest
  const sortCheapest = (locs) => {
    const locationsCopy = [...locs];
    locationsCopy.sort((x, y) => {
      if (x.costPerCharge == undefined && y.costPerCharge != undefined)
        return true;
      else if (x.costPerCharge != undefined && y.costPerCharge == undefined)
        return false;
      else if (x.costPerCharge != y.costPerCharge)
        return x.costPerCharge > y.costPerCharge;
      else return x.distance > y.distance;
    });
    setLocations(locationsCopy);
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

  // User selected a location
  const selectLocation = (index) => {
    setDestination([
      locations[index].coords.latitude,
      locations[index].coords.longitude,
    ]);
    setLocations([locations[index]]);
    setChargerIndex(0);
    setLocationSelected(true);
  };

  // User goes back from a selected location
  const otherLocations = () => {
    setLocations(originalLocations);
    setFilterCharger("");
    setSortOption("Nearest");
    setDestination([null, null]);
    setLocationSelected(false);
  };

  // User Booked the location
  const bookLocation = (location) => {
    if (location.type == "ChargeEV")
      Alert.alert(
        "Book Location?",
        "Host will be informed. \n Cancellation is not allowed when you are near the location.",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Book",
            onPress: async () => {
              setSearching(true);
              // Checks if user is booking his own location
              const userRef = doc(
                firestore,
                "users",
                authentication.currentUser.uid
              );
              const userDoc = await getDoc(userRef);
              if (userDoc.data().hostID == location.hostedBy) {
                Alert.alert(
                  "Booking Error",
                  "You cannot book a location that you are hosting."
                );
                setSearching(false);
                return;
              }
              // Add booking doc
              const bookingRef = await addDoc(
                collection(firestore, "Bookings"),
                {
                  user: authentication.currentUser.uid,
                  host: location.hostedBy,
                  location: location.placeID,
                  active: true,
                  userPaid: false,
                  hostVerified: false,
                  userReached: false,
                  time: serverTimestamp(),
                }
              );
              // Add booking in user
              setBookingID(bookingRef.id);
              await updateDoc(userRef, {
                activeBooking: bookingRef.id,
                bookings: arrayUnion(bookingRef.id),
              });
              // add booking in host
              const hostRef = doc(firestore, "Host", location.hostedBy);
              const hostDoc = await getDoc(hostRef);
              const hostUserDoc = await getDoc(
                doc(firestore, "users", hostDoc.data().userID)
              );
              // get host noti token
              const notiToken = hostUserDoc.data().notificationToken;
              setHostNotiToken(notiToken);
              setHostMobileNumber(hostUserDoc.data().phone);
              await updateDoc(hostRef, {
                bookings: arrayUnion(bookingRef.id),
              });
              // update bookings in location
              const locationRef = doc(
                firestore,
                "HostedLocations",
                location.placeID
              );
              await updateDoc(locationRef, {
                bookings: arrayUnion(bookingRef.id),
                available: false,
              });
              // add alerts
              await setDoc(doc(firestore, "BookingAlerts", bookingRef.id), {
                stage: "booked",
                host: location.hostedBy,
                user: authentication.currentUser.uid,
                priority: 1,
                actionRequired: false,
                action: true,
                bgLocation: bgLocation,
                timestamp: serverTimestamp(),
                showUser: true,
                showHost: true,
              });
              // send notification to host
              const locationDoc = await getDoc(locationRef);
              await sendNotification(
                notiToken,
                "Your Location has been booked",
                authentication.currentUser.displayName +
                  " is " +
                  Math.round(locations[0].travelTime) +
                  " min away from " +
                  locationDoc.data().address
              );
              setCurrLocationInFirestore([]);
              setLocationBooked(true);
              setSearching(false);
            },
          },
        ]
      );
    else {
      Alert.alert(
        "Public Location",
        "You have booked a public charger location. ChargeEV will not record this booking. You will be redirected to Maps",
        [
          {
            text: "Take me there",
            onPress: () => openLocation(location),
          },
        ]
      );
      otherLocations();
    }
  };

  // User done with charging and wants to pay
  const proceedToPayment = async () => {
    setSearching(true);
    if (bgLocation) {
      Location.stopLocationUpdatesAsync("GET_BG_LOCATION");
      Location.stopGeofencingAsync("GEOFENCE_BOOKED_LOCATION");
    }
    navigation.navigate("Payment", { hostNotiToken: hostNotiToken });
    setLocationBooked(false);
    setDestination([null, null]);
    setLocationSelected(false);
    setChargerIndex(0);
    setFilterCharger("");
    setSortOption("Nearest");
    setBookingID("");
    setUserNearLocation(false);
    setCurrLocationInFirestore([]);
    await getChargers(origin);
    setSearching(false);
  };

  // User cancelled current booking
  const cancelBooking = () => {
    Alert.alert(
      "Cancel Booking?",
      "Are you sure you want to cancel your booking?",
      [
        {
          text: "Don't Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Cancel Booking",
          onPress: async () => {
            setSearching(true);
            // update user
            const userRef = doc(
              firestore,
              "users",
              authentication.currentUser.uid
            );
            await updateDoc(userRef, {
              activeBooking: "",
              bookings: arrayRemove(bookingID),
            });
            // get info
            const bookingRef = doc(firestore, "Bookings", bookingID);
            const bookingDoc = await getDoc(bookingRef);
            const hostRef = doc(firestore, "Host", bookingDoc.data().host);
            // update host
            await updateDoc(hostRef, {
              bookings: arrayRemove(bookingID),
            });
            // update locations
            const locationRef = doc(
              firestore,
              "HostedLocations",
              bookingDoc.data().location
            );
            await updateDoc(locationRef, {
              bookings: arrayRemove(bookingID),
              available: true,
            });
            // update alerts
            await updateDoc(doc(firestore, "BookingAlerts", bookingID), {
              stage: "cancelled",
              priority: 0,
              action: false,
              actionRequired: false,
              timestamp: serverTimestamp(),
            });
            // send notification
            await sendNotification(
              hostNotiToken,
              "User has cancelled their booking",
              "Sorry! " +
                authentication.currentUser.displayName +
                " has cancelled their booking"
            );
            // delete booking and reset
            await deleteDoc(bookingRef);
            setSearching(false);
            if (bgLocation) {
              Location.stopLocationUpdatesAsync("GET_BG_LOCATION");
              Location.stopGeofencingAsync("GEOFENCE_BOOKED_LOCATION");
            }
            setLocationBooked(false);
            setDestination([null, null]);
            setLocationSelected(false);
            setChargerIndex(0);
            setFilterCharger("");
            setSortOption("Nearest");
            setBookingID("");
            setCurrLocationInFirestore([]);
            await getChargers(origin);
          },
        },
      ]
    );
  };

  // Call user
  const callUser = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Call " + hostMobileNumber],
        cancelButtonIndex: 0,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          Linking.openURL("tel:" + hostMobileNumber);
        }
      }
    );
  };

  // Below are all components to be rendered
  // seperated for readability

  // Open Location in phone native maps
  const openLocation = (location) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${location.coords.latitude},${location.coords.longitude}`;
    const label =
      location.type == "ChargeEV" ? location.address : location.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  // No chargers found view
  const NoChargersFound = () => {
    return (
      <View style={{ marginTop: "12.5%", width: "80%" }}>
        <Text h1 style={{ textAlign: "center" }}>
          Uh oh!
        </Text>
        <Text
          h3
          h3Style={{ fontSize: 17 }}
          style={{ textAlign: "center", color: "gray", marginTop: "2%" }}
        >
          There are no charger locations near you.
        </Text>
      </View>
    );
  };

  // Loading Screen
  const LoadingView = () => {
    return (
      <View>
        <AnimatedLottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
            marginTop: "-5%",
          }}
          source={require("../../assets/animations/searching.json")}
        />
        <Text
          h5
          style={{ maxWidth: 200, textAlign: "center", marginTop: "-20%" }}
        >
          Loading...
        </Text>
      </View>
    );
  };

  // Items displayed when user books a location
  const BookedLocationView = () => {
    return (
      <View style={styles.locationSelectedContainer}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text h2 h2Style={{ fontFamily: "Inter-Bold" }}>
            {locations[0].address + " " + locations[0].unitNumber}
          </Text>
          <Text h4>{locations[0].postalCode}</Text>
        </View>
        <View style={styles.bookedIcon}>
          <Icon name="check" color="#1BB530" />
          <Text style={{ color: "#1BB530" }}>Booked</Text>
        </View>
        <View
          style={{
            backgroundColor: "black",
            width: 300,
            height: "0.3%",
            marginTop: "2%",
            marginBottom: "2%",
          }}
        />
        {/* Reviews */}
        <View style={styles.reviewsContainer}>
          <Image
            source={{ url: "locations[0].hostDP" }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderWidth: 1,
            }}
          />
          <View style={{ marginLeft: "2%" }}>
            <Text h4 h4Style={{ fontFamily: "Inter-Regular" }}>
              {locations[0].hostName}
            </Text>
            <TouchableOpacity style={styles.bookedIcon} onPress={callUser}>
              <Icon name="phone-in-talk" color="#1BB530" />
              <Text style={{ color: "#1BB530" }}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* More Info that will be showed when user expands bottom container */}
        {expanded ? (
          <View style={styles.extraInfoParentContainer}>
            {/* Charger Type */}
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginBottom: "2%",
                  fontSize: 17,
                }}
              >
                Charger Type
              </Text>
              {locations[0].chargerType.map((charger, index) => (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "1%",
                  }}
                >
                  <Image
                    source={
                      charger == "CCS2"
                        ? require("../../assets/chargers/CCS.png")
                        : require("../../assets/chargers/type2.png")
                    }
                    style={{ width: 20, height: 20 }}
                  />
                  <Text>{charger}</Text>
                </View>
              ))}
            </View>
            {/* Housing Type */}
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginBottom: "2%",
                  fontSize: 17,
                }}
              >
                Housing Type
              </Text>
              <Text>{locations[0].housingType}</Text>
            </View>
            {/* Price */}
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginBottom: "2%",
                  fontSize: 17,
                }}
              >
                Amount Payable
              </Text>
              <Text>${locations[0].costPerCharge}</Text>
            </View>
            {/* Payment Method */}
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginBottom: "2%",
                  fontSize: 17,
                }}
              >
                Payment Method(s)
              </Text>
              <Text>{locations[0].paymentMethod.join()}</Text>
            </View>
          </View>
        ) : null}

        {!userNearLocation ? (
          <TouchableOpacity
            style={[
              styles.bookButton,
              { padding: "1%", borderRadius: 5, width: "45%" },
            ]}
            onPress={() => openLocation(locations[0])}
          >
            <Icon name="place" color="white" />
            <Text style={{ color: "white" }}>Open in Maps</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.bookButton,
              { padding: "1%", borderRadius: 5, width: "45%" },
            ]}
            onPress={proceedToPayment}
          >
            <Icon name="electrical-services" color="white" />
            <Text style={{ color: "white" }}>I'm Charged Up!</Text>
          </TouchableOpacity>
        )}

        {expanded && !userNearLocation ? (
          <TouchableOpacity
            style={[
              styles.bookButton,
              {
                padding: "1%",
                backgroundColor: "#ff4a4a",
                borderRadius: 5,
                width: "45%",
              },
            ]}
            onPress={cancelBooking}
          >
            <Icon name="cancel" color="white" />
            <Text style={{ color: "white" }}>Cancel Booking</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  // View when user selected a location
  const SelectedLocation = () => {
    return (
      <View style={styles.locationSelectedContainer}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text h2 h2Style={{ fontFamily: "Inter-Bold" }}>
            {locations[0].type == "ChargeEV"
              ? locations[0].address + " " + locations[0].unitNumber
              : locations[0].name}
          </Text>
          <Text h4 style={{ textAlign: "center" }}>
            {locations[0].type == "ChargeEV"
              ? locations[0].postalCode
              : locations[0].vicinity}
          </Text>
          <Text h4>
            {Math.round(locations[0].distance * 10) / 10} km ,{" "}
            {Math.round(locations[0].travelTime)} min
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "black",
            width: 300,
            height: "0.3%",
            marginTop: "2%",
            marginBottom: "2%",
          }}
        />
        {/* Reviews */}
        <View style={styles.reviewsContainer}>
          <Image
            source={{
              url:
                locations[0].type == "ChargeEV"
                  ? "locations[0].hostDP"
                  : "https://cdn.icon-icons.com/icons2/836/PNG/512/Google_icon-icons.com_66793.png",
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
            }}
          />
          <View style={{ marginLeft: "2%" }}>
            <Text h5>
              {locations[0].type == "ChargeEV"
                ? locations[0].hostName
                : "Data from Google"}
            </Text>
            <Text h5>
              {locations[0].rating != 0
                ? Math.round(locations[0].rating * 10) / 10 + "⭐"
                : "No Reviews"}
            </Text>
          </View>
        </View>

        {/* More Info that will be showed when user expands bottom container */}
        {expanded && locations[0].type == "ChargeEV" ? (
          <View style={styles.extraInfoParentContainer}>
            {/* Charger Type */}
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginBottom: "2%",
                  fontSize: 17,
                }}
              >
                Charger Type
              </Text>
              {locations[0].chargerType.map((charger, index) => (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "1%",
                  }}
                >
                  <Image
                    source={
                      charger == "CCS2"
                        ? require("../../assets/chargers/CCS.png")
                        : require("../../assets/chargers/type2.png")
                    }
                    style={{ width: 20, height: 20 }}
                  />
                  <Text>{charger}</Text>
                </View>
              ))}
            </View>
            {/* Housing Type */}
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginBottom: "2%",
                  fontSize: 17,
                }}
              >
                Housing Type
              </Text>
              <Text>{locations[0].housingType}</Text>
            </View>
            {/* Price */}
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginBottom: "2%",
                  fontSize: 17,
                }}
              >
                Amount Payable
              </Text>
              <Text>${locations[0].costPerCharge}</Text>
            </View>
            {/* Payment Method */}
            <View style={styles.infoContainer}>
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  marginBottom: "2%",
                  fontSize: 17,
                }}
              >
                Payment Method(s)
              </Text>
              <Text>{locations[0].paymentMethod.join()}</Text>
            </View>
          </View>
        ) : null}

        {expanded && locations[0].type != "ChargeEV" ? (
          <View style={styles.extraInfoParentContainer}>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                marginBottom: "2%",
                fontSize: 17,
                textAlign: "center",
              }}
            >
              Public Location
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              This location is a public location. ChargeEV does not have any
              information of pricing, charger types provided and availability.
              Booking of this location will not be recorded.
            </Text>
          </View>
        ) : null}

        {/* Button Options */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: 300,
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "3%",
          }}
        >
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: "gray" }]}
            onPress={otherLocations}
          >
            <Icon name="arrow-back-ios" color="white" />
            <Text h2 h2Style={{ color: "white", fontSize: 18 }}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => bookLocation(locations[0])}
          >
            <Text h2 h2Style={{ color: "white", fontSize: 18 }}>
              Book
            </Text>
            <Icon name="arrow-forward-ios" color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Filter container
  const FilterView = () => {
    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={selectFilter}>
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
    );
  };

  // Sorting Container
  const SortingView = () => {
    return (
      <View style={styles.sortingContainer}>
        <TouchableOpacity
          style={[styles.filterButton, { width: "50%" }]}
          onPress={selectSort}
        >
          <Icon name="sort" color="white" />
          <Text style={{ color: "white" }}>Sorted by {sortOption}</Text>
        </TouchableOpacity>
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
            destination={{
              latitude: destination[0],
              longitude: destination[1],
            }}
            apikey={googleMapsAPIKey}
            strokeWidth={10}
            strokeColor="#1BB530"
            onStart={(x) => console.log("Starting routing")}
            onReady={(result) => {
              setLocations([
                {
                  ...locations[0],
                  distance: result.distance,
                  travelTime: result.duration,
                },
              ]);

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

        {/* Current Location Hidden Marker*/}
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
            title={loc.type == "ChargeEV" ? loc.address : loc.name}
            description={
              loc.type == "ChargeEV" ? loc.chargerType.join() : loc.vicinity
            }
            onPress={() => setChargerIndex(index)}
          >
            {loc.type == "ChargeEV" ? (
              <Image
                source={require("../../assets/marker/marker.png")}
                style={{ height: 40, width: 40 }}
              />
            ) : (
              <Image
                source={require("../../assets/marker/markerPublic.png")}
                style={{ height: 40, width: 40 }}
              />
            )}
          </Marker>
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
        {/* Display number of chargers near */}
        {!locationSelected && !locationBooked ? (
          <Text h4 h4Style={styles.textGreyed} style={{ marginBottom: "5%" }}>
            {searching
              ? "Loading..."
              : "There are " + locations.length + " chargers near you."}
          </Text>
        ) : null}

        {/* Sorting Container */}
        {!locationSelected &&
        !searching &&
        !locationBooked &&
        expanded &&
        locations.length != 0 ? (
          <SortingView />
        ) : null}

        {/* Filter Container */}
        {!locationSelected &&
        !locationBooked &&
        !searching &&
        locations.length != 0 ? (
          <FilterView />
        ) : null}

        {/* Content */}
        {!searching && !locationSelected && !locationBooked ? (
          locations.length != 0 ? (
            expanded ? (
              locations.map((location, index) => (
                <ChargeMapLocationBox
                  key={index}
                  location={location}
                  onPress={() => selectLocation(index)}
                />
              ))
            ) : (
              <ChargeMapLocationBox
                location={locations[chargerIndex]}
                onPress={() => selectLocation(chargerIndex)}
              />
            )
          ) : (
            <NoChargersFound />
          )
        ) : null}

        {/* Loading View */}
        {searching ? <LoadingView /> : null}

        {/* User selected a location */}
        {locationSelected && !searching && !locationBooked ? (
          <SelectedLocation />
        ) : null}

        {/* User booked a location */}
        {locationBooked && !searching ? <BookedLocationView /> : null}
      </Animated.ScrollView>

      {/* Refresh Button */}
      {!locationSelected && !locationBooked ? (
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => getChargers(origin)}
        >
          <Icon name="refresh" />
        </TouchableOpacity>
      ) : null}

      {/* Reframe Button */}
      <TouchableOpacity
        style={[styles.refreshButton, { right: "5%" }]}
        onPress={fitElements}
      >
        <Icon name="crop-free" />
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
    borderWidth: 0.2,
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
    borderRadius: 50,
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
    borderRadius: 50,
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
  locationSelectedContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2%",
  },
  reviewsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  bookButton: {
    backgroundColor: "#1BB530",
    padding: "3%",
    borderRadius: 20,
    marginTop: "5%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "40%",
  },
  extraInfoParentContainer: {
    width: 300,
    paddingBottom: "10%",
    marginTop: "5%",
  },
  infoContainer: {
    marginTop: "5%",
  },
  bookedIcon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1BB530",
    paddingLeft: "2%",
    paddingRight: "2%",
    marginTop: "1%",
  },
});
