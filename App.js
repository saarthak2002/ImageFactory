import React from 'react';
import "react-native-url-polyfill/auto"
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  )
}
