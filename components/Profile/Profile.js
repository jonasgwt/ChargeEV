import { React, useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { View, SafeAreaView, StyleSheet, ScrollView, Share } from "react-native";
import { authentication, firestore } from "../../firebase/firebase-config";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Button, Text } from "@rneui/themed";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState(null);

  const options = {
    message: 'Hey there!\n\nHave you heard of the newest EV app in town? \n\nChargeEV is an app enabling you to loan or rent Electric vehicle chargers.\nNever run out of juice again\n\nDownload it now!'
  }

  const onShare = async () => {
    try {
      const result = await Share.share(options);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
 

  const getUser = async () => {
    const docRef = doc(firestore, "users", authentication.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUser();
    });
    return unsubscribe;
  }, [navigation]);

  const SignOut = async () => {
    await AsyncStorage.clear();
    await signOut(authentication);
    navigation.navigate("Login");
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View
            style={{
              flexDirection: "row",
              marginTop: "5%",
              marginBottom: 15,
              marginLeft: -20,
            }}
          >
            <Avatar.Image
              source={{
                uri:
                  userData != null
                    ? userData.get("userImg")
                    : "https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/photos%2F1B2C5C85-6253-4C85-9355-BE0AEC1B9A921654325573980.png?alt=media&token=3a176203-5203-403f-b63e-d0aa37912875",
              }}
              size={80}
              imageStyle={{ borderRaduys: 15 }}
            />
            <View style={{ marginLeft: 20 }}>
              <Title
                style={[
                  styles.title,
                  {
                    marginTop: 15,
                    marginBottom: 5,
                  },
                ]}
              >
                {authentication.currentUser.displayName}
              </Title>
              <Caption style={styles.caption}>
                {authentication.currentUser.uid}
              </Caption>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="phone" color="#777777" size={30} />
            <Text style={{ color: "#777777", marginLeft: 20 }}>
              {userData != null ? userData.get("phone") : "Phone Number"}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" color="#777777" size={30} />
            <Text style={{ color: "#777777", marginLeft: 20 }}>
              {authentication.currentUser.email}
            </Text>
          </View>
        </View>

        <View style={styles.menuWrapper}>
          <TouchableRipple
            onPress={() => {
              getUser();
            }}
          >
            <View style={styles.menuItem}>
              <Icon name="refresh" color="#1BB530" size={25} />
              <Text style={styles.menuItemText}>Reload Profile</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => {
              navigation.navigate("EditProfile");
            }}
          >
            <View style={styles.menuItem}>
              <Icon name="account-edit" color="#1BB530" size={25} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="credit-card" color="#1BB530" size={25} />
              <Text style={styles.menuItemText}>Payment</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={onShare}>
            <View style={styles.menuItem}>
              <Icon name="share-outline" color="#1BB530" size={25} />
              <Text style={styles.menuItemText}>Tell Your Friends</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => {
              navigation.navigate("Support");
            }}
          >
            <View style={styles.menuItem}>
              <Icon name="account-check-outline" color="#1BB530" size={25} />
              <Text style={styles.menuItemText}>Support</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={SignOut}>
            <View style={styles.menuItem}>
              <Icon name="logout" color="#1BB530" size={25} />
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
          </TouchableRipple>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerShare: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    marginTop: 10,
    marginLeft: "0%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
    marginLeft: "0%",
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
