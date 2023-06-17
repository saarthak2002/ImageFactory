import React, {useEffect,useState,useContext} from 'react';
import { RefreshControl, Text, View, Image, ScrollView, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';


const ItemView = (props) => {

    const {userInfo} = useContext(AuthContext);

    const [listings, setListings] = useState([{
        image: '',
    }]); 

    const [refreshing, setRefreshing] = useState(false);

    const getListings = async () => {
        await axios.get('http://127.0.0.1:8082/api/posts')
                    .then((response) => { setListings(response.data); })
                    .catch((error) => { console.log(error); });
    }

    useEffect(() => {
        getListings();
    }, []);

    const onRefresh = () => {
        console.log('Refreshing...');
        setRefreshing(true);
        getListings();
        props.navigation.navigate('Feed');
        setRefreshing(false);
    }

    return (
        <ScrollView style={{marginTop: 35}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <Text>{userInfo.username}</Text>
            {
                listings.map( (item) => {
                    return (
                        <View key={item._id} style={{flex: 1}}>
                            <View style={{height:'92%',flex:3}}>
                                <Image source={{uri: item.image}}
                                    style={{width:'100%', height:'100%', aspectRatio:1, alignSelf:'center'}} />
                            </View>
                            <View style={{paddingTop:10,paddingBottom:20}}>
                                <View style={{flexDirection: "row", marginLeft:15, justifyContent:'space-between',marginRight:15}}>
                                    <View style={{flexDirection: "row"}}>
                                        <TouchableOpacity onPress={(e)=>{console.log(item._id + ' liked')}}>
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
                                    <Text>{item.aesthetic}</Text>
                                </View>

                                <View style={{marginLeft:15,paddingTop:3}}>
                                    <Text>266 likes</Text>
                                    <Text><Text style={{fontWeight: "bold"}}>{item.postedByUserName ? item.postedByUserName+' ' : 'username ' }</Text>{item.caption}</Text>
                                    <Text><Text style={{fontWeight: "bold"}}>prompt </Text>{item.prompt}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>
    );
}

export default ItemView;