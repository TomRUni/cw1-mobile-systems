import { Button, Input } from "@rneui/themed";
import React, { useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";

// Unused, to be implemented in future.

export default function GuestComponent({loginPress}) {
    // state for variables
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const loginRef = useRef(null);
    const passwordRef = useRef(null);


    return (
        <View style={{width: Dimensions.get('window').width / 2}}>
            <Input
                ref={loginRef}
                containerStyle={{paddingTop: "3%"}}
                placeholder="myname.my-life.stream"
                onChangeText={setLogin}
                value={login}
            />
            <Input
                ref={passwordRef}
                containerStyle={{paddingTop: "3%"}}
                placeholder="Access Code"
                onChangeText={setPassword}
                value={password}
            />
            <Button onPress={loginPress}>Login</Button>
        </View>
    );
}