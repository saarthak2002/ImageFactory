import React, {useEffect,useState} from 'react';
import { StyleSheet, Text, View, Image, Button, SafeAreaView, TextInput,Alert, ActivityIndicator,KeyboardAvoidingView, Modal,ScrollView } from 'react-native';
import axios from 'axios';

import DropDownPicker from 'react-native-dropdown-picker';
import {REACT_APP_OPEN_AI_KEY, REACT_APP_CLOUDINARY_CLOUD_NAME, REACT_APP_CLOUDINARY_UPLOAD_PRESET} from "@env";

const GenerateImage = (props) => {
    
    const defaultImage = require('../assets/hedgehog.png');

    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: REACT_APP_OPEN_AI_KEY, // DOT ENV
    });
    const openai = new OpenAIApi(configuration);

    const [image, setImage] = useState();
    const [prompt, onChangePrompt] = React.useState('');
    const [loading, setLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [postModalVisible, setPostModalVisible] = useState(false);
    const [caption, setCaption] = useState('');
    const [postStatus, setPostStatus] = useState('');

    const [post, setPost] = useState({
        image: '',
        caption: '',
        prompt: '',
        aesthetic: '',
    })

    // DropDownPicker
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'None', value: ''},
        {label: 'Bob Ross', value: ' in the style of Bob Ross'},
        {label: 'Van Gogh', value: ' in the style of Van Gogh'},
        {label: 'Beatrix Potter', value: ' in the style of English illustrator Beatrix Potter'},
        {label: 'Acidwave', value: ' in the Acidwave aesthetic'},
        {label: 'Théo Rysselberghe', value: ' in the style of Théo Rysselberghe'},
        {label: 'Pixel Art', value: ' in the style of Pixel Art'},
        {label: 'Vaporwave', value: ' in the Vaporwave aesthetic, focusing on neon, pink, blue, geometric, futuristic, and 80s styles'},
        {label: 'Post-apocalyptic', value: ' in the Post-apocalyptic aesthetic focusing on grey, desolate, stormy, fire, and decay'},
        {label: 'Gothic fantasy', value: 'in the Gothic fantasy aesthetic focusing on stone, dark, lush, nature, mist, mystery, angular'},
        {label: 'Cybernetic, sci-fi', value: ' in the Cybernetic, sci-fi aesthetic focusing on glows, greens, metals, armor, chrome'},
        {label: 'Steampunk', value: ' in the Steampunk aesthetic focusing on gears, brass, metal, steam, Victoriana, gold, copper'},
        {label: 'Retro', value: ' in the Retro aesthetic focusing on 80s, 90s, neon, pastel, geometric, and synthwave'},
        {label: 'Memphis', value: ' in the Memphis aesthetic focusing on the Memphis Group, 1980s, bold, kitch, colourful, shapes'},
        {label: 'Dieselpunk', value: ' in the Dieselpunk aesthetic focusing on grimy, steel, oil, 1950s, mechanised, punk cousin of steampnk'},
        {label: 'Afrofuturism', value: ' in the Afrofuturism aesthetic focusing on black, African, futuristic, sci-fi'},
        {label: 'Cyberpunk', value: ' in the Cyberpunk aesthetic focusing on 1990s, spiky, dyed hair, graphic elements'},
        {label: 'Biopunk, organic', value: ' in the Biopunk, organic aesthetic focusing on slimes, plants, organic, green, nature, weird, leaves, vines, and futuristic biotech'},
    ]);

    const generateImage = async () => {
        try {
            setLoading(true);
            setImage('');
            setPostStatus('');
            console.log('fetching image...');
            console.log(value);
            const response = await openai.createImage({
                prompt: prompt + value,
                n: 1,
                size: "1024x1024",
                response_format: "b64_json",
            });
            
            console.log(response.data.data[0].b64_json.substring(0,50));
            const b64Response = response.data.data[0].b64_json;
            const img_src = `data:image/png;base64,${b64Response}`;
            setImage(img_src);
            
        } catch (error) {
            console.log(error);
            Alert.alert('There was a network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const generateImageButtonPressed = () => {
        setModalVisible(false);
        generateImage();
    }

    const uploadImageToCDN = async () => {
        setPostLoading(true);
        const cloudName = REACT_APP_CLOUDINARY_CLOUD_NAME; // DOT ENV
        const uploadPreset = REACT_APP_CLOUDINARY_UPLOAD_PRESET; // DOT ENV
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', uploadPreset);

        await axios
                .post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
                .then((response) => { 
                    console.log(response.data.secure_url);
                    const imageUrl = response.data.secure_url;
                    const aesthetic = items.filter( item => item.value === value)[0].label;
                    post.caption = caption;
                    post.image = imageUrl;
                    post.prompt = prompt;
                    post.aesthetic = aesthetic;

                    axios
                        .post('http://127.0.0.1:8082/api/posts', post)
                        .then((response) => { 
                            console.log('post saved');
                            setPostStatus('Post saved successfully');
                        })
                        .catch((error) => {
                            console.log('error saving post');
                            setPostStatus('There was an error saving the post');})
                        .finally(() => { 
                            setPostLoading(false);
                            setCaption('');
                            setPostModalVisible(false);})
                        })
                .catch((error) => {
                    console.log('There was an error uploading the file');
                    console.log(error);
                    setPostLoading(false);
                })        
    };

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
            <ScrollView 
                style={{flex: 1, backgroundColor: 'white'}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                { postStatus && <Text style={{padding:10, fontSize:10, textAlign: 'center', backgroundColor:'green', color:'white'}}>{postStatus}</Text> }
                <View style={{flexDirection: "row", marginLeft:20, marginRight:20, justifyContent:'space-between'}}>
                    <Button title="Save" color='steelblue'></Button>
                    <Button title='Post' color='steelblue' onPress={() => setPostModalVisible(true)}></Button>
                </View>
                { image ?  <Image source={{uri: image}}
                                  style={{width: '90%', height: '90%', aspectRatio:1, alignSelf: 'center'}}  
                                  key={image} 
                            /> : <Image source={defaultImage} style={{width: '90%', height: '90%', aspectRatio:1, alignSelf: 'center'}} />
                }
                { loading && <ActivityIndicator size="large" style={{marginTop:15}} /> }

                { prompt && <Text style={{padding:10, fontSize:10, textAlign: 'center',marginLeft:20, marginRight:20}}>{prompt}</Text> }
                <Button
                    title="Generate Image"
                    color='steelblue'
                    onPress={() => setModalVisible(true)}
                    disabled={loading}
                />
            </ScrollView>

            <Modal 
                visible={modalVisible}
                animationType='slide'
            >
                <ScrollView 
                    style={[styles.container, {marginTop:'50%'}]}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardDismissMode='on-drag'
                >
                    <Text style={{fontSize:25,textAlign: 'center'}}>Picture Factory</Text>
                    <TextInput 
                        style={[styles.input]}
                        onChangeText={onChangePrompt}
                        value={prompt}
                        placeholder='a cowboy gunslinger walking in Tokyo...' 
                        multiline={true}
                    />
                    <View>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder="Select a style"
                            listMode="MODAL"
                        />
                    </View>
                    <Button
                        title="Generate Image"
                        color="#f194ff"
                        onPress={generateImageButtonPressed}
                    /> 
                    <Button color="#f194ff" title="Close" onPress={() => {setModalVisible(false)}} />
                </ScrollView>
            </Modal>

            <Modal 
                visible={postModalVisible}
                animationType='slide'
            >
                <ScrollView 
                    style={[styles.container, {marginTop: 40}]}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardDismissMode='on-drag'
                >
                    <View style={{flexDirection: "row", marginLeft:20, marginRight:20, justifyContent:'space-between'}}>
                        <Button title="Cancel" color='steelblue' onPress={() => setPostModalVisible(false)}></Button>
                        <Button title='Post' color='steelblue' onPress={uploadImageToCDN}></Button>
                    </View>
                    { image ?  <Image source={{uri: image}}
                                  style={{width: '70%', height: '70%', aspectRatio:1, alignSelf: 'center'}}  
                                  key={image} 
                            /> : <Image source={defaultImage} style={{width: '70%', height: '70%', aspectRatio:1,alignSelf: 'center'}} /> }
                    <Text style={{marginTop:20, marginLeft:20}}>Caption</Text>
                    <TextInput onChangeText={setCaption} value={caption} multiline={true} selectTextOnFocus={!postLoading} editable={!postLoading} style={{borderWidth:1,borderRadius:5, marginRight:20,marginLeft:20, borderColor:'#777',padding:8, marginTop:10}}></TextInput>
                    { postLoading && <ActivityIndicator size="large" style={{marginTop:15}} /> }
                </ScrollView>
            </Modal>
        </SafeAreaView>
    )
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

export default GenerateImage;