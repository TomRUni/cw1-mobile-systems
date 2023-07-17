import React from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CastButton, useCastState } from "react-native-google-cast";
import Constants from 'expo-constants'

// check if in expo go, to prevent chromecast
const isRunningInExpoGo = Constants.appOwnership === 'expo'

import HomeScreen from './HomeScreen'
import UploadScreen from './UploadScreen';
import SearchScreen from './SearchScreen';
import SettingsScreen from './SettingsScreen';

// create navbar at the bottom
const Tab = createBottomTabNavigator();

export default function HomeStack({route}) {

    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={({route}) => ({
            tabBarIcon: ({focused, colour, size}) => {
              let name;
                
              // get icon for route
              switch (route.name) {
                case "Home":
                  name = 'home';
                  break;
                case "Search":
                  name = 'search';
                  break;
                case "Upload":
                  name = 'cloud-upload';
                  break;
                case "Settings":
                  name = 'settings';
                  break;
                default:
                  name = "ios-information-circle";
                  break;
              }
              
              // if not selected, change icon style
              if (!focused) name += "-outline";
  
              return <Ionicons name={name} size={size} color={colour} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray'
          })}>
            <Tab.Screen name="Home" component={HomeScreen} options={{headerRight: () => (
                // hide in expo go because of ios issues
                !isRunningInExpoGo ? <CastButton style={{ tintColor: "black", height: 48, width: 48 }} /> : null
            )}} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Upload" component={UploadScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarBadge: 1}} />
          </Tab.Navigator>
    );
  }