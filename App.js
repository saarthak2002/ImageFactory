import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ItemView from './components/ItemView';
import GenerateImage from './components/GenerateImage';
import "react-native-url-polyfill/auto"

export default function App() {
  return (
    <View style={styles.container}>
      
      <StatusBar style="auto" />
      <GenerateImage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
