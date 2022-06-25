import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image
} from "react-native";
import { Icon } from "@rneui/themed";

export default function SelectionHosting({
  selectionTitle,
  iconName,
  selected,
  setSelected,
  imageName,
}) {
  // Animations
  const selectionAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const bgSelectionAnim = bgAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["rgba(255,255,255,0)", "rgba(27, 181, 48, 1)"],
  });
  const textAnim = useRef(new Animated.Value(0)).current;
  const textSelectionAnim = textAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["rgba(0,0,0,1)", "rgba(255, 255, 255, 1)"],
  });
  const iconAnim = useRef(new Animated.Value(1)).current;

  const animateSelected = () => {
    Animated.parallel([
      Animated.timing(selectionAnim, {
        toValue: 0.9,
        duration: 500,
        useNativeDriver: true,
      }).start(),
      Animated.timing(bgAnim, {
        toValue: 100,
        duration: 500,
        useNativeDriver: false,
      }).start(),
      Animated.timing(textAnim, {
        toValue: 100,
        duration: 500,
        useNativeDriver: false,
      }).start(),
      Animated.timing(iconAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(),
    ]);
  };

  const animateDeselect = () => {
    Animated.parallel([
      Animated.timing(selectionAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(),
      Animated.timing(bgAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(),
      Animated.timing(textAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(),
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(),
    ]);
  };

  const select = () => {
    if (!selected) {
      setSelected(true);
      animateSelected();
    } else {
      setSelected(false);
      animateDeselect();
    }
  };

  // Update animations to new state
  useEffect(() => {
    if (selected) animateSelected();
    else animateDeselect();
  }, [selected]);

  return (
    <TouchableOpacity
      onPress={select}
      activeOpacity={1}
      style={[styles.container, { shadowOpacity: selectionAnim }]}
    >
      <Animated.View
        style={[styles.button, { backgroundColor: bgSelectionAnim }]}
      >
        <Animated.Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: 20,
            color: textSelectionAnim,
          }}
        >
          {selectionTitle}
        </Animated.Text>
        {iconName ? (
          <>
            <Icon
              name={iconName}
              size={30}
              containerStyle={{ position: "absolute", right: "5.5%" }}
              iconStyle={{ color: "white" }}
            />
            <Animated.View style={{ opacity: iconAnim }}>
              <Icon name={iconName} size={30} />
            </Animated.View>
          </>
        ) : <Image source={imageName} style={styles.image} />}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: "100%",
    borderWidth: "1%",
    borderRadius: "10%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: "5%",
  },
  container: {
    width: "90%",
    height: "10%",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 5 },
  },
  image: {
    resizeMode: "contain",
    height: "150%",
    width: "25%",
    position: "absolute",
    right: 0
  }
});
