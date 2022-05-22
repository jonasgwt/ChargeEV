import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Input } from "@rneui/themed";
import { Button } from '@rneui/base';
import { useState } from 'react';
import { authentication } from '../firebase/firebase-config';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut} from "firebase/auth";




const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignedIn, setIsSignedIn] = useState(false);
    
    const signUpUser = () => {
        createUserWithEmailAndPassword(authentication, email, password)
        .then((re) => { 
            console.log(re);
            setIsSignedIn(true);
        })
        .catch((re) => {
            console.log(re);
        })
    }

    const signInUser = () => {
        signInWithEmailAndPassword(authentication, email, password)
        .then((re) => { 
            setIsSignedIn(true);
        })
        .catch((re) => {
            console.log(re);
        })
    }

    const signOutUser = () => {
        signOut(authentication)
        .then((re) => {
            setIsSignedIn(false);
        })
        .catch((re) => {
            console.log(re);
        })
    }

  return (
    <KeyboardAvoidingView
     style = {styles.container}
     behavior = "Padding">
      <Input
          placeholder='Email'
          value={email}
          onChangeText = {text => setEmail(text)}
      />
      <Input
          placeholder='Password'
          value={password}
          onChangeText = {text => setPassword(text)}
          secureTextEntry = {true}
      />
      <View style={{flexDirection: 'row', marginTop: 10}}>
    
            <Button size="lg" title = "Log Out" style = {{ width: 150}} color = "#1BB530" onPress={signOutUser}/>
            
            <Button size="lg" title = "Login" style = {{ width: 150}} color = "#1BB530" onPress={signInUser}/>
            <Button size="lg" title = "Register" style = {{ width: 150, marginHorizontal:10}}  color="#1BB530" onPress={signUpUser}/>
        
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
});