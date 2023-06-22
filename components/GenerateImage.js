import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, Button, SafeAreaView, TextInput, Alert, ActivityIndicator, Modal, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import {REACT_APP_BASE_API_URL, REACT_APP_OPEN_AI_KEY, REACT_APP_CLOUDINARY_CLOUD_NAME, REACT_APP_CLOUDINARY_UPLOAD_PRESET} from "@env";
import { AuthContext } from "../context/AuthContext";

const GenerateImage = (props) => {
    
    const { userInfo } = React.useContext(AuthContext);
    const defaultImage = require('../assets/hedgehog.png');
    const backgroundImage = require('../assets/wave.png');

    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: REACT_APP_OPEN_AI_KEY,
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
    const [suggestedCaption, setSuggestedCaption] = useState('');
    const [suggestedCaptionLoading, setSuggestedCaptionLoading] = useState(false);
    const [suggestedCaptionError, setSuggestedCaptionError] = useState(false);
    const [post, setPost] = useState({
        image: '',
        caption: '',
        prompt: '',
        aesthetic: '',
        postedByUser: '',
        postedByUserName: '',
        likedBy: [],
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
        {label: 'Oil painting', value: ' in an oil painting style'},
        {label: 'Watercolour', value: ' in a watercolour style'},
        {label: 'Pencil sketch', value: ' in a pencil sketch style'},
        {label: '3D render', value: ' in a 3D render style'},
        {label: 'Photorealistic', value: ' in a photorealistic style'},
        {label: 'Digital art', value: ' , digital art'},
        {label: 'Anime', value: ' in an anime art style'},
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
        const cloudName = REACT_APP_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = REACT_APP_CLOUDINARY_UPLOAD_PRESET;
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
                    post.postedByUser = userInfo._id;
                    post.postedByUserName = userInfo.username;
                    post.likedBy = [];

                    axios
                        .post(REACT_APP_BASE_API_URL + 'posts', post)
                        .then((response) => { 
                            console.log('post saved');
                            setPostStatus('Post saved successfully');
                        })
                        .catch((error) => {
                            console.log('error saving post');
                            setPostStatus('There was an error saving the post');
                        })
                        .finally(() => { 
                            setPostLoading(false);
                            setCaption('');
                            setPostModalVisible(false);
                        })
                })
                .catch((error) => {
                    console.log('There was an error uploading the file');
                    console.log(error);
                    setPostLoading(false);
                })        
    };

    const suggestCaption = async () => {
        try {
            setSuggestedCaptionError(false);
            setSuggestedCaptionLoading(true);
            console.log("Suggest a caption for a post with an image of " + prompt + value + ".");
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                      {"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": "Suggest a caption for a post with an image of " + prompt + value + "."},
                ]
            });
            setSuggestedCaption(response.data.choices[0].message.content);
            console.log(response.data.choices[0].message.content);
            setSuggestedCaptionLoading(false);
        } catch (error) {
            console.log(error);
            setSuggestedCaptionLoading(false);
            setSuggestedCaptionError(true);
        }
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
            
            <ScrollView 
                style={{flex: 1, backgroundColor: 'white'}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Post status banner */}
                { postStatus && <Text style={{padding:10, fontSize:10, textAlign: 'center', backgroundColor:'green', color:'white'}}>{postStatus}</Text> }

                {/* Save and Post Buttons */}
                <View style={{flexDirection: "row", marginLeft:20, marginRight:20, justifyContent:'space-between'}}>
                    <Button title="Save" color='steelblue'></Button>
                    <Button title='Post' color='steelblue' onPress={() => { setPostModalVisible(true); suggestCaption(); } }></Button>
                </View>

                {/* Generated Image Display */}
                { 
                    image
                    ?  
                        <Image 
                            source={{uri: image}}
                            style={{width: '90%', height: '90%', aspectRatio:1, alignSelf: 'center'}}  
                            key={image} 
                        />
                    : 
                        <Image source={defaultImage} style={{width: '90%', height: '90%', aspectRatio:1, alignSelf: 'center'}} />
                }

                {/* Image loading indicator and prompt text */}
                { loading && <ActivityIndicator size="large" style={{marginTop:15}} /> }
                { prompt && <Text style={{padding:10, fontSize:10, textAlign: 'center',marginLeft:20, marginRight:20}}>{prompt}</Text> }
                
                {/* Generate Image Button */}
                <Button
                    title="Generate Image"
                    color='steelblue'
                    onPress={() => setModalVisible(true)}
                    disabled={loading}
                />
            </ScrollView>

            {/* Generate Image Modal */}
            <Modal 
                visible={modalVisible}
                animationType='slide'
            >
                <ScrollView 
                    style={[styles.container, {marginTop:'50%'}]}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardDismissMode='on-drag'
                >
                    {/* Prompt Input */}
                    <Text style={{fontSize:25,textAlign: 'center'}}>Picture Factory</Text>
                    <TextInput 
                        style={[styles.input]}
                        onChangeText={onChangePrompt}
                        value={prompt}
                        placeholder='a cowboy gunslinger walking in Tokyo...' 
                        multiline={true}
                    />

                    {/* Style Picker */}
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

                    {/* Bottom Buttons */}
                    <Button
                        title="Generate Image"
                        color="#f194ff"
                        onPress={generateImageButtonPressed}
                    /> 
                    <Button color="#f194ff" title="Close" onPress={() => {setModalVisible(false)}} />
                </ScrollView>
            </Modal>
            {/* Generate Image Modal */}

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
                    {
                        image
                        ?
                            <Image source={{uri: image}}
                                  style={{width: '70%', height: '70%', aspectRatio:1, alignSelf: 'center'}}  
                                  key={image} 
                            />
                        :
                            <Image source={defaultImage} style={{width: '70%', height: '70%', aspectRatio:1,alignSelf: 'center'}} />
                    }
                    <Text style={{marginTop:20, marginLeft:20}}>Caption</Text>
                    <TextInput onChangeText={setCaption} value={caption} multiline={true} selectTextOnFocus={!postLoading} editable={!postLoading} style={{borderWidth:1,borderRadius:5, marginRight:20,marginLeft:20, borderColor:'#777',padding:8, marginTop:10}}></TextInput>
                    <Text style={{marginTop:20, marginLeft:20, marginBottom:5}}>Suggested Caption</Text>
                    {
                        suggestedCaptionLoading
                        ? 
                            <ActivityIndicator size="large" style={{marginTop:15}} />
                        :
                            suggestedCaptionError
                            ?
                                <Text style={{marginTop:20, marginLeft:20, color:'red'}}>There was an error generating a caption</Text>
                            :
                                <TouchableOpacity onPress={ () => setCaption(suggestedCaption) } style={{borderWidth:2, borderColor:'#adb5bd', marginLeft:20, marginRight:20, borderRadius: 7 }}>
                                    <Text style={{marginTop:10, marginLeft:7, marginRight: 7, marginBottom:10}}>{suggestedCaption}</Text>
                                </TouchableOpacity>
                    }
                    
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