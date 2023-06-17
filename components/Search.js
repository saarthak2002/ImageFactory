import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity } from "react-native";
import {REACT_APP_BASE_API_URL} from "@env";
import { AuthContext } from "../context/AuthContext";
import SearchBar from 'react-native-search-bar';
import axios from "axios";

const Search = (props) => {

    const navigation = props.navigation;

    const [searchString, setSearchString] = useState('');
    const {userInfo} = useContext(AuthContext);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const SearchResult = ({ _id, username }) => (
        <View style={{padding: 10, flex: 1, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginLeft:20, marginRight:20}} >
          <Text>{username} </Text>
          <TouchableOpacity style={{backgroundColor:'#458eff', paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10, borderRadius:10}} onPress={ () => {navigation.navigate('Search Profile View', {viewProfileOfUser: username, idOfUserToView: _id } )} }>
                    <Text style={{color: 'white'}}>View</Text>        
           </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }) => (
        <SearchResult username={item.username} _id={item._id} />
    );

    const handleSearchInput = () => {
        console.log(searchString);
        axios.get(REACT_APP_BASE_API_URL + 'users/search/' + searchString)
             .then((response) => { console.log(response.data); setSearchResults(response.data); })
             .catch((error) => { console.log(error) });
    }

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
            <SearchBar
                placeholder="Search"
                onChangeText={ setSearchString }
                onSearchButtonPress={ handleSearchInput }
                onCancelButtonPress={ () => {} }
            />
            <FlatList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default Search;
