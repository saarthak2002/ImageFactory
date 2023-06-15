import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ItemView from './components/ItemView';
import GenerateImage from './components/GenerateImage';
import "react-native-url-polyfill/auto"
import Login from './components/Login';
import Register from './components/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './context/AuthContext';
import AuthStack from './components/AuthStack';
// Router
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './components/Tabs';
const Stack = createNativeStackNavigator();

import Navigation from './components/Navigation';


export default function App() {
  // const [user, setUser] = useState(null);

  // _retrieveData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('ImageWorksUser');
  //     setUser(value);
  //   } catch (error) {
  //     console.log("Fatal: Error retrieving data");
  //     console.log(error);
  //   }
  // };

  // _retrieveData();
  // console.log(user);
  // if(user) {
  //   return (
  //     <NavigationContainer>
  //       <Tabs />
  //     </NavigationContainer>
  //   );
  // } else {
  //   return (
  //    <NavigationContainer>
  //       <AuthStack />
  //    </NavigationContainer>
  //   );
  // }

  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  )
  
}

{/* <View style={styles.container}>
      
      <StatusBar style="auto" />
      <GenerateImage />
    </View> */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
