import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ItemView from './ItemView';
import GenerateImage from './GenerateImage';
import Profile from './Profile';
import SinglePostView from './SinglePostView';
import Search from './Search';
import SearchProfileView from './SearchProfileView';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const Tabs = () => {

    const SearchStack = createNativeStackNavigator();
    function SearchStackScreen() {
        return (
            <SearchStack.Navigator>
                <SearchStack.Screen name="Search" component={Search} options={{headerShown: false}} />
                <SearchStack.Screen name="Search Profile View" component={SearchProfileView} />
            </SearchStack.Navigator>
        )
    }

    const ProfileStack = createNativeStackNavigator();
    function ProfileStackScreen() {
        return (
            <ProfileStack.Navigator>
                <ProfileStack.Screen name="Profile" component={Profile} options={{headerShown: false}} />
                <ProfileStack.Screen name="Post" component={SinglePostView} />
            </ProfileStack.Navigator>
        );
    }

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    if (route.name === 'Generate Image') {
                        iconName = focused ? 'ios-image' : 'ios-image-outline';
                    } else if (route.name === 'Feed') {
                        iconName = focused ? 'ios-planet' : 'ios-planet-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'ios-person' : 'ios-person-outline';
                    }
                    else if (route.name === 'Search') {
                        iconName = focused ? 'ios-search' : 'ios-search-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            }) }
        >
            <Tab.Screen name="Feed" component={ItemView} options={{title:'Feed'}} />
            <Tab.Screen name="Generate Image" component={GenerateImage} options={{title:'Generate Image'}} />
            <Tab.Screen name="Search" component={SearchStackScreen} options={{title:'Search'}} />
            <Tab.Screen name="Profile" component={ProfileStackScreen} options={{title:'Profile'}} />
        </Tab.Navigator>
    );
}

export default Tabs;