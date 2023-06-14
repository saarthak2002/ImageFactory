import React, {useEffect,useState} from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import axios from 'axios';

const ItemView = (props) => {

    const [listings, setListings] = useState([{
        image: '',
    }]); 

    useEffect(() => {
        const getListings = async () => {
            await axios.get('http://127.0.0.1:8082/api/posts')
                        .then((response) => { setListings(response.data); })
                        .catch((error) => { console.log(error); });
        }

        getListings();
    }, []);

    return (
        <ScrollView style={{marginTop: 35}}>
            {
                listings.map( (item) => {
                    return (
                        
                        <View key={item._id} style={{flex: 1}}>
                            <View style={{height:'92%'}}>
                                <Image source={{uri: item.image}}
                                    style={{width:'100%', height:'100%', aspectRatio:1}} />
                            </View>
                            
                            <Text>{item.caption}</Text>
                            <Text>{item.aesthetic}</Text>
                        </View>
                        
                        
                    )
                })
            }
        </ScrollView>
    );
}

export default ItemView;