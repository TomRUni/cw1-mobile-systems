import { Button, Divider } from "@rneui/themed";
import React from "react";
import { Text, View } from "react-native";

export default function NotificationComponent({data}) {
    // unused, future implementation for guest viewing

    const handleAccept = () => {

    };

    const handleDecline = () => {

    };
    
    return (
        <View style={{width: "100%"}}>
            <Divider width={1} />
            <View style={{width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <Text>{data.name} would like viewing access!    </Text>
                <Button style={{marginHorizontal: "2%", marginVertical: "4%"}} onPress={handleAccept}>Accept</Button>
                <Button color="error" style={{marginHorizontal: "2%", marginVertical: "4%"}} onPress={handleDecline}>Decline</Button>
            </View>
            <Divider width={1} />
        </View>
    )
}