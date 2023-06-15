import React, { useContext } from "react";
import { ScrollView, SafeAreaView, StyleSheet, Text, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";

const Profile = () => {

    const {userInfo, isLoading, logout} =  useContext(AuthContext);

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
                <Spinner visible={isLoading} />
                <Text>{userInfo.username}'s Profile</Text>
                <Button title='Logout' onPress={() => logout()}></Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default Profile;