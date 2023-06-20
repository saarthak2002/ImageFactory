import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, Image } from "react-native";
import { REACT_APP_BASE_API_URL } from "@env";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import { FlatGrid } from 'react-native-super-grid';
import defaultImage from '../assets/default-post.png';
const defaultImageUri = Image.resolveAssetSource(defaultImage).uri;

const SearchProfileView = (props) => {
    const { viewProfileOfUser, idOfUserToView } = props.route.params;
    const [refreshing, setRefreshing] = useState(false);
    const navigation = props.navigation;
    const noImage = require('../assets/alert-circle-outline.png');
    const {userInfo, logout} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [posts, setPosts] = useState([{
        image: defaultImageUri,
    }]); 

    const [userDetails, setUserDetails] = useState({
        user: '',
        followers: [],
        following: []
    })

    const [userDetailsOfProfileUser, setUserDetailsOfProfileUser] = useState({
        user: '',
        followers: [],
        following: []
    });
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [postCount, setPostCount] = useState(0);

    const getPosts = async () => {
        await axios
                .get(REACT_APP_BASE_API_URL + 'posts/user/' + idOfUserToView)
                .then((response) => { 
                    setPosts(response.data); 
                    console.log(response.data);
                    setPostCount(response.data.length); 
                })
                .catch((error) => { console.log('unable to get posts: '+error); });
    };

    const getUserDetailsOfCurrentUser = async () => {
        await axios
                .get(REACT_APP_BASE_API_URL + 'userdetails/user/' + userInfo._id)
                .then((response) => { 
                    console.log(response.data);
                    setUserDetails(response.data); 
                })
                .catch((error) => { console.log('unable to get user details: '+error); });
    };

    const getUserDetailsOfProfileUser = async () => {
        await axios
                .get(REACT_APP_BASE_API_URL + 'userdetails/user/' + idOfUserToView)
                .then((response) => {
                        setFollowersCount(response.data.followers.length);
                        setFollowingCount(response.data.following.length); 
                })
                .catch((error) => { console.log('unable to get user details: '+error); });
    };  

    const onRefresh = () => {
        console.log('Refreshing...');
        setRefreshing(true);
        getPosts();
        setRefreshing(false);
    };

    const handleFollow = async () => {
        const currentUser = userInfo._id;
        const userToFollow = idOfUserToView;
        console.log(currentUser + ' wants to follow ' + userToFollow);
        setLoading(true);
        await axios
                .post(REACT_APP_BASE_API_URL + 'userdetails/follow', {currentUser, userToFollow})
                .then((response) => {
                    console.log(response.data); 
                    getUserDetailsOfCurrentUser(); 
                    getUserDetailsOfProfileUser(); 
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('unable to follow user: '+error);
                    setLoading(false);
                });
    };

    const handleUnfollow = async () => {
        const currentUser = userInfo._id;
        const userToUnfollow = idOfUserToView;
        console.log(currentUser + ' wants to unfollow ' + userToUnfollow);
        setLoading(true);
        await axios
                .post(REACT_APP_BASE_API_URL + 'userdetails/unfollow', {currentUser, userToUnfollow})
                .then((response) => {
                    console.log(response.data);
                    getUserDetailsOfCurrentUser();
                    getUserDetailsOfProfileUser();
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('unable to unfollow user: '+error);
                    setLoading(false);
                });

    };

    useEffect(() => {
        getPosts();
        getUserDetailsOfCurrentUser();
        getUserDetailsOfProfileUser();
    }, []);

    return(
        <SafeAreaView
            style={[
                styles.container,
                {
                    flexDirection: 'column',
                    width: '100%',
                },
            ]}
        >
            <Spinner visible={loading} />
            <View style={{flexDirection:'row',justifyContent:'space-between', marginLeft:15, marginRight:15, paddingTop:5}}>
                <View style={{justifyContent: 'center', alignItems:'center'}}>
                    <TouchableHighlight
                        style={[styles.profileImgContainer, { borderColor: 'green', borderWidth:1 }]}
                    >
                        <Image source={{ uri:"https://lh3.googleusercontent.com/ogw/AOLn63FwPuujbk3pqjcXIEU1gPZhgO0Q4TR-LYG_B_kYuw=s64-c-mo" }} style={styles.profileImg} />
                    </TouchableHighlight>
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

                    {
                        idOfUserToView == userInfo._id
                        ?
                            <TouchableOpacity style={{backgroundColor:'#458eff', paddingLeft:50, paddingRight:50, paddingTop:10, paddingBottom:10, borderRadius:10}} onPress={ () => { logout(); } }>
                                <Text style={{color: 'white'}}>Logout</Text>        
                            </TouchableOpacity>
                        :
                            userDetails.following.includes(idOfUserToView)
                            ?
                                <TouchableOpacity style={{backgroundColor:'#458eff', paddingLeft:50, paddingRight:50, paddingTop:10, paddingBottom:10, borderRadius:10}} onPress={ () => { handleUnfollow(); } }>
                                    <Text style={{color: 'white'}}>Unfollow</Text>        
                                </TouchableOpacity>
                            :
                                <TouchableOpacity style={{backgroundColor:'#458eff', paddingLeft:50, paddingRight:50, paddingTop:10, paddingBottom:10, borderRadius:10}} onPress={ () => { handleFollow(); } }>
                                    <Text style={{color: 'white'}}>Follow</Text>        
                                </TouchableOpacity>
                    }
                </View>
            </View>
            { posts.length > 0 ? 
                <FlatGrid
                    itemDimension={130}
                    data={posts}
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
                /> : 
                <View style={{justifyContent: 'center',alignItems:'center'}}>
                    <Image source={noImage} style={{ width: '50%', height: '50%' }} />
                    <Text style={{marginTop:5, fontSize:25}}>No posts yet</Text>
                </View>
            }
        </SafeAreaView>
    )
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

export default SearchProfileView;