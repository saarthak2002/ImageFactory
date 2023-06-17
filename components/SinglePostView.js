import React, { useContext, useEffect, useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet, Text, Button, View, TouchableOpacity, Image } from "react-native";
import axios from 'axios';
import {REACT_APP_BASE_API_URL} from "@env";

const SinglePostView = (props) => {

    const {postId} = props.route.params;

    return(
        <Text>Single Post View {' ' + postId}</Text>
    );
}

export default SinglePostView;