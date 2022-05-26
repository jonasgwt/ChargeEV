import { NavigationContainer } from "@react-navigation/native";
import React from 'react'
import { async } from "@firebase/util";
import { collection } from "firebase/firestore";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { authentication, firestore } from "../firebase/firebase-config";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Button, Text, } from "@rneui/themed";
import {
  Avatar,
  Title,
  Caption,
  TouchableRipple,
} from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

const Profile = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
    
      
    
    
    <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image 
            source={require('../assets/adaptive-icon.png')}
            size={90}
            style={{backgroundColor:"black"}}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>{authentication.currentUser.displayName}</Title>
            <Caption style={styles.caption}>placeholder</Caption>
          </View>
        </View>
      </View>


      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#777777" size={30}/>
          <Text style={{color:"#777777", marginLeft: 20}}>Singapore</Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={30}/>
          <Text style={{color:"#777777", marginLeft: 20}}>+65 #########</Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={30}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{authentication.currentUser.email}</Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => {navigation.navigate("EditProfile")}}>
          <View style={styles.menuItem}>
            <Icon name="account-edit" color="#1BB530" size={25}/>
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="history" color="#1BB530" size={25}/>
            <Text style={styles.menuItemText}>Your History</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="credit-card" color="#1BB530" size={25}/>
            <Text style={styles.menuItemText}>Payment</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="share-outline" color="#1BB530" size={25}/>
            <Text style={styles.menuItemText}>Tell Your Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="account-check-outline" color="#1BB530" size={25}/>
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        
      </View>

    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    marginTop:10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});