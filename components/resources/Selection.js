import { Icon } from "@rneui/themed";
import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  Animated,
} from "react-native";
import { Button, Text, Input, Divider } from "@rneui/themed";

export default function Selection({ logoName, logoType, title, onPress }) {
  return (
    <TouchableHighlight
      underlayColor="#7777"
      style={{ width: "111%", paddingTop: "5%"}}
      onPress={onPress}
    >
      <>
        <View style={styles.container}>
          <Icon name={logoName} type={logoType} style={{ marginRight: 10 }} />
          <Text h4 style={{ flex: 1 }} h4Style={{fontFamily: "Inter-Regular"}}>
            {title}
          </Text>
          <Icon type="MaterialIcons" name="arrow-forward-ios" />
        </View>
        <Divider style={{ width: "90%", marginTop: "3%", marginLeft:"5%" }} color="#7777" />
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginLeft:"5%"
  },
});
