import { StyleSheet, Text, View, TouchableOpacity,SafeAreaView, ImageBackground, KeyboardAvoidingView } from 'react-native'
import {React, useState} from 'react'
import { Input} from 'react-native-elements'
import { Button, BottomSheet, ListItem } from '@rneui/base'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"




const EditProfile = ({navigation}) => {
  const [isVisible, setIsVisible] = useState(false);
  const list = [
    { title: 'List Item 1' },
    { title: 'List Item 2' },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'grey' },
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
          <TouchableOpacity onPress={() => {}}>
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
          <Input style={{marginTop:50}} placeholder="First Name" autoCorrect={false}></Input>
          <Input style={styles.action} placeholder="Last Name" autoCorrect={false}></Input>
          <Input style={styles.action} placeholder="Phone" keyboardType="phone-pad"></Input>
        </View>
        <View>
          <Button title="Confirm" color="#1BB530" onPress={() => setIsVisible(true)}></Button>
          <Text></Text>
          <Button title="Cancel" color="grey" onPress={() => navigation.navigate("Home")}></Button>
          </View>
          <BottomSheet isVisible={isVisible}>
            {list.map((l, i) => (
              <ListItem key={i}  containerStyle={l.containerStyle}  onPress={l.onPress}>
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
  }
})