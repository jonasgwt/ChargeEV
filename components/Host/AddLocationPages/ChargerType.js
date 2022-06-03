import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import SelectionHosting from "../../resources/SelectionHosting";

export default function ChargerType({ chargerTypes, setChargerTypes }) {
  const [type2, setType2] = useState(
    chargerTypes.filter((x) => x == "Type 2").length == 1
  );
  const [ccs2, setCcs2] = useState(
    chargerTypes.filter((x) => x == "CCS2").length == 1
  );

  useEffect(() => {
    if (!type2 && !ccs2) setChargerTypes([]);
    else if (type2 && !ccs2) setChargerTypes(["Type 2"]);
    else if (ccs2 && !type2) setChargerTypes(["CCS2"]);
    else setChargerTypes(["Type 2", "CCS2"]);
  }, [type2, ccs2]);

  return (
    <SafeAreaView style={styles.container}>
      <SelectionHosting
        selectionTitle="Mennekes Type 2"
        imageName={require("../../../assets/chargers/type2.png")}
        selected={type2}
        setSelected={setType2}
      />
      <View style={{ padding: "2.5%" }} />
      <SelectionHosting
        selectionTitle="CCS2"
        imageName={require("../../../assets/chargers/CCS.png")}
        selected={ccs2}
        setSelected={setCcs2}
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
