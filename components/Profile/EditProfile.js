import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import { React, useEffect, useState } from "react";
import { Input } from "react-native-elements";
import { Button, BottomSheet, ListItem } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { authentication, firestore, storage } from "../../firebase/firebase-config";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";




const EditProfile = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const [pickedImagePath, setPickedImagePath] = useState("");

  const uploadImage = async () => {
    console.log("Starting upload")
    console.log(image)
    if( image == null ) {
      console.log("No image uploaded")
      return null;
    }
    const uploadUri = image;
    console.log("Uploading image")
    console.log(image)
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storage = getStorage();
    const storageRef = ref(storage, `photos/${filename}`);

    let uri = image
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const task = uploadBytesResumable(storageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
    

    try {
      await task;

      const url = await getDownloadURL(storageRef);

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };



  const getUser = async () => {
    const docRef = doc(firestore, "users", authentication.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserData(docSnap);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const handleUpdate = async() => {
    console.log("Handling update");
    let imgUrl = await uploadImage();
    console.log("Image has been uploaded")
    if( imgUrl == null && userData.userImg ) {
      imgUrl = userData.userImg;
    }
    console.log(authentication.currentUser.uid)
    console.log(imgUrl)
    await setDoc(doc(firestore, "users", authentication.currentUser.uid), {
      email: "swapped",
      fname: "nameswap",
      lname: "lnameswap",
      userImg: imgUrl,
    });
    Alert.alert("update done")
  }

  useEffect(() => {
    getUser();
  }, []);

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setPickedImagePath(result.uri);
      console.log("Image is set to " + result.uri);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  };


  const list = [
    {
      title: "Take Photo",
      containerStyle: { backgroundColor: "#1bb530", height: 100, opacity: 0.7 },
      titleStyle: { color: "white" },
      onPress: () => openCamera(),
    },
    {
      title: "Select From Gallery",
      containerStyle: { backgroundColor: "#1bb530", height: 100, opacity: 0.7 },
      titleStyle: { color: "white" },
      onPress: () => showImagePicker(),
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "grey", height: 100, opacity: 0.5 },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView>
        <View>
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageBackground
                  source={{
                  uri: image
                    ? image
                    : userData
                    ? userData.data().userImg ||
                      "https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/photos%2FD724053F-4576-48DB-9C80-618DA1FA31A61654257919032.jpg?alt=media&token=91be5b5e-968b-48a5-9a48-8a4194352467"
                    : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                }}
                  style={{
                    height: 100,
                    width: 100,
                    backgroundColor: "black",
                    borderRadius: 15,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="camera"
                      size={35}
                      color="#fff"
                      style={{
                        opacity: 0.7,
                        alignItems: "center",
                        justifyContent: "center",

                        borderColor: "#fff",
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
            <Text>username</Text>
            <Input
              style={{ marginTop: 50 }}
              placeholder="First Name"
              autoCorrect={false}
            ></Input>
            <Input
              style={styles.action}
              placeholder="Last Name"
              autoCorrect={false}
            ></Input>
            <Input
              style={styles.action}
              placeholder="Phone"
              keyboardType="phone-pad"
            ></Input>
          </View>
          <View>
            <Button title="Confirm" color="#1BB530" onPress={() => handleUpdate()}></Button>
            <Text></Text>
            <Button
              title="Cancel"
              color="grey"
              onPress={() => navigation.navigate("ProfileHomeScreen")}
            ></Button>
          </View>
          <View style={styles.imageContainer}>
            {pickedImagePath !== "" && (
              <Image source={{ uri: pickedImagePath }} style={styles.image} />
            )}
          </View>
          <BottomSheet modalProps={{}} isVisible={isVisible}>
            {list.map((l, i) => (
              <ListItem
                key={i}
                containerStyle={l.containerStyle}
                onPress={l.onPress}
              >
                <ListItem.Content>
                  <ListItem.Title style={l.titleStyle}>
                    {l.title}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </BottomSheet>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: 400,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imageContainer: {
    padding: 30,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
});
