import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import SelectionHosting from "../../resources/SelectionHosting";

export default function PaymentMethod({ paymentMethods, setPaymentMethods }) {
  const [QR, setQR] = useState(
    paymentMethods.filter((x) => x == "QR Code").length == 1
  );
  const [cash, setCash] = useState(
    paymentMethods.filter((x) => x == "Cash").length == 1
  );

  useEffect(() => {
    if (!QR && !cash) setPaymentMethods([]);
    else if (QR && !cash) setPaymentMethods(["QR Code"]);
    else if (cash && !QR) setPaymentMethods(["Cash"]);
    else setPaymentMethods(["QR Code", "Cash"]);
  }, [QR, cash]);

  return (
    <SafeAreaView style={styles.container}>
      <SelectionHosting
        selectionTitle="QR Code"
        iconName="qr-code"
        selected={QR}
        setSelected={setQR}
      />
      <View style={{ padding: "2.5%" }} />
      <SelectionHosting
        selectionTitle="Cash"
        iconName="money"
        selected={cash}
        setSelected={setCash}
      />
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
