import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {REACT_APP_BASE_API_URL} from "@env";
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

const Login = (props) => {

    const navigation = props.navigation;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {isLoading, login, userInfo, logout } = useContext(AuthContext);

    const defaultImage = require('../assets/hedgehog-icon.png');

    const [errorMessaage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage('');
        console.log('Logging in...');
        console.log('Username: ' + username);
        console.log('Password: ' + password);
        if (validateForm()) {
            login(username,password);
        }
    }

    const validateForm = () => {
        if (username === '') {
            setErrorMessage('Please enter your username');
            return false;
        }
        if (password === '') {
            setErrorMessage('Please enter your password');
            return false;
        }
        return true;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Spinner visible={isLoading} />
                <Image source={defaultImage} style={{width: 149,height:100, alignSelf: 'center'}} />
                <View style={styles.login}>
                    
                    { userInfo.error && <Text style={{color:'red'}}>{userInfo.msg}</Text> }
                    { errorMessaage && <Text style={{color:'red'}}>{errorMessaage}</Text> }

                    <TextInput placeholder='Username' style={styles.textInput} onChangeText={setUsername} placeholderTextColor='#adb5bd'></TextInput>
                    <TextInput placeholder='Password' style={styles.textInput} onChangeText={setPassword} secureTextEntry={true} placeholderTextColor='#adb5bd'></TextInput>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={{color:'white'}}>Login</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: "row", marginTop:15,paddingTop:5}}>
                        <Text style={{color:'white'}}>New here?</Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('Register'); setErrorMessage(''); logout();}} style={{marginLeft:7}}>
                            <Text style={{color:'white', fontWeight:'bold'}}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffc8dd",
      alignItems: "center",
      justifyContent: "center",
    },
    login: {
        borderRadius: 30,
        backgroundColor: "#a2d2ff",
        width: '70%',
        height: '35%',
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        margin: 10,
        height: 40,
        backgroundColor: "#fff",
        borderRadius:30,
        padding: 10,
        width: '80%',
    },
    loginButton: {
        backgroundColor: "#cdb4db",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        width: '80%',
        marginTop: 20,
    }
});

export default Login;