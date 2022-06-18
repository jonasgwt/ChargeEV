import {React, useState, useEffect} from "react";
import { SafeAreaView, StyleSheet, View, ImageBackground } from "react-native";
import { Text, Button, Divider, Image} from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { authentication,firestore } from "../../firebase/firebase-config";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import {
  Avatar,
  Title,
  Caption,
  TouchableRipple,
} from "react-native-paper"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Profile from "../Profile/Profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ChargeMap from "../ChargeMap/ChargeMap";
import * as Linking from 'expo-linking';
import { Link } from "react-router-dom";



export default function Homepage ({ navigation }) {
  const [userData, setUserData] = useState(null);
  const name = "";
  var cache = {};

  const getUser = async () => {
    const docRef = doc(firestore, "users", authentication.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
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
    <View style={{flexDirection: 'row', marginTop: "2%", marginBottom: 0,  justifyContent:'center'}}>
          <Avatar.Image 
            source={{
              uri: userData!=null ? userData.get("userImg") : 
              'https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/photos%2F1B2C5C85-6253-4C85-9355-BE0AEC1B9A921654325573980.png?alt=media&token=3a176203-5203-403f-b63e-d0aa37912875'
            }}
            size={100}
            imageStyle= {{borderRadius : 15}}
          />
          {/* <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>{authentication.currentUser.displayName}</Title>
            <Caption style={styles.caption}>{authentication.currentUser.uid}</Caption>
          </View> */}
    </View>
      

    <View styles={{marginTop:20}}>
      <View style={{marginTop:10}}>
         <Text h1 h1Style={{ fontSize: 35, color: "#1BB530", textAlign:'center'}}>
        Hi,{" "}
        <Text h1 h1Style={{ fontSize: 35, color: "black" }}>
          {userData!=null ? userData.get("fname") : authentication.currentUser.displayName}
        </Text>
        
        </Text>
        <Text h1 h1Style={{ fontSize: 35, color: "#1BB530", textAlign:"center", marginTop:10  }}>
        Need A Charge? 
      </Text>
      </View>
    <Divider style={{ width: "100%", margin: "2%", }} color="black" />
    <ScrollView horizontal = {true} showsHorizontalScrollIndicator={false} style={{
      marginTop:10,
      height:100
      }}>
        <TouchableOpacity 
          onPress={() => {navigation.navigate('Profile')}}
          >
            <View style={styles.horiwelcome}>
            <ImageBackground source={require('./Icons/ProfileIcon.png')} 
            style={{width: "100%", height: '100%', borderRadius:30}}>
              <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Text></Text>
              </View>
            </ImageBackground>
            </View>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {Linking.openURL("https://t.me/ChargeEVHelpBot")}}
          >
            <View style={styles.horiwelcome}>
            <ImageBackground source={require('./Icons/support.png')} 
            style={{width: "100%", height: '100%', borderRadius:30}}>
              <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Text></Text>
              </View>
            </ImageBackground>
            </View>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {navigation.navigate('Inbox')}}
          >
            <View style={styles.horiwelcome}>
            <ImageBackground source={require('./Icons/mailicon.png')} 
            style={{width: "100%", height: '100%', borderRadius:30}}>
              <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Text></Text>
              </View>
            </ImageBackground>
            </View>
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
    <ScrollView showsVerticalScrollIndicator={true} style={{
        height: "48%",
        marginTop:10
      }}>
        <TouchableOpacity 
            style={styles.welcome}
            onPress={() => {navigation.navigate("ChargeMap")}}
            >
            <ImageBackground source={require('./Icons/chargemap.png')} 
            style={{height:400, width:"99%"}}
            imageStyle={{borderRadius:20}}>
              <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Text></Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.welcome}
            onPress={() => {navigation.navigate("Host")}}
            >
            <ImageBackground source={require('./Icons/host.png')} 
            style={{height:400, width:"99%"}}
            imageStyle={{borderRadius:20}}>
              <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Text></Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.welcome}
            onPress={() => {}}
            >
              <Text style = {{alignContent:'center', textAlign:'center'}}>Placeholder 2</Text>
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
  horiwelcome: {
    marginLeft:5,
    textAlign: 'center',
    fontSize: 20,
    width:100,
    borderRadius:20
  },

  welcome: {
    textAlign: 'center',
    fontSize: 20,
    borderRadius:20,
    alignContent:'center',
    alignItems:'center',
    marginBottom:10,
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "20%",
    alignItems: "center",
    margin: "5%",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  top: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginTop: 50,
    alignItems: "center",
    margin: "5%",
  },
});



