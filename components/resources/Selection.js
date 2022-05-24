import { Icon } from "@rneui/themed";
import React from "react";
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, Input, Divider } from "@rneui/themed";

export default function Selection({ logoName, logoType, title, onPress }) {
  return (
    <View style={{width:"95%", paddingTop: "5%",}}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Icon name={logoName} type={logoType} style={{ marginRight: 10 }} />
        <Text h4 style={{ flex: 1 }}>
          {title}
        </Text>
        <Icon type="MaterialIcons" name="arrow-forward-ios" />
      </TouchableOpacity>
          <Divider style={{width:"100%", marginTop:"3%"}} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
