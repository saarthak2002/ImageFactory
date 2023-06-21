import React from 'react';
import "react-native-url-polyfill/auto"
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';

// disable warnings
// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Warning: ...']);
// LogBox.ignoreAllLogs();

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  )
}
