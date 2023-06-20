import React, {useContext, useEffect, useState} from "react";
import {ScrollView, SafeAreaView, StyleSheet, Text, Button, View, TouchableOpacity, Image, RefreshControl, TouchableHighlight} from "react-native";
import {AuthContext} from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import {FlatGrid} from 'react-native-super-grid';
import axios from 'axios';
import {REACT_APP_BASE_API_URL} from "@env";
import defaultImage from '../assets/default-post.png';
const defaultImageUri = Image.resolveAssetSource(defaultImage).uri;

const Profile = (props) => {

    const navigation = props.navigation;
    const {userInfo, isLoading, logout} =  useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [listings, setListings] = useState([{
        image: defaultImageUri,
    }]); 
    const noImage = require('../assets/alert-circle-outline.png');

    const [postCount, setPostCount] = useState(0);

    const getListings = async () => {
        await axios
            .get(REACT_APP_BASE_API_URL + 'posts/user/' + userInfo._id)
            .then((response) => {
                setListings(response.data);
                setPostCount(response.data.length);
            })
            .catch((error) => { console.log(error); });
    }

    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const getUserDetails = async () => {
        await axios
                .get(REACT_APP_BASE_API_URL + 'userdetails/user/' + userInfo._id)
                .then((response) => {
                    setFollowersCount(response.data.followers.length);
                    setFollowingCount(response.data.following.length);
                })
                .catch((error) => { console.log('unable to get user details: '+error); });
    }

    const onRefresh = () => {
        console.log('Refreshing...');
        setRefreshing(true);
        getListings();
        getUserDetails();
        setRefreshing(false);
    }

    useEffect(() => {
        getListings();
        getUserDetails();
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

                <View style={{flexDirection:'row',justifyContent:'space-between', marginLeft:15, marginRight:15, paddingTop:15}}>
                <View style={{justifyContent: 'center', alignItems:'center'}}>
                    <TouchableHighlight
                        style={[styles.profileImgContainer, { borderColor: 'green', borderWidth:1 }]}
                    >
                        <Image source={{ uri:"https://lh3.googleusercontent.com/ogw/AOLn63FwPuujbk3pqjcXIEU1gPZhgO0Q4TR-LYG_B_kYuw=s64-c-mo" }} style={styles.profileImg} />
                    </TouchableHighlight>
                    <Text>@{userInfo.username}</Text>
                </View>
                <View style={{justifyContent: 'center',alignItems:'center'}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{alignItems:'center',justifyContent:'center',padding:10, width: 85, height: 60}}>
                            <Text>{followersCount}</Text>
                            <Text>Followers</Text>
                        </View>
                        <View style={{alignItems:'center',justifyContent:'center',padding:10,width: 85, height: 60}}>
                            <Text>{followingCount}</Text>
                            <Text>Following</Text>
                        </View>
                        <View style={{alignItems:'center',justifyContent:'center',padding:10,width: 85, height: 60}}>
                            <Text>{postCount}</Text>
                            <Text>Posts</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Button title='Logout' onPress={() => logout()}></Button>
            { 
                listings.length > 0 
                ? 
                    <FlatGrid
                        itemDimension={130}
                        data={listings}
                        style={styles.gridView}
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                        spacing={0}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('Post', { postId: item._id })}>
                                <View style={[styles.itemContainer]}>
                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                : 
                    <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        <View style={{justifyContent: 'center',alignItems:'center'}}>
                            <Image source={noImage} style={{ width: '60%', height: '60%' }} />
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
    profileImgContainer: {
        marginLeft: 8,
        height: 90,
        width: 90,
        borderRadius: 999,
        overflow: 'hidden',
    },
    profileImg: {
        height: 90,
        width: 90,
        borderRadius: 40,
    },
});

export default Profile;