import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ItemView from './ItemView';
import GenerateImage from './GenerateImage';
import Profile from './Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const Tabs = () => {
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

                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            }) }
        >
            <Tab.Screen name="Feed" component={ItemView} options={{title:'Feed'}} />
            <Tab.Screen name="Generate Image" component={GenerateImage} options={{title:'Generate Image'}} />
            <Tab.Screen name="Profile" component={Profile} options={{title:'Profile'}} />
        </Tab.Navigator>
    );
}

export default Tabs;