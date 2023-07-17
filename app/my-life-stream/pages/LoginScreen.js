import React, { useEffect, useState } from "react";
import Lottie from 'lottie-react-native';
import { Text, View } from "react-native";
import { Tab, TabView } from '@rneui/themed';
import { Buffer } from "buffer";
import LoginComponent from "../components/LoginComponent";
import GuestComponent from "../components/GuestComponent";
import * as SQLite from 'expo-sqlite'

import { sendGetRequest } from "../utils/DataProcessor";

// access sqlite db
const db = SQLite.openDatabase('db.appDb');

export default function LoginScreen({loginSuccess}) {
    //react state
    const [index, setIndex] = useState(0);
    const [btnDisabled, setBtnDisabled] = useState(true);


    // call on first start
    useEffect(() => {
        // check if user auth already exists, if it does, attempt login
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM userStore WHERE key = ?', ["basicAuth"],
            (transaction, results) => {
                if (results.rows.length === 1) {
                    callLogin(null, null, results.rows._array[0].value);
                } else {
                    setBtnDisabled(false);  
                }
            })
        })
    }, [])

    // attempt login with the server
    const callLogin = async (user, pass, basicAuth) => {
        setBtnDisabled(true);
        sendGetRequest("/user/me", basicAuth ? basicAuth : new Buffer(user + ':' + pass).toString('base64'))
        .then((res) => {
            if (!basicAuth) {
                db.transaction(tx => {
                    // attempt to store into local database for future app opens/calling in app
                    tx.executeSql('INSERT OR IGNORE INTO userStore(key, value) VALUES (?, ?)', ["basicAuth", new Buffer(user + ':' + pass).toString('base64')],
                    (transaction, resultSet) => {
                        if (resultSet.rowsAffected === 0) {
                            console.log('Error Inserting');
                            alert('Error Storing information to the database')
                        } else {
                            console.log("Inserted credentials to db")
                        }
                    });
                })
            }
            loginSuccess(true);
        })
        .catch((res) => {
            setBtnDisabled(false);
            alert("Failed to login!");
            db.transaction(tx => {
                // failed login = delete stored auth
                tx.executeSql('DELETE FROM userStore WHERE key = ?', ["basicAuth"],
                (transaction, resultSet) => {
                    if (resultSet.rowsAffected === 1) {
                        console.log('Removed any auth');
                    } 
                });
            })
        })
    };

    return (
        <View style={{
            position: 'absolute', 
            top: 0,
            left: 0, 
            right: 0,
            bottom: 0, 
            justifyContent: 'center', 
            alignItems: 'center'}}
            testID="login-screen"
        >
            <Lottie source={require('../logo-animation.json')} loop={false} autoPlay={true} style={{width: "40%"}} testID="lottie-anim" />
            {/* Disabling due to bug in RNE causing inconsistent crashes */}
            {/* <Tab value={index} onChange={(e) => setIndex(e)} dense style={{width: "70%"}}>
                <Tab.Item>Login</Tab.Item>
                <Tab.Item>Guest User</Tab.Item>
            </Tab> */}
            <View style={{paddingTop: "5%"}}>
                {index === 0 ?
                <LoginComponent loginPress={callLogin} buttonDisabled={btnDisabled} />
                : <GuestComponent />
                }
            </View>
        </View>
    )
}