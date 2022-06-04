import {React, useState, useEffect} from "react";
import { SafeAreaView } from "react-native";
import { Text, Button } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { authentication, firestore } from "../../firebase/firebase-config";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";


export default function Homepage ({ navigation }) {
  const [userData, setUserData] = useState(null);
  const name = "";
  var cache = {};

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

  useEffect(() => {
    getUser();
  }, []);

  

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>{userData!==null ? userData.get("phone") : "placeholder"}</Text>
      <Text>{userData!==null ? userData.get("fname") + " " + userData.get("lname") : "fname lname"}</Text>
          <Text style={{color:"gray", fontSize:15, marginTop:50, width:"80%", textAlign:"center"}}>Note that features here are still a work in progress</Text>
    </SafeAreaView>
  );
};