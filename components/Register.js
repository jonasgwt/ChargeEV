/* eslint-disable max-len */
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Axios from 'axios';
import {color} from 'react-native-elements/dist/helpers';

export default function Register({navigation}) {

  const [email, setEmail] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorMessage] = useState('');

  const handleRegister = () => {
    if (email.length == 0 || firstName.length == 0 || lastName.length == 0 || password.length == 0) {
      setErrorMessage('Ensure all fields are filled up')
    } else {
      setErrorMessage('')
      Axios.post('http://chargeev.api.nhhs-sjb.org:3000/api/register', {
        userEmail: email,
        userFirstName: firstName,
        userLastName: lastName,
        userPassword: password
      }).then(() => {
        console.log('successfully registered')
        navigation.navigate('Login')
      }).catch((err) => {
        console.error(err)
      })
    }
  }

  return (
    <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Lorem ipsum dolor sit amet</Text>
        <Text style={styles.error}>{error}</Text>
      </View>
      <TextInput style={styles.textInput} placeholder="Email" keyboardType="email-address" onChangeText={setEmail}></TextInput>
      <View style={styles.nameContainer}>
        <TextInput style={[styles.textInput, { width: 160 }]} placeholder="First Name" onChangeText={setfirstName} textContentType="name" autoCompleteType="name"></TextInput>
        <TextInput style={[styles.textInput, { width: 160 }]} placeholder="Last Name" onChangeText={setlastName} textContentType="name" autoCompleteType="name"></TextInput>
      </View>
      <TextInput style={styles.textInput} placeholder="Password" secureTextEntry={true} onChangeText={setPassword}></TextInput>
      <Pressable style={styles.registerButton} onPress={handleRegister}><Text style={styles.buttonText}>Register</Text></Pressable>
      <Text style={styles.bottomText}>Already have an account? <Text style={{color:'#1BB530', textDecorationLine: 'underline'}} onPress={() => navigation.navigate('Login')}>Sign in</Text></Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    background:
      'linear-gradient(225deg, #FFFFFF 0%, #EFF1F5 100%, #EFF1F5 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  nameContainer: {
    display: 'flex',
    width: 350,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  titleContainer: {
    display: 'flex',
    width: 350,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 45,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 20
  },
  textInput: {
    width: 350,
    height: 50,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.101961)',
    shadowOpacity: 100,
    shadowRadius: 8,
    borderRadius: 8,
    padding: 10,
    fontSize: 17
  }, 
  registerButton: {
    backgroundColor: '#1BB530',
    height: 50,
    width: 350,
    borderRadius: 8,
    marginTop: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  buttonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 20,
    color: 'white',
  }, 
  error: {
    color: 'red',
    paddingBottom: 10
  },
  bottomText: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    marginTop: 20,
    color: '#171930'
  }
});
