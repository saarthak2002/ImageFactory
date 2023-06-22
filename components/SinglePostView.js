import React, { useEffect, useState, useContext } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image, StyleSheet, Modal, KeyboardAvoidingView, SafeAreaView, Button, TextInput, Alert } from "react-native";
import axios from 'axios';
import { REACT_APP_BASE_API_URL } from "@env";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import Spinner from "react-native-loading-spinner-overlay";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import defaultImage from '../assets/default-post.png';
const defaultImageUri = Image.resolveAssetSource(defaultImage).uri;

const SinglePostView = (props) => {

    const {userInfo} = useContext(AuthContext);
    const {postId} = props.route.params;
    const [post, setPost] = useState({
        likedBy: []
    });
    const [likeLoading, setLikeLoading] = useState(false);

    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [commentOnPostId, setCommentOnPostId] = useState('');
    const [comment, setComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentList, setCommentList] = useState([{
        postId: '',
        userId: '',
        username: '',
        commentText: '',
    }]);

    const getPost = async () => {
        await axios
            .get(REACT_APP_BASE_API_URL + 'posts/' + postId)
            .then((response) => { 
                setPost(response.data);
                setNewCaption(response.data.caption);
            })
            .catch((error) => { console.log('error fetching post: '+error); });
    }


    const handleLike = async (postId) => {
        setLikeLoading(true);
        await axios
            .post(REACT_APP_BASE_API_URL + 'posts/like/' + postId, {currentUser: userInfo._id})
            .then((response) => {
                if(response.data.success) {
                    console.log('liked post');
                    getPost();
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
                if(response.data.success) {
                    console.log('unliked post');
                    getPost();
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

    const handleOpenCommentsModal = (post_id) => {
        getCommentsOnPost(post_id);
        setCommentOnPostId(post_id);
        setCommentModalVisible(true);
        console.log('opening comments modal for post: '+post_id);
    }

    const getCommentsOnPost = async (postId) => {
        await axios
            .get(REACT_APP_BASE_API_URL + 'comments/' + postId)
            .then((response) => { 
                setCommentList(response.data);
            })
            .catch((error) => { 
                console.log('unable to get comments: ' + error); 
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
            });
    }

    const [showEditModal,  setShowEditModal] = useState(false);
    const [newCaption, setNewCaption] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    const handleEditPost = async () => {
        console.log('editing post: '+post._id);
        console.log('new caption: '+newCaption);
        setEditLoading(true);
        await axios
            .post(REACT_APP_BASE_API_URL + 'posts/edit/' + postId, {newCaption: newCaption})
            .then((response) => {
                if(response.data.success) {
                    getPost();
                    setEditLoading(false);
                    setShowEditModal(false);
                }
                else {
                    console.log('unable to edit post');
                    Alert.alert('Unable to edit post');
                    setEditLoading(false);
                    setShowEditModal(false);
                }
            })
            .catch((error) => {
                console.log('error editing post: '+error);
                Alert.alert('Unable to edit post');
                setEditLoading(false);
                setShowEditModal(false);
            });
    }

    useEffect(() => {
        getPost();
    }, []);

    return(
        <ScrollView>

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
                        </SafeAreaView>
                        <ScrollView 
                            style={[styles.container, {marginTop: 15}]}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardDismissMode='on-drag'
                        >
                            {
                                commentList.length > 0 
                                ?
                                    commentList.map((comment) => {
                                        return (
                                            <View style={{marginLeft:10, marginRight:10, paddingBottom:10}}>
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
                                    <View style={{alignItems:'center', justifyContent:'center', marginTop:'50%'}}>
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

            {/* Edit Post Modal */}
            <Modal 
                visible={showEditModal}
                animationType='slide'
                transparent={true}
            >
                <KeyboardAwareScrollView
                    style={{
                        height: '50%',
                        marginTop: 'auto',
                        
                    }}
                >
                    <View
                        style={{height: '100%', marginTop: 'auto', backgroundColor:'white', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}
                    >
                        <SafeAreaView style={{marginTop: 100}}>
                            <View style={{flexDirection: "row", marginLeft:20, marginRight:20, justifyContent: 'space-between'}}>
                                <Button title="Cancel" color='steelblue' onPress={() => {setShowEditModal(false)}}></Button>
                                <Button title="Save" color='steelblue' onPress={() => { handleEditPost() }}></Button>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: '3%'}}>
                                <Text style={{alignSelf:'flex-start', marginLeft:'10%', marginTop: '5%'}}>Edit Caption</Text>
                                <TextInput placeholder='Caption' value={newCaption} onChangeText={setNewCaption} multiline={true} style={{borderWidth:1,borderRadius:5, borderColor:'#777',padding:8, marginTop:10, width:'80%'}}></TextInput>
                            </View>
                            <Button title="Delete Post" color='red' style={{marginBottom: '3%'}} onPress={() => {  }}></Button>
                            
                        </SafeAreaView>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
            {/* Edit Post Modal */}

            <Spinner visible={likeLoading}/>
            <Spinner visible={editLoading}/>
            <View style={{flex: 1}}>
                <View style={{height:'92%',flex:3}}>
                    <Image source={{uri: post.image ? post.image : defaultImageUri}} style={{width:'100%', height:'100%', aspectRatio:1, alignSelf:'center'}} />
                </View>
                <View style={{paddingTop:10, paddingBottom:20}}>
                    <View style={{flexDirection: "row", marginLeft:15, justifyContent:'space-between',marginRight:15}}>
                        <View style={{flexDirection: "row"}}>
                            { 
                                post.likedBy.includes(userInfo._id) 
                                ?
                                    <TouchableOpacity onPress={(e)=>{console.log(post._id + ' unliked'); handleUnlike(post._id)}}>
                                        <View>
                                            <Ionicons name={'ios-heart'} size={30} color={'red'} style={{marginRight:10}}/>
                                        </View>
                                    </TouchableOpacity>
                                :
                                    <TouchableOpacity onPress={(e)=>{console.log(post._id + ' liked'); handleLike(post._id)}}>
                                        <View>
                                            <Ionicons name={'ios-heart'} size={30} color={'black'} style={{marginRight:10}}/>
                                        </View>
                                    </TouchableOpacity>                                         
                            }
                            
                            <TouchableOpacity onPress={()=>{ handleOpenCommentsModal(post._id) }}>
                                <View>
                                    <Ionicons name={'ios-chatbubbles'} size={30} color={'black'}/>
                                </View>
                            </TouchableOpacity>

                            {
                                post.postedByUser == userInfo._id &&
                                <TouchableOpacity onPress={()=>{ setShowEditModal(true); }} style={{paddingLeft:10}}>
                                    <View>
                                        <Ionicons name={'ios-pencil'} size={30} color={'black'}/>
                                    </View>
                                </TouchableOpacity>
                            }

                        </View>
                        <View>
                            <Text>{post.aesthetic}</Text>
                        </View>
                    </View>
                    <View style={{marginLeft:15,paddingTop:3, marginRight:15}}>
                        <Text>{post.likedBy.length} {post.likedBy.length == 1 ? 'like' : 'likes'}</Text>
                        <Text><Text style={{fontWeight: "bold"}}>{post.postedByUserName ? post.postedByUserName+' ' : 'username ' }</Text>{post.caption}</Text>
                        <Text><Text style={{fontWeight: "bold"}}>prompt </Text>{post.prompt}</Text>
                        <Text style={{fontWeight:'300', marginTop:1, color:'#9c9ea1'}}>{formatTime(new Date(post.createdAt))}</Text>
                    </View>
                </View>
            </View>
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

export default SinglePostView;