import React, {useState} from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({ navigation }) {
    
    const [error, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("clicked")
    }

    return (
        <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.subtitle}>Lorem ipsum dolor sit amet</Text>
                <Text style={styles.error}>{error}</Text>
            </View>
            <TextInput style={styles.textInput} placeholder="Email" keyboardType="email-address" onChangeText={setEmail}></TextInput>
            <TextInput style={[styles.textInput, {marginTop: 20}]} placeholder="Password" secureTextEntry={true} onChangeText={setPassword}></TextInput>
            <Pressable style={styles.loginButton} onPress={handleLogin}><Text style={styles.buttonText}>Login</Text></Pressable>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    background:
      "linear-gradient(225deg, #FFFFFF 0%, #EFF1F5 100%, #EFF1F5 100%)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    },
    title: {
    fontFamily: "Inter-Bold",
    fontSize: 45,
    textAlign: "left",
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    textAlign: "left",
    marginBottom: 20
    },
  titleContainer: {
    display: "flex",
    width: 350,
    justifyContent: "center",
    alignItems: "flex-start",
    },
  error: {
    color: "red",
    paddingBottom: 10
    },
  textInput: {
    width: 350,
    height: 50,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.101961)",
    shadowOpacity: 100,
    shadowRadius: 8,
    borderRadius: 8,
    padding: 10,
    fontSize: 17
    }, 
  loginButton: {
    backgroundColor: "#1BB530",
    height: 50,
    width: 350,
    borderRadius: 8,
    marginTop: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, 
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "white",
  }, 
})