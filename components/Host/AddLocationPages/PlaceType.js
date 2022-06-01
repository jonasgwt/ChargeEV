import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Text, Icon } from "@rneui/themed";
import SelectionHosting from "../../resources/SelectionHosting";

export default function PlaceType({ locationType, setLocationType }) {
  const [selectApartment, setSelectApartment] = useState(locationType == "Apartment");
  const [selectLanded, setSelectLanded] = useState(locationType == "Landed Housing");

  useEffect(() => {
    if (selectLanded && selectApartment) setSelectLanded(false);
    if (selectLanded || selectApartment)
      setLocationType(selectApartment ? "Apartment" : "Landed Housing");
    else setLocationType("");
  }, [selectApartment]);

  useEffect(() => {
    if (selectApartment && selectLanded) setSelectApartment(false);
    if (selectLanded || selectApartment)
      setLocationType(selectApartment ? "Apartment" : "Landed Housing");
    else setLocationType("");
  }, [selectLanded]);

  return (
    <SafeAreaView style={styles.container}>
      <SelectionHosting
        selectionTitle="Apartment"
        iconName="apartment"
        selected={selectApartment}
        setSelected={setSelectApartment}
      />
      <View style={{ margin: "2%" }} />
      <SelectionHosting
        selectionTitle="Landed Housing"
        iconName="home"
        selected={selectLanded}
        setSelected={setSelectLanded}
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
