import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Icon, Input, Text } from "@rneui/themed";
import { DismissKeyboardView } from "../../resources/DismissKeyboardView";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Price({ price, setPrice }) {
  return (
    <DismissKeyboardView style={styles.container}>
      <View style={styles.priceContainer}>
        <Input
          containerStyle={styles.input}
          keyboardType="decimal-pad"
          placeholder="Enter Price"
          leftIcon={<MaterialCommunityIcons name="currency-usd" size={30} />}
          inputStyle={{
            fontSize: 20,
            fontFamily: "Inter-Regular",
            marginLeft: "5%",
          }}
          onChangeText={setPrice}
          value={price}
        />
        <Text h2 h2Style={{ fontSize: 25 }}>
          / charge
        </Text>
      </View>
      <View style={styles.text}>
        <Text h4 h4Style={{ marginBottom: "5%" }}>
          Currently cost of a charge is
          <Text h4 h4Style={{ fontFamily: "Inter-Bold" }}>
            {" "}
            $XX.XX
          </Text>
        </Text>
        <Text h4>
          Chargers near you are charging
          <Text h4 h4Style={{ fontFamily: "Inter-Bold" }}>
            {" "}
            $XX.XX
          </Text>
        </Text>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  input: {
    width: "70%",
  },
  priceContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    paddingLeft: "5%",
  },
});
