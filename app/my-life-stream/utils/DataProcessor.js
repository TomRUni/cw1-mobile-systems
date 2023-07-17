import axios from "axios";
import * as SQLite from 'expo-sqlite'
import { DeviceEventEmitter } from "react-native";
import Constants from "expo-constants";

const hostUrl = Constants.expoConfig.hostUri;

// access sqlite db
const db = SQLite.openDatabase('db.appDb');

// base server url
const BASE_URL = `http://${hostUrl ? hostUrl.split(':').shift() : "localhost"}:8080`

// get function to send requests, returns a promise, resolves or rejects
export function sendGetRequest(path, basicAuth) {
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}${path}`, {
        headers: {
            'Authorization': `Basic ${basicAuth}`
        }
        }).then(res => {
            if (res.status.toString().startsWith("2")) {
                resolve({status: res.status, data: res.data});
            } else {
                reject({status: res.status, data: res.data});
            }
        }).catch((e) => {
            reject({status: e.response.status, data: e.response.data});
        })
    });
}

// post function to send requests, returns a promise, resolves or rejects
export function sendPostRequest(path, body, basicAuth) {
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}${path}`, body, {
            headers: {
                'Authorization': `Basic ${basicAuth}`
            }
        }).then(res => {
            if (res.status.toString().startsWith("2")) {
                resolve({status: res.status, data: res.data});
            } else {
                reject({status: res.status, data: res.data});
            }
        }).catch((e) => {
            reject({status: e.response.status, data: e.response.data});
        })
    });
}

// post function to send requests, specifies a type of multipart returns a promise, resolves or rejects
export function sendPostUploadRequest(path, body, basicAuth) {
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}${path}`, body, {
            headers: {
                "Authorization": `Basic ${basicAuth}`,
                "Content-Type": 'multipart/form-data'
            }
        }).then(res => {
            if (res.status.toString().startsWith("2")) {
                resolve({status: res.status, data: res.data});
            } else {
                reject({status: res.status, data: res.data});
            }
        }).catch((e) => {
            reject({status: e.response.status, data: e.response.data});
        })
    });
}

// reset stored key in database
export function resetKeyInDatabase(key) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM userStore WHERE key = ?', [key],
            (transaction, resultSet) => {
                if (resultSet.rowsAffected === 1) {
                    if (key == "basicAuth") {
                        // if basicauth, send a logout event to app component
                        DeviceEventEmitter.emit('event.logout', {});
                    }
                    resolve();
                } else {
                    reject();
                }
            });
        })
    });
}