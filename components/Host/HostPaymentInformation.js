import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Text } from "@rneui/themed";
import { Divider } from "@rneui/themed";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { authentication, firestore } from "../../firebase/firebase-config";
import AnimatedLottieView from "lottie-react-native";

export default function HostPaymentInformation({ navigation }) {
  const [currPaymentMethods, setCurrPaymentMethods] = useState([]);
  const [addPaymentMethods, setAddPaymentMethods] = useState([
    "QR Code",
    "Cash",
  ]);
  const [loading, setLoading] = useState(false);
  const [hostID, setHostID] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await getPaymentMethods();
    });
    return unsubscribe;
  }, [navigation]);

  const getPaymentMethods = async () => {
    setLoading(true);
    const userDoc = await getDoc(
      doc(firestore, "users", authentication.currentUser.uid)
    );
    setHostID(userDoc.data().hostID);
      const hostDoc = await getDoc(doc(firestore, "Host", userDoc.data().hostID));
    if (hostDoc.data().paymentMethods != undefined && hostDoc.data().paymentMethods.length > 0) {
      setCurrPaymentMethods(hostDoc.data().paymentMethods);
      setAddPaymentMethods(
        addPaymentMethods.filter(
          (x) => !hostDoc.data().paymentMethods.includes(x)
        )
      );
    } else
      Alert.alert(
        "Payment Methods",
        "You need to have at least one payment method available to start hosting."
      );
    setLoading(false);
  };

  const addPayment = (payment) => {
    navigation.navigate("HostAddPayment", { type: payment });
  };

  const removePaymentMethod = async (payment) => {
    setLoading(true);
    setAddPaymentMethods(addPaymentMethods.push(payment));
    await updateDoc(doc(firestore, "Host", hostID), {
      paymentMethods: arrayRemove(payment),
    }).then(async () => await getPaymentMethods());
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View
          style={{ height: "100%", display: "flex", justifyContent: "center" }}
        >
          <AnimatedLottieView
            autoPlay
            style={{
              width: 300,
              height: 300,
              marginTop: "-5%",
            }}
            source={require("../../assets/animations/findmessages.json")}
          />
          <Text
            h2
            h2Style={{ textAlign: "center" }}
            style={{ marginTop: "-10%" }}
          >
            Loading Information...
          </Text>
        </View>
      ) : (
        <>
          {/* Current Payment Methods */}
          <View style={styles.currPaymentContainer}>
            <Text
              style={{
                marginBottom: "3%",
                fontFamily: "Inter-Bold",
                fontSize: 17,
              }}
            >
              Current Payment Methods
            </Text>
            {currPaymentMethods.length > 0 ? (
              currPaymentMethods.map((x, index) => (
                <View key={index} style={styles.paymentContainer}>
                  <Icon name={x == "Cash" ? "money" : "qr-code"} />
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 15,
                      marginLeft: "2%",
                      flex: 1,
                    }}
                  >
                    {x}
                  </Text>
                  {currPaymentMethods.length > 1 ? (
                    <Icon
                      name="cancel"
                      color="red"
                      onPress={() => removePaymentMethod(x)}
                    />
                  ) : null}
                </View>
              ))
            ) : (
              <View>
                <Text style={{ color: "gray", fontFamily: "Inter-Bold" }}>
                  No Payment Methods found!
                </Text>
                <Text style={{ color: "gray" }}>
                  Without a payment method, you will not be able to host
                  locations.
                </Text>
              </View>
            )}
          </View>
          {/* Add Other Payments */}
          <View style={styles.addPaymentContainer}>
            <Text
              style={{
                marginBottom: "3%",
                fontFamily: "Inter-Bold",
                fontSize: 17,
              }}
            >
              Add Payment Methods
            </Text>
            {addPaymentMethods.length > 0 ? (
              addPaymentMethods.map((x, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.paymentContainer}
                  onPress={() => addPayment(x)}
                >
                  <Icon name={x == "Cash" ? "money" : "qr-code"} />
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 15,
                      marginLeft: "2%",
                      flex: 1,
                    }}
                  >
                    {x}
                  </Text>
                  <Icon name="arrow-forward-ios" />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "gray", fontFamily: "Inter-Bold" }}>
                More Payment Methods to come soon!
              </Text>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "5%",
  },
  currPaymentContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: "2%",
  },
  paymentContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: "5%",
    marginBottom: "2%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addPaymentContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: "5%",
  },
});
