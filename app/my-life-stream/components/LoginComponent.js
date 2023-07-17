import { Button, Input } from "@rneui/themed";
import React, { useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";

export default function LoginComponent({loginPress, buttonDisabled}) {
    // state for variables
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const loginRef = useRef(null);
    const passwordRef = useRef(null);

    //used to consume login data and then call back 

    return (
        <View style={{width: Dimensions.get('window').width / 2}}>
            <Input
                ref={loginRef}
                containerStyle={{paddingTop: "3%"}}
                placeholder="Username"
                onChangeText={setLogin}
                value={login}
                testID="username"
            />
            <Input
                ref={passwordRef}
                containerStyle={{paddingTop: "3%"}}
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry={true} 
                value={password}
                testID="password"
            />
            <Button disabled={buttonDisabled} testID="login-btn" onPress={() => {
                loginPress(login, password);
            }}>Login</Button>
        </View>
    );
}