import React, { useEffect, useState, useContext } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
import axios from 'axios';
import { REACT_APP_BASE_API_URL } from "@env";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import Spinner from "react-native-loading-spinner-overlay";

const SinglePostView = (props) => {

    const {userInfo} = useContext(AuthContext);
    const {postId} = props.route.params;
    const [post, setPost] = useState({
        likedBy: []
    });
    const [likeLoading, setLikeLoading] = useState(false);


    const getPost = async () => {
        await axios
            .get(REACT_APP_BASE_API_URL + 'posts/' + postId)
            .then((response) => { setPost(response.data); })
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

    useEffect(() => {
        getPost();
    }, []);

    return(
        <ScrollView>
            <Spinner visible={likeLoading}/>
            <View style={{flex: 1}}>
                <View style={{height:'92%',flex:3}}>
                    <Image source={{uri: post.image}} style={{width:'100%', height:'100%', aspectRatio:1, alignSelf:'center'}} />
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
                            
                            <TouchableOpacity onPress={()=>{}}>
                                <View>
                                    <Ionicons name={'ios-chatbubbles'} size={30} color={'black'}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text>{post.aesthetic}</Text>
                    </View>
                    <View style={{marginLeft:15,paddingTop:3, marginRight:15}}>
                        <Text>{post.likedBy.length} likes</Text>
                        <Text><Text style={{fontWeight: "bold"}}>{post.postedByUserName ? post.postedByUserName+' ' : 'username ' }</Text>{post.caption}</Text>
                        <Text><Text style={{fontWeight: "bold"}}>prompt </Text>{post.prompt}</Text>
                        <Text style={{fontWeight:'300', marginTop:1, color:'#9c9ea1'}}>{formatTime(new Date(post.createdAt))}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default SinglePostView;