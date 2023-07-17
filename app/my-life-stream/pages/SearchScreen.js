import React, { useRef, useState } from "react";
import { Button, View, Text, FlatList } from "react-native";
import { SearchBar } from '@rneui/themed';
import { sendGetRequest } from "../utils/DataProcessor";
import * as SQLite from 'expo-sqlite'

// access sqlite db
const db = SQLite.openDatabase('db.appDb');

export default function SearchScreen() {
  // react state
  const searchRef = useRef(null);
  const [value, setValue] = useState("");
  const [searchValues, setSearchValues] = useState([]);

  // get new results from server
  const updateSearch = () => {
    if (value == "") {
      setSearchValues([]);
      return;
    }
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM userStore WHERE key = ?', ["basicAuth"],
      (transaction, results) => {
        // get basic auth from db
          if (results.rows.length === 1) {
              sendGetRequest(`/movie/search?search=${value}`, results.rows._array[0].value)
              .then((res) => {
                setSearchValues(res.data.movies);
              })
              .catch((res) => {
                // if failed request new app login
                alert('Failed to send request');
                resetKeyInDatabase("basicAuth");
              })
          }
      })
    })
   }

  return (
    <View style={{display: "flex", alignItems: "center"}} testID="search-page">
          <SearchBar
            ref={searchRef}
            platform="ios"
            placeholder="Search..."
            onChangeText={setValue}
            onSubmitEditing={updateSearch}
            value={value}
            onCancel={() => {setSearchValues([])}}
            testID="search-bar"
            />
            {searchValues.length > 0 ?
            <FlatList
            data={searchValues}
            renderItem={({item}) => <ThumbnailCard data={item}/>}
            keyExtractor={item => item.id.timestamp}
            numColumns={2}
            /> : <Text style={{paddingTop: "5%", fontSize: 15}}>Type above to start searching</Text>}
    </View>
  );
}