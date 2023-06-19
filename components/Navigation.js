import React, {useContext} from "react";
import {NavigationContainer} from "@react-navigation/native";

import Tabs from "./Tabs";
import AuthStack from "./AuthStack";
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {

    const {userInfo} = useContext(AuthContext);

    return (
        <NavigationContainer>
            {userInfo._id ? <Tabs /> : <AuthStack />}
        </NavigationContainer>
    );
}

export default Navigation;