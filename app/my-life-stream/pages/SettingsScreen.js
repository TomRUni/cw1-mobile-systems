import React from "react";
import { View, Text, TouchableOpacity, Button, DeviceEventEmitter } from "react-native";
import { Divider } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite' 

// acesss sqlite db
const db = SQLite.openDatabase('db.appDb');

export default function SettingsScreen({route}) {
  // access underlying navigation
  const navigation = useNavigation();

  // open notification screen
  const handlePress = () => {
    navigation.push('NotificationsScreen', { data: [] })
  };

  // function for user pushing logout
  const logout = () => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM userStore WHERE key = ?', ["basicAuth"],
      (transaction, resultSet) => {
        // get basicauth from db
          if (resultSet.rowsAffected === 1) {
              console.log('Removed any auth');
              // emit logged out event
              DeviceEventEmitter.emit("event.logout", {});
          } 
      });
    })
  };

  return (
    <View style={{padding: "2%"}} testID="settings-page">
          <Text style={{fontSize: 20}}>Settings</Text>
          <Divider width={1} style={{marginBottom: 10, marginTop: 10}} />
          <TouchableOpacity onPress={() => {
            handlePress()
          }}>
            <View style={{width: "100%", flexDirection: "row"}}>
              <Text style={{fontSize: 22, verticalAlign: "middle"}}><Ionicons name="notifications" color="black" size={30} />Notifications</Text>
            </View>
          </TouchableOpacity>
          <Divider width={1} style={{marginBottom: 10, marginTop: 10}} />
          <Button
            title="Logout"
            testID="logout"
            onPress={logout}
          />
    </View>
  );
}