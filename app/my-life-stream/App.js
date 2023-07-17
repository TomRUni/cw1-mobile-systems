import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CastButton } from 'react-native-google-cast';
import Constants from 'expo-constants'
import * as SQLite from 'expo-sqlite'

// check if running in expo go to prevent ios binary issues
const isRunningInExpoGo = Constants.appOwnership === 'expo'

import FilmScreen from './pages/FilmScreen';
import HomeStack from './pages/HomeStack';
import NotificationsScreen from './pages/NotificationsScreen';
import { useState } from 'react';
import LoginScreen from './pages/LoginScreen';
import { DeviceEventEmitter } from 'react-native';

// create navigation
const Stack = createNativeStackNavigator();
// access sqlite db
const db = SQLite.openDatabase('db.appDb');

// create table if doesnt exist
db.transaction(tx => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS userStore (key TEXT, value TEXT)'
  )
})

export default function App() {
  // react state
  const [loginComplete, setLoginComplete] = useState(false);
  
  // handle logout event
  DeviceEventEmitter.addListener('event.logout', () => {
    setLoginComplete(false);
  });

  return (
    <SafeAreaProvider>
      {!loginComplete ?
      <LoginScreen loginSuccess={setLoginComplete}/>
      :
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen" >
            <Stack.Screen name="HomeScreen" component={HomeStack} options={{ headerShown: false, headerBackTitle: 'Back' }} />
            <Stack.Screen name="FilmScreen" component={FilmScreen} options={{headerRight: () => (
                !isRunningInExpoGo ? <CastButton testID='chromecast-btn' style={{ tintColor: "black", height: 48, width: 48 }} /> : null
            )}} />
            <Stack.Screen name ="NotificationsScreen" component={NotificationsScreen} options={{title: "Notifications"}} />
        </Stack.Navigator>
      </NavigationContainer>
      }
    </SafeAreaProvider>
  );
}
