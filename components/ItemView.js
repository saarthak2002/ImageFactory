import React, {useEffect,useState,useContext} from 'react';
import {RefreshControl, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Button, StyleSheet, TextInput, KeyboardAvoidingView, SafeAreaView, Alert} from 'react-native';
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
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [commentOnPostId, setCommentOnPostId] = useState('');
    const [comment, setComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentOpenModalLoading, setCommentOpenModalLoading] = useState(false);
    const [commentList, setCommentList] = useState([{
        postId: '',
        userId: '',
        username: '',
        commentText: '',
        profilePicture: '',
    }]);

    const getListings = async () => {
        setPostsLoading(true);
        await axios
            .get(REACT_APP_BASE_API_URL + 'posts/feed/' + userInfo._id)
            .then((response) => { 
                console.log('getting posts');
                setListings(response.data); 
                setPostsLoading(false);
            })
            .catch((error) => { 
                console.log(error); 
                setPostsLoading(false);
                Alert.alert('Error fetching feed. Please try again later.');
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
                .catch((error) => {
                    console.log('unable to get user details: '+error);
                    Alert.alert('Unable to fetch data. Please try again later.');
                });
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
                    Alert.alert('Error processing request. Please try again later.');
                }
            })
            .catch((error) => { 
                console.log('error liking post: '+error); 
                setLikeLoading(false);
                Alert.alert('Error processing request. Please try again later.');
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
                    Alert.alert('Error processing request. Please try again later.');
                }
            })
            .catch((error) => {
                console.log('error unliking post: '+error);
                setLikeLoading(false);
                Alert.alert('Error processing request. Please try again later.');
            });
    }

    const handleOpenCommentsModal = (post_id) => {
        setCommentOpenModalLoading(true);
        getCommentsOnPost(post_id);
        setCommentOnPostId(post_id);
        setCommentModalVisible(true);
        console.log('opening comments modal for post: '+post_id);
        setCommentOpenModalLoading(false);
    }

    const getCommentsOnPost = async (postId) => {
        await axios
            .get(REACT_APP_BASE_API_URL + 'comments/' + postId)
            .then((response) => { 
                console.log(response.data);
                setCommentList(response.data);
            })
            .catch((error) => { 
                console.log('unable to get comments: ' + error); 
                Alert.alert('Error fetching comments. Please try again later.');
            });
    }

    const submitComment = async () => {
        if(comment == '') {
            Alert.alert('Please enter a comment');
            return;
        }
        console.log('submitting comment: '+comment+' on post: '+commentOnPostId);
        setCommentLoading(true);
        await axios
            .post(REACT_APP_BASE_API_URL + 'comments', {postId: commentOnPostId, userId: userInfo._id, username: userInfo.username, commentText: comment})
            .then((response) => {
                if(response.data.error) {
                    console.log('unable to post comment');
                    Alert.alert('Error posting comment. Please try again later.');
                    setComment('');
                    setCommentLoading(false);
                }
                else {
                    console.log('comment posted');
                    setComment('');
                    getCommentsOnPost(commentOnPostId);
                    setCommentLoading(false);
                }
            })
            .catch((error) => {
                console.log('error posting comment: '+error);
                setComment('');
                setCommentLoading(false);
                Alert.alert('Error posting comment. Please try again later.');
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
            {/* Comment Modal */}
            <Modal 
                visible={commentModalVisible}
                animationType='slide'
                transparent={true}
            >
                <KeyboardAvoidingView behavior={"padding"}>
                    <Spinner visible={commentLoading} textContent={'Loading...'} textStyle={{color:'white'}} />
                    <View
                        style={{height: '100%', marginTop: 'auto', backgroundColor:'white', borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                    >
                        <SafeAreaView>
                            <View style={{flexDirection: "row", marginLeft:20, marginRight:20, justifyContent:'space-between'}}>
                                <Button title="Cancel" color='steelblue' onPress={() => setCommentModalVisible(false)}></Button>
                            </View>
                            <Text style={{textAlign:'center', fontSize:16, fontWeight:'bold'}}>{commentList.length} {commentList.length == 1 ? 'Comment' : 'Comments'}</Text>
                            { commentOpenModalLoading && <ActivityIndicator size='large' />}
                        </SafeAreaView>
                        <ScrollView
                            key="commentScrollView"
                            style={[styles.container, {marginTop: 15}]}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardDismissMode='on-drag'
                        >
                            {   
                                commentList.length > 0 
                                ?
                                    commentList.map((comment) => {
                                        return (
                                            <View key={comment._id} style={{marginLeft:10, marginRight:10, paddingBottom:15}}>
                                                <View>
                                                    <Image source={{ uri: comment.profilePicture ? comment.profilePicture : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'  }} style={{ width: 50, height: 50, borderRadius: 50/2 }} />
                                                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                        <Text style={{fontWeight:'bold', fontSize:15}}>{comment.username}</Text>
                                                        <Text style={{fontSize: 12, color:'#777'}}>{formatTime(new Date(comment.createdAt))}</Text>
                                                    </View>
                                                    <Text style={{fontSize: 15}}>{comment.commentText}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                :
                                    <View key={'nocomm'} style={{alignItems:'center', justifyContent:'center', marginTop:'50%'}}>
                                        <Text style={{fontSize:16, fontWeight:'bold'}}>No comments yet</Text>
                                    </View>
                            }
                        </ScrollView>
                        <KeyboardAvoidingView>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center', marginLeft:20, marginRight:20, marginBottom:40}}>
                                <TextInput placeholder='Comment' onChangeText={setComment} value={comment} multiline={true} style={{borderWidth:1,borderRadius:5, borderColor:'#777',padding:8, marginTop:10, width:'80%'}}></TextInput>
                                <TouchableOpacity onPress={() => { submitComment(); }} style={{width:'20%', marginLeft:7}}>
                                    <Text style={{color:'steelblue', fontSize: 16, fontWeight:'bold', textAlign:'center'}}>Post</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
            {/* Comment Modal */}

            <Spinner visible={likeLoading}/>
            <Spinner visible={postsLoading} textContent='Loading...' textStyle={{color:'white'}}/>
            <Text>{userInfo.username}</Text>
            {
                listings.length > 0 
                ?
                    listings.map( (item) => {
                        return (
                            <View key={item._id} style={{flex: 1}}>
                                {/* Post Header */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:15, paddingBottom: 5 }}>
                                    <Image source={{ uri: item.profilePicture ? item.profilePicture : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' }} style={{ width: 40, height: 40, borderRadius: 40/2 }} />
                                    <Text style={{marginLeft: 10}}>{item.postedByUserName}</Text>
                                </View>
                                {/* Post Image */}
                                <View style={{height:'92%',flex:3}}>
                                    <Image 
                                        source={{uri: item.image}}
                                        style={{width:'100%', height:'100%', aspectRatio:1, alignSelf:'center'}} 
                                    />
                                </View>
                                <View style={{paddingTop:10,paddingBottom:20}}>
                                    {/* Post Buttons */}
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
                                            <TouchableOpacity onPress={()=>{ handleOpenCommentsModal(item._id) }}>
                                                <View>
                                                    <Ionicons name={'ios-chatbubbles'} size={30} color={'black'}/>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <Text>{item.aesthetic}</Text>
                                    </View>
                                    {/* Post Bottom Text */}
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
                    // No posts view
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

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    container: {
        flex: 1,
        padding: 20,
    },
});

export default ItemView;