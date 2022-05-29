import { StyleSheet, Text, View, TouchableOpacity,SafeAreaView, ImageBackground, KeyboardAvoidingView, Image } from 'react-native'
import {React, useEffect, useState} from 'react'
import { Input} from 'react-native-elements'
import { Button, BottomSheet, ListItem } from '@rneui/base'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  collection,
  GeoPoint,
  query,
  where,
} from "firebase/firestore";
import { authentication,firestore } from "../firebase/firebase-config";
import * as ImagePicker from 'expo-image-picker';



const EditProfile = ({navigation}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const [pickedImagePath, setPickedImagePath] = useState('');

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
  }

  const handleUpdate =() => {

  }

  useEffect(() => {
    getUser();
  }, []);

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  }

  const list = [
    { title: 'Take Photo',
      containerStyle: { backgroundColor: '#1bb530', height:100, opacity:.7},
      titleStyle: { color: 'white' },
      onPress: () => openCamera()
    },
    { title: 'Select From Gallery', 
      containerStyle: { backgroundColor: '#1bb530', height:100, opacity:.7},
      titleStyle: { color: 'white' },
      onPress: () => showImagePicker()},
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'grey', height:100, opacity:.5},
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
     <SafeAreaView>
      <View>
        <View style={{alignItems:'center', marginTop:50}}>
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <View style={{
              height:100,
              width:100,
              borderRadius:15,
              justifyContent:'center',
              alignItems:'center',
            }}>
              <ImageBackground source={require('../assets/adaptive-icon.png')}
              style={{height:100, width:100, backgroundColor:'black', borderRadius:15}}
              >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon 
                    name="camera"
                    size={35}
                    color="#fff"
                    style={{
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      
                      borderColor: '#fff',
                      borderRadius: 10,
                    }}
                  />
                 </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text>username</Text>
          <Input 
            style={{marginTop:50}} 
            placeholder="First Name" 
            autoCorrect={false}>
          </Input>
          <Input 
            style={styles.action}
            placeholder="Last Name" 
            autoCorrect={false}>
           </Input>
          <Input 
          style={styles.action} 
          placeholder="Phone" 
          keyboardType="phone-pad">
          </Input>
        </View>
        <View>
          <Button title="Confirm" color="#1BB530" onPress={() => {}}></Button>
          <Text></Text>
          <Button title="Cancel" color="grey" onPress={() => navigation.navigate("Home")}></Button>
          </View>
              <View style={styles.imageContainer}>
                {
                  pickedImagePath !== '' && <Image
                    source={{ uri: pickedImagePath }}
                    style={styles.image}
                  />
                }
              </View>
          <BottomSheet modalProps={{}} isVisible={isVisible}>
            {list.map((l, i) => (
              <ListItem
                key={i}
                containerStyle={l.containerStyle}
                onPress={l.onPress}
              >
                <ListItem.Content>
                  <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </BottomSheet>
      </View>
      
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 400,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    padding: 30,

  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover'
  }
})