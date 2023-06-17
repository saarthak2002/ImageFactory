import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity } from "react-native";
import {REACT_APP_BASE_API_URL} from "@env";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const SearchProfileView = (props) => {
    const { viewProfileOfUser, idOfUserToView, email } = props.route.params;
    return(
        <Text>{viewProfileOfUser + ' ' + idOfUserToView}</Text>

    )
}

export default SearchProfileView;