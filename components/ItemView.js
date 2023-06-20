import React, {useEffect,useState,useContext} from 'react';
import {RefreshControl, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {REACT_APP_BASE_API_URL} from "@env";
import {AuthContext} from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import defaultImage from '../assets/default-post.png';
const defaultImageUri = Image.resolveAssetSource(defaultImage).uri;

const ItemView = (props) => {

    const {userInfo} = useContext(AuthContext);

    const [listings, setListings] = useState([{
        image: defaultImageUri,
        likedBy: [],
        createdAt: '',
    }]); 

    const [refreshing, setRefreshing] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [postLimit, setPostLimit] = useState(10);
    const [postsLoading, setPostsLoading] = useState(false);
    const noImage = require('../assets/earth-outline.png');
    const [likeLoading, setLikeLoading] = useState(false);

    const getListings = async () => {
        setPostsLoading(true);
        await axios
            .get(REACT_APP_BASE_API_URL + 'posts/feed/' + userInfo._id)
            .then((response) => { 
                console.log('getting posts');
                console.log(userDetails.following);
                setListings(response.data); 
                setPostsLoading(false);
            })
            .catch((error) => { 
                console.log(error); 
                setPostsLoading(false);
            });
    }

    const [userDetails, setUserDetails] = useState({
        user: '',
        followers: [],
        following: [],
    })

    const getUserDetails = async () => {
        await axios
                .get(REACT_APP_BASE_API_URL + 'userdetails/user/' + userInfo._id)
                .then((response) => {
                    console.log('got user details');
                    setUserDetails(response.data);
                    console.log(response.data);
                })
                .catch((error) => { console.log('unable to get user details: '+error); });
    }

    useEffect(() => {
        getUserDetails();
        getListings();
        console.log("PL: "+ postLimit);
    }, []);

    const onRefresh = () => {
        console.log('Refreshing...');
        setRefreshing(true);
        getListings();
        props.navigation.navigate('Feed');
        setRefreshing(false);
    }

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    const handleLike = async (postId) => {
        setLikeLoading(true);
        await axios
            .post(REACT_APP_BASE_API_URL + 'posts/like/' + postId, {currentUser: userInfo._id})
            .then((response) => {
                if(response.data.success) {
                    console.log('liked post');
                    getListings();
                    setLikeLoading(false);
                }
                else {
                    console.log('unable to like post');
                    setLikeLoading(false);
                }
            })
            .catch((error) => { 
                console.log('error liking post: '+error); 
                setLikeLoading(false);
            });
    }

    const formatTime = (time) => {
        var month= ["January","February","March","April","May","June","July", "August","September","October","November","December"];
        return time.getDate() + ' ' + month[time.getMonth()] + ' ' + time.getFullYear();
    }

    const handleUnlike = async (postId) => {
        setLikeLoading(true);
        await axios
            .post(REACT_APP_BASE_API_URL + 'posts/unlike/' + postId, {currentUser: userInfo._id})
            .then((response) => {
                console.log('here');
                if(response.data.success) {
                    console.log('unliked post');
                    getListings();
                    setLikeLoading(false);
                }
                else {
                    console.log('unable to unlike post');
                    setLikeLoading(false);
                }
            })
            .catch((error) => {
                console.log('error unliking post: '+error);
                setLikeLoading(false);
            });
    }

    console.log(listings)
    return (
        <ScrollView
            style={{marginTop: 35}}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            onMomentumScrollEnd={ ({nativeEvent}) => {
                if(isCloseToBottom(nativeEvent)) {
                    setLoadMore(true);
                    setPostLimit(postLimit+10);
                    console.log('PL:'+postLimit);
                    console.log('load more');
                    setLoadMore(false);
                }
            }}
        >
            <Spinner visible={likeLoading}/>
            <Text>{userInfo.username}</Text>
            {
                listings.length > 0 
                ?
                    listings.map( (item) => {
                        return (
                            <View key={item._id} style={{flex: 1}}>
                                <View style={{height:'92%',flex:3}}>
                                    <Image 
                                        source={{uri: item.image}}
                                        style={{width:'100%', height:'100%', aspectRatio:1, alignSelf:'center'}} 
                                    />
                                </View>
                                <View style={{paddingTop:10,paddingBottom:20}}>
                                    <View style={{flexDirection: "row", marginLeft:15, justifyContent:'space-between',marginRight:15}}>
                                        <View style={{flexDirection: "row"}}>
                                            { item.likedBy.includes(userInfo._id) ?
                                                <TouchableOpacity onPress={(e)=>{console.log(item._id + ' unliked'); handleUnlike(item._id)}}>
                                                    <View>
                                                        <Ionicons name={'ios-heart'} size={30} color={'red'} style={{marginRight:10}}/>
                                                    </View>
                                                </TouchableOpacity>
                                            :
                                                <TouchableOpacity onPress={(e)=>{console.log(item._id + ' liked'); handleLike(item._id)}}>
                                                    <View>
                                                        <Ionicons name={'ios-heart'} size={30} color={'black'} style={{marginRight:10}}/>
                                                    </View>
                                                </TouchableOpacity>                                         
                                            }
                                            <TouchableOpacity onPress={()=>{}}>
                                                <View>
                                                    <Ionicons name={'ios-chatbubbles'} size={30} color={'black'}/>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <Text>{item.aesthetic}</Text>
                                    </View>

                                    <View style={{marginLeft:15, paddingTop:3, marginRight:15}}>
                                        <Text>{item.likedBy.length} {item.likedBy.length == 1 ? 'like' : 'likes'}</Text>
                                        <Text><Text style={{fontWeight: "bold"}}>{item.postedByUserName ? item.postedByUserName+' ' : 'username ' }</Text>{item.caption}</Text>
                                        <Text><Text style={{fontWeight: "bold"}}>prompt </Text>{item.prompt}</Text>
                                        <Text style={{fontWeight:'300', marginTop:1, color:'#9c9ea1'}}>{formatTime(new Date(item.createdAt))}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                : 
                    <View style={{justifyContent: 'center',alignItems:'center', height:400}}>
                        <Image source={noImage} style={{ width: '60%', height: '60%' }} />
                        <Text style={{marginTop:5, fontSize:25}}>Follow your friends</Text>
                        <Text style={{marginTop:5, fontSize:25}}>to see their posts</Text>
                    </View>
            }
            { loadMore && <ActivityIndicator size="large" /> }
        </ScrollView>  
    );
}

export default ItemView;