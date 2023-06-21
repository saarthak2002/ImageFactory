import React, {useContext, useEffect, useState} from "react";
import {ScrollView, SafeAreaView, StyleSheet, Text, Button, View, TouchableOpacity, Image, RefreshControl, TouchableHighlight, Alert} from "react-native";
import {AuthContext} from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import {FlatGrid} from 'react-native-super-grid';
import axios from 'axios';
import {REACT_APP_BASE_API_URL, REACT_APP_CLOUDINARY_CLOUD_NAME, REACT_APP_CLOUDINARY_UPLOAD_PRESET} from "@env";
import defaultImage from '../assets/default-post.png';
import * as ImagePicker from 'expo-image-picker';
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
    const [userDetails, setUserDetails] = useState({
        user: '',
        followers: [],
        following: [],
        profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
        bio: '',
    });

    const getUserDetails = async () => {
        await axios
                .get(REACT_APP_BASE_API_URL + 'userdetails/user/' + userInfo._id)
                .then((response) => {
                    setFollowersCount(response.data.followers.length);
                    setFollowingCount(response.data.following.length);
                    setUserDetails(response.data);
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

    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureLoading, setProfilePictureLoading] = useState(false);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4,
        });
    
        if (!result.canceled) {
            setProfilePictureLoading(true);
            setProfilePicture(result.assets[0].uri);
            
            // upload to CDN
            const cloudName = REACT_APP_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = REACT_APP_CLOUDINARY_UPLOAD_PRESET;
            const formData = new FormData();
            const b64Response = result.assets[0].base64;
            const img_src = `data:image/png;base64,${b64Response}`;
            formData.append('file', img_src);
            formData.append('upload_preset', uploadPreset);
            await axios
                .post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
                .then((response) => { 
                    console.log(response.data.secure_url);
                    const imageUrl = response.data.secure_url;
                    const userId = userInfo._id;
                    axios
                        .post(REACT_APP_BASE_API_URL + 'userdetails/profilepicture', {user: userId, profilePicture: imageUrl})
                        .then((response) => {
                            console.log(response.data);
                            getUserDetails();
                            setProfilePictureLoading(false);
                        })
                        .catch((error) => {
                            console.log('error changing picture: ' + error);
                            Alert.alert('Network Error', 'There was an error uploading your new profile picture. Please try again later.');
                            setProfilePictureLoading(false);
                        });
                })
                .catch((error) => { 
                    console.log(error);
                    Alert.alert('Network Error', 'There was an error uploading your new profile picture. Please try again later.');
                    setProfilePictureLoading(false);
                });
        }
    };

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
                <Spinner visible={profilePictureLoading} />
                <View style={{flexDirection:'row',justifyContent:'space-between', marginLeft:15, marginRight:15, paddingTop:15}}>
                <View style={{justifyContent: 'center', alignItems:'center'}}>
                    <TouchableHighlight
                        style={[styles.profileImgContainer, { borderColor: 'green', borderWidth:1 }]}
                    >
                        <Image source={{ uri: userDetails.profilePicture ? userDetails.profilePicture : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' }} style={styles.profileImg} />
                    </TouchableHighlight>
                    <Text>@{userInfo.username}</Text>
                </View>
                <View style={{justifyContent: 'center',alignItems:'center'}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{alignItems:'center',justifyContent:'center',padding:10, width: 85, height: 60}}>
                            <Text>{followersCount}</Text>
                            <Text>{followersCount == 1 ? 'Follower' : 'Followers'}</Text>
                        </View>
                        <View style={{alignItems:'center',justifyContent:'center',padding:10,width: 85, height: 60}}>
                            <Text>{followingCount}</Text>
                            <Text>Following</Text>
                        </View>
                        <View style={{alignItems:'center',justifyContent:'center',padding:10,width: 85, height: 60}}>
                            <Text>{postCount}</Text>
                            <Text>{postCount == 1 ? 'Post' : 'Posts'}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
                        <TouchableOpacity style={{backgroundColor:'#458eff', paddingLeft:10, paddingRight:10, paddingTop:10, paddingBottom:10, borderRadius:10, }} onPress={ () => {  } }>
                            <Text style={{color: 'white'}}>Edit Bio</Text>        
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor:'#458eff', paddingLeft:10, paddingRight:10, paddingTop:10, paddingBottom:10, borderRadius:10, marginLeft:10 }} onPress={ () => { pickImage(); } }>
                            <Text style={{color: 'white'}}>Edit Image</Text>        
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor:'#458eff', paddingLeft:10, paddingRight:10, paddingTop:10, paddingBottom:10, borderRadius:10, marginLeft:10}} onPress={ () => { logout(); } }>
                            <Text style={{color: 'white'}}>Logout</Text>        
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Text style={{textAlign:'center', fontWeight:'bold', marginTop:5, color:'#9c9ea1'}}>{userDetails.bio}</Text>
            
           
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