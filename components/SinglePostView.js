import React, {useEffect, useState} from "react";
import {ScrollView, Text, View, TouchableOpacity, Image} from "react-native";
import axios from 'axios';
import {REACT_APP_BASE_API_URL} from "@env";
import Ionicons from 'react-native-vector-icons/Ionicons';

const SinglePostView = (props) => {

    const {postId} = props.route.params;
    const [post, setPost] = useState({});

    const getPost = async () => {
        await axios.get(REACT_APP_BASE_API_URL + 'posts/' + postId)
                   .then((response) => { setPost(response.data); })
                   .catch((error) => { console.log('error fetching poat: '+error); });
    }

    useEffect(() => {
        getPost();
    }, []);

    return(
        <ScrollView>
            <View style={{flex: 1}}>
                <View style={{height:'92%',flex:3}}>
                    <Image source={{uri: post.image}} style={{width:'100%', height:'100%', aspectRatio:1, alignSelf:'center'}} />
                </View>
                <View style={{paddingTop:10, paddingBottom:20}}>
                    <View style={{flexDirection: "row", marginLeft:15, justifyContent:'space-between',marginRight:15}}>
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity onPress={(e)=>{console.log(post._id + ' liked')}}>
                                <View>
                                    <Ionicons name={'ios-heart'} size={30} color={'black'} style={{marginRight:10}}/>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>{}}>
                                <View>
                                    <Ionicons name={'ios-chatbubbles'} size={30} color={'black'}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text>{post.aesthetic}</Text>
                    </View>
                    <View style={{marginLeft:15,paddingTop:3, marginRight:15}}>
                        <Text>266 likes</Text>
                        <Text><Text style={{fontWeight: "bold"}}>{post.postedByUserName ? post.postedByUserName+' ' : 'username ' }</Text>{post.caption}</Text>
                        <Text><Text style={{fontWeight: "bold"}}>prompt </Text>{post.prompt}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default SinglePostView;