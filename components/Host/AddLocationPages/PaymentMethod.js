import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import SelectionHosting from "../../resources/SelectionHosting";
import { doc, getDoc } from "firebase/firestore";
import { firestore, authentication } from "../../../firebase/firebase-config";

export default function PaymentMethod({ paymentMethods, setPaymentMethods }) {
  const [QR, setQR] = useState(
    paymentMethods.filter((x) => x == "QR Code").length == 1
  );
  const [cash, setCash] = useState(
    paymentMethods.filter((x) => x == "Cash").length == 1
  );
  const [userPaymentMethods, setUserPaymentMethods] = useState([])

  useEffect(() => {
    const getPaymentMethods = async () => {
      const userDoc = await getDoc(
      doc(firestore, "users", authentication.currentUser.uid)
    );
      const hostDoc = await getDoc(doc(firestore, "Host", userDoc.data().hostID));
      setUserPaymentMethods(hostDoc.data().paymentMethods)
    }
    getPaymentMethods();
    if (!QR && !cash) setPaymentMethods([]);
    else if (QR && !cash) setPaymentMethods(["QR Code"]);
    else if (cash && !QR) setPaymentMethods(["Cash"]);
    else setPaymentMethods(["QR Code", "Cash"]);
  }, [QR, cash]);

  return (
    <SafeAreaView style={styles.container}>
      {userPaymentMethods.includes("QR Code") ? <SelectionHosting
        selectionTitle="QR Code"
        iconName="qr-code"
        selected={QR}
        setSelected={setQR}
      />: null}
      <View style={{ padding: "2.5%" }} />
      {userPaymentMethods.includes("Cash") ? <SelectionHosting
        selectionTitle="Cash"
        iconName="money"
        selected={cash}
        setSelected={setCash}
      />:null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
