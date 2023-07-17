import React, { useEffect, useState } from "react";
import { Button, View, Text, DeviceEventEmitter } from "react-native";
import * as SQLite from 'expo-sqlite'

import CarouselComponent from "../components/CarouselComponent";
import { resetKeyInDatabase, sendGetRequest } from "../utils/DataProcessor";

// access sqqlite locally
const db = SQLite.openDatabase('db.appDb');

export default function HomeScreen() {
  //react state
  const [data, setData] = useState([[]]);

  //listen for event from other components, to make a request to the backend again
  DeviceEventEmitter.addListener('event.refreshData', () => {
    fetchData();
  });

  // access data from the server
  const fetchData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM userStore WHERE key = ?', ["basicAuth"],
      (transaction, results) => {
        // find basicAuth from local database
          if (results.rows.length === 1) {
              sendGetRequest(`/movie`, results.rows._array[0].value)
              .then((res) => {
                let chunks = [];
                // split down so many films go onto many lines, as to not create one long scrolling component
                for(var i = 0; i < res.data.movies.length; i += 4) {
                  chunks.push(res.data.movies.slice(i, i+4));
                }
                setData(chunks);
              })
              .catch((res) => {
                // reset basicAuth if request fails
                resetKeyInDatabase("basicAuth");
              })
          }
      })
    })
  }

  useEffect(() => {
    // on first load call the server
    fetchData();
  }, []);


  return (
    <View style={{padding: "2%"}} testID="home-page">
          <Text style={{fontSize: 20}} testID="home-title">My Library</Text>
          {data.map((item, i) => <CarouselComponent key={i} data={item} />)}
    </View>
  );
}