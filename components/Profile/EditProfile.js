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
import { authentication, firestore } from "../../firebase/firebase-config";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { uploadImage } from "../resources/uploadImage";




const EditProfile = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [phone, setPhone] = useState("");

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

  const showChoice = () => {
    Alert.alert("Profile Photo", "Select an image of yourself", [
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
      email: authentication.currentUser.email,
      fname: firstName !=="" ? firstName : userData.get("fname"),
      lname: lastName !=="" ? lastName : userData.get("lname"),
      phone: phone !=="" ? phone : userData.get('phone'),
      userImg: imgUrl,
    });
    await updateProfile(authentication.currentUser, {
      displayName: firstName + " " + lastName,
      photoURL: imgUrl,
    });
    Alert.alert("Update done")
    navigation.navigate("ProfileHomeScreen")
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
      setIsVisible(false);
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
            <TouchableOpacity onPress={() => showChoice()}>
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
                    uri: userData!=null ? userData.get("userImg") : 
              'https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/photos%2F1B2C5C85-6253-4C85-9355-BE0AEC1B9A921654325573980.png?alt=media&token=3a176203-5203-403f-b63e-d0aa37912875'
                }}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 15,
                  }}
                  imageStyle= {{borderRadius : 15}}
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
            <Text style={{
              marginTop: 20,
              color: '#777777',
              fontSize: 20
              }}>{authentication.currentUser.displayName}</Text>
            <Input
              style={{ marginTop: 50 }}
              placeholder="First Name"
              autoCorrect={false}
              onChangeText={setfirstName}
            ></Input>
            <Input
              style={styles.action}
              placeholder="Last Name"
              autoCorrect={false}
              onChangeText={setlastName}
            ></Input>
            <Input
              style={styles.action}
              placeholder="Phone"
              keyboardType="phone-pad"
              onChangeText={setPhone}
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
          {/* Bottom Sheet Code No longer needed as replaced by alert */}
          {/* <BottomSheet modalProps={{}} isVisible={isVisible}>
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
          </BottomSheet> */}
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
