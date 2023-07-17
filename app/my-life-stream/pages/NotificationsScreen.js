import React from "react";
import { FlatList, Text, View } from "react-native";
import NotificationComponent from "../components/NotificationComponent";

// unused, for future implementation

export default function NotificationsScreen({route}) {
    const {data} = route.params;

    return (
        <View style={{padding: "2%"}}>
            <FlatList
                data={data}
                renderItem={({item}) => <NotificationComponent data={item} />}
                keyExtractor={item => item.id}
            />
        </View>
    )
}
