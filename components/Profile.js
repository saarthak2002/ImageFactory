import React, {useContext, useEffect, useState} from "react";
import {ScrollView, SafeAreaView, StyleSheet, Text, Button, View, TouchableOpacity, Image, RefreshControl} from "react-native";
import {AuthContext} from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import {FlatGrid} from 'react-native-super-grid';
import axios from 'axios';
import {REACT_APP_BASE_API_URL} from "@env";

const Profile = (props) => {

    const navigation = props.navigation;
    const {userInfo, isLoading, logout} =  useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [listings, setListings] = useState([{
        image: '',
    }]); 
    const noImage = require('../assets/alert-circle-outline.png');

    const getListings = async () => {
        await axios
            .get(REACT_APP_BASE_API_URL + 'posts/user/' + userInfo._id)
            .then((response) => { setListings(response.data); })
            .catch((error) => { console.log(error); });
    }

    const onRefresh = () => {
        console.log('Refreshing...');
        setRefreshing(true);
        getListings();
        setRefreshing(false);
    }

    useEffect(() => {
        getListings();
        console.log(listings);
    }, []);
    
    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    flexDirection: 'column',
                    width: '100%',
                },
            ]}
        >
                <Spinner visible={isLoading} />
                <Text>{userInfo.username}'s Profile</Text>
                <Button title='Logout' onPress={() => logout()}></Button>
                { listings.length > 0 ? 
                    <FlatGrid
                        itemDimension={130}
                        data={listings}
                        style={styles.gridView}
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                        spacing={0}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('Post', { postId: item._id })}>
                                <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
                                </View>
                            </TouchableOpacity>
                        )}
                    /> : 
                    <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        <View style={{justifyContent: 'center',alignItems:'center'}}>
                            <Image source={noImage} style={{ width: '50%', height: '50%' }} />
                            <Text style={{marginTop:5, fontSize:25}}>No posts yet</Text>
                        </View>
                    </ScrollView>
                }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    gridView: {
        marginTop: 10,
        paddingTop: 5,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 0,
        padding: 1,
        height: 150,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
});

export default Profile;