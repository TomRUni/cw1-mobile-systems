import { Button, Input, LinearProgress } from "@rneui/themed";
import React, { useRef, useState } from "react";
import { View, Text, DeviceEventEmitter } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { sendPostRequest, sendPostUploadRequest } from "../utils/DataProcessor";
import * as SQLite from 'expo-sqlite'

// access sqlite db
const db = SQLite.openDatabase('db.appDb');

export default function UploadScreen() {
  // react state
  const [video, setVideo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const titleInput = useRef(null);

  // select video from ios library
  const pickVideo = async () => {
    setError(false);
    setSuccess(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true
    });

    if (!result.canceled) {
      // update state to include video
      setVideo(result.assets[0].uri);
    }
  };

  //select picture from ios library
  const pickImage = async () => {
    setError(false);
    setSuccess(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      // update state to include image
      setCoverImage(result.assets[0].uri);
    }
  };

  // call server to create new entry, then upload the hero image, then the video
  const uploadAll = () => {
    setUploading(true);
    if (title == "" || video == null || coverImage == null) {
      setUploading(false);
      setError(true)
      return;
    }
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM userStore WHERE key = ?', ["basicAuth"],
      (transaction, results) => {
        // get basicauth from db
          if (results.rows.length === 1) {
              const basic = results.rows._array[0].value;
              // send initial video data to server
              sendPostRequest('/movie', {
                title: title,
                description: description
              }, results.rows._array[0].value)
              .then((res) => {
                // build image POST body
                let filename =  coverImage.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

                let data = new FormData();

                data.append('file', {uri: coverImage, name: filename, type: type});

                let movieId = res.data;

                sendPostUploadRequest(`/movie/${movieId}/hero/upload`, data, basic)
                .then((res) => {
                  // build video POST body
                  let filename =  video.split('/').pop();
                  let match = /\.(\w+)$/.exec(filename);
                  let type = match ? `video/${match[1]}` : `video`;

                  let data = new FormData();

                  data.append('file', {uri: video, name: filename, type: type});

                  sendPostUploadRequest(`/movie/${movieId}/upload`, data, basic)
                  .then((res) => {
                    // reset form on final success
                    setSuccess(true);
                    setUploading(false);
                    setTitle("");
                    setDescription("");
                    setVideo(null);
                    setCoverImage(null);
                    // emit a refresh event
                    DeviceEventEmitter.emit('event.refreshData', {});
                  })
                  .catch((res) => {
                    alert(`Error Uploading! ${res.status}`);
                    setUploading(false);
                    setError(true);
                  })
                })
                .catch((res) => {
                  alert(`Error Uploading! ${res.status}`);
                  setUploading(false);
                  setError(true);
                })
              })
              .catch((res) => {
                alert(`Error Uploading! ${res.status}`);
                setUploading(false);
                setError(true);
              })
          } else {
            setUploading(false);
            setError(true);
          }
      })
    })
  };

  return (
    <View style={{padding: "2%"}} testID="upload-page">
          <Text style={{fontSize: 20}} testID="title">Upload new media</Text>
          {error ? <Text style={{color: 'red', paddingTop: "5%"}} testID="error-text">Error! Did you complete all steps?</Text> : null}
          {success ? <Text style={{color: 'green', paddingTop: "5%"}}>Uploaded succesfully!</Text> : null}
          <Text style={{paddingTop: "5%", fontSize: 16}} testID="step-one">1. Select the video</Text>
          <Button disabled={uploading} style={{paddingTop: "3%", width: "35%"}} testID="select-btn" onPress={pickVideo}>Select media</Button>
          <Text style={{paddingTop: "5%", fontSize: 16}} testID="step-two">2. Title the video</Text>
          <Input
            ref={titleInput}
            containerStyle={{paddingTop: "3%"}}
            placeholder="Video Title"
            onChangeText={(val) => {
              setTitle(val);
              setError(false);
              setSuccess(false);
            }}
            value={title}
            disabled={uploading}
            testID="title-input"
          />
          <Text style={{paddingTop: "1%", fontSize: 16}} testID="step-three">3. Add a brief description (optional)</Text>
          <Input
            ref={titleInput}
            containerStyle={{paddingTop: "3%"}}
            placeholder="Video Description"
            onChangeText={setDescription}
            value={description}
            disabled={uploading}
            testID="desc-input"
          />
          <Text style={{paddingTop: "1%", fontSize: 16}} testID="step-four">4. Select preview image</Text>
          <Button disabled={uploading} style={{paddingTop: "3%", width: "35%"}} onPress={pickImage} testID="img-btn">Select media</Button>
          {/* Show progress bar when uploading */}
          {uploading ? <LinearProgress style={{marginTop: "2%", marginBottom: "3%"}} /> : null}
          <View style={{alignItems: 'flex-end'}}>
            <Button disabled={uploading} style={{width: "45%"}} onPress={uploadAll} testID="upload-btn">Upload</Button>
          </View>
    </View>
  );
}