import {React, useState, useEffect} from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text, Button } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { authentication, firestore } from "../../firebase/firebase-config";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";


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
    <SafeAreaView>

    <View>
      <View style={{marginTop:50}}>
        <Text h1 h1Style={{ fontSize: 30, color: "#1BB530", textAlign:"center"  }}>
        Need A Charge?{" "}
        <Text h1 h1Style={{ fontSize: 25, color:"black"}}>
          {authentication.currentUser.displayName}
        </Text>
      </Text>
      </View>
    <ScrollView horizontal = {true} showsHorizontalScrollIndicator={false} style={{marginTop:40}}>
        <TouchableOpacity 
          style={styles.welcome}
          onPress={() => {}}
          >
            <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.welcome}
          onPress={() => {}}
          >
            <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.welcome}
          onPress={() => {}}
          >
            <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.welcome}
          onPress={() => {}}
          >
            <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.welcome}
          onPress={() => {}}
          >
            <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{
        height: "60%",
        marginTop:20
      }}>
        <TouchableOpacity 
            style={styles.welcome}
            onPress={() => {}}
            >
              <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.welcome}
            onPress={() => {}}
            >
              <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.welcome}
            onPress={() => {}}
            >
              <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.welcome}
            onPress={() => {}}
            >
              <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 1</Text>
          </TouchableOpacity>
      </ScrollView>
        <Text>Bottom</Text>
    </SafeAreaView>
  );

  
};

const styles = StyleSheet.create({

  container: {
    marginTop:20,
  },

  welcome: {
    flex: 1,
    margin: 20,
    backgroundColor: '#1bb530',
    margin: 10,
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 80,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "20%",
    alignItems: "center",
    margin: "5%",
  },
});



