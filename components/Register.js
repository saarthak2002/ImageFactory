import React, {useContext,useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {REACT_APP_BASE_API_URL} from "@env";
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

const Register = (props) => {

    const navigation = props.navigation;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confrimPassword, setConfirmPassword] = useState('');
    const [email,setEmail] = useState('');
    const {isLoading, register, userInfo} = useContext(AuthContext);

    const defaultImage = require('../assets/hedgehog-icon.png');

    const handleRegister = async () => {
        console.log('Register...');
        console.log('Username: ' + username);
        console.log('Password: ' + password);
        console.log('Confirm Password: ' + confrimPassword);
        console.log('Email: ' + email);
        register(username,email,password);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <Spinner visible={isLoading} />
            <Image source={defaultImage} style={{width: 149,height:100, alignSelf: 'center'}} />
            <View style={styles.register}>
                {userInfo.error && <Text style={{color:'red'}}>{userInfo.msg}</Text> }
                <TextInput placeholder='Username' style={styles.textInput} onChangeText={setUsername} placeholderTextColor='#adb5bd'></TextInput>
                <TextInput placeholder='Email' style={styles.textInput} onChangeText={setEmail} placeholderTextColor='#adb5bd'></TextInput>
                <TextInput placeholder='Password' style={styles.textInput} onChangeText={setPassword} secureTextEntry={true} placeholderTextColor='#adb5bd'></TextInput>
                <TextInput placeholder='Confirm password' style={styles.textInput} onChangeText={setConfirmPassword} secureTextEntry={true} placeholderTextColor='#adb5bd'></TextInput>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={{color:'white'}}>Register</Text>
                </TouchableOpacity>
                <View style={{flexDirection: "row", marginTop:15,paddingTop:5}}>
                    <Text style={{color:'white'}}>Already a member?</Text>
                    <TouchableOpacity onPress={() => {navigation.navigate('Login')}} style={{marginLeft:7}}>
                        <Text style={{color:'white', fontWeight:'bold'}}>Login</Text>
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
    register: {
        borderRadius: 30,
        backgroundColor: "#a2d2ff",
        width: '70%',
        height: '50%',
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        margin: 5,
        height: 40,
        backgroundColor: "#fff",
        borderRadius:30,
        padding: 10,
        width: '80%',
    },
    registerButton: {
        backgroundColor: "#cdb4db",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        width: '80%',
        marginTop: 20,
    }
});

export default Register;