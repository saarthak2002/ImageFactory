import React, {useState} from "react";
import axios from "axios";
import {REACT_APP_BASE_API_URL} from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    
    const [userInfo, setUserInfo] = useState({}); 
    const [isLoading, setIsLoading] = useState(false);

    const register = (username, email, password) => {
        setIsLoading(true);
        axios.post(REACT_APP_BASE_API_URL + 'users/signup', {username:username, email:email, password:password, followers:[], following:[]})
            .then((response) => {
                let userInfo = response.data;
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setIsLoading(false);
                console.log(userInfo);
            })
            .catch((error) => { 
                console.log(`register error ${error}`); 
                setIsLoading(false);
            });
    }

    const login = (username, password) => {
        setIsLoading(true);

        axios.post(REACT_APP_BASE_API_URL + 'users/auth', {username:username, password:password} )
            .then((response) => {
                const userInfo = response.data; 
                console.log(userInfo);
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setIsLoading(false);
            }) 
            .catch((error) => { 
                console.log(error); 
                setIsLoading(false);
            });
    }

    const logout = () => {
        setIsLoading(true);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
    }

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};