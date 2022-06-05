import { Icon, Text } from "@rneui/themed";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function AddImage({pickedImagePath, setPickedImagePath}) {

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.image}
        activeOpacity={1}
        onPress={showImagePicker}
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
