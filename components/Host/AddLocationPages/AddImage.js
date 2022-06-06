import { Icon, Text } from "@rneui/themed";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function AddImage({
  pickedImagePath,
  setPickedImagePath,
  setLoading,
}) {
  const showChoice = () => {
    Alert.alert("Hosting", "Select an image of your hosting location", [
      {
        text: "Select from Photos",
        onPress: showImagePicker,
      },
      {
        text: "Take a Photo",
        onPress: openCamera,
      },
      {
        text: "Cancel",
      },
    ]);
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }
    setLoading(true);
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) setPickedImagePath(result.uri);
    setLoading(false);
  };

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) setPickedImagePath(result.uri);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.image}
        activeOpacity={1}
        onPress={showChoice}
      >
        {pickedImagePath != "" ? (
          <>
            <Image
              source={{ uri: pickedImagePath }}
              style={styles.uploadedImage}
            />
            <Text style={{ position: "absolute", bottom: "-10%" }}>
              Click on the image to reselect.
            </Text>
          </>
        ) : (
          <>
            <Icon name="image" size={100} />
            <Text h2 h2Style={{ marginTop: "5%" }}>
              Select an image here
            </Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "50%",
    backgroundColor: "#c9c9c9",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
