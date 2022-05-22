import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import SettingsScreen from './SettingsScreen';

function NextScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}



const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="NextScreen" component={NextScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
  );
}
    

