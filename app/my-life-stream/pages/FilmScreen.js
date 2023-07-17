import React, { useEffect, useRef, useState } from "react";
import { View, Text, ImageBackground, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Button } from "@rneui/themed";
import { Stack } from "react-native-flex-layout";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { faChromecast } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import GoogleCast, { useRemoteMediaClient } from 'react-native-google-cast'
import { Video, Audio } from "expo-av";
import Constants from 'expo-constants'

// used to prevent issues with chromecast features on expo go
const isRunningInExpoGo = Constants.appOwnership === 'expo'


//update header title
const updateTitle = (navigation, data) => {
    useEffect(() => {
        navigation.setOptions({ title: data.title });
    }, []);
};

export default function FilmScreen({ route }) {
    //react state variables
    const videoRef = useRef(null);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [shouldPlay, setShouldPlay] = useState(false);
    const [source, setSource] = useState(null);

    // access navigation and chromecast features
    const navigation = useNavigation();
    const client = !isRunningInExpoGo ? useRemoteMediaClient() : null;

    const { data } = route.params;

    // play video on users device
    const playVideo = () => {
        setLoadingVideo(true);
        //needed to play on device that is ringer muted
        Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        setSource({uri: data.videoUri});
    };

    // play video onto connected chromecast and open the controls
    const playChromecast = () => {
        if (client) {
            client.loadMedia({
                mediaInfo: {
                    contentUrl: data.videoUri,
                    contentType: data.videType
                }
            })
            GoogleCast.showExpandedControls();
        }
    };

    // make video player fullscreen and queue to play
    const onVideoLoad = () => {
        setShouldPlay(true);
        videoRef.current?.presentFullscreenPlayer();
        videoRef.current?.playAsync();
    };

    // check if fullscreen exited
    const onFullscreenUpdate = (event) => {
        if (event.fullscreenUpdate === 3) {
            setShouldPlay(false);
            setSource(null);
            setLoadingVideo(false);
        }
    }

    //update header to film name
    updateTitle(navigation, data);

    return (
        <View style={{flex: 1}} testID="film-page">
                <ImageBackground
                        source={{uri: data.heroUri}}
                        resizeMode="cover"
                        testID="film-bg"
                        style={{flex: 1, justifyContent: 'center'}}
                        blurRadius={50} >
                    <View style={{paddingLeft: "2%"}}>
                        <Text style={{fontSize: 40, color: "white"}} testID="title">{data.title}</Text>
                        <Text style={{fontSize: 15, color: "white"}} testID="description">{data.description ? data.description : "No description found"}</Text>
                        <Stack row align="center" spacing={10} direction="row" style={{paddingTop: "3%"}}>
                            <Button color="secondary" disabled={loadingVideo} onPress={playVideo} testID="play-btn">
                                {loadingVideo ? <ActivityIndicator /> : <Ionicons name="play" color="white" />} Play
                            </Button>
                            {/* Only show if not in expo go and chromecast is connected */}
                            {client && !isRunningInExpoGo ?
                                <Button
                                    ViewComponent={LinearGradient}
                                    linearGradientProps={{
                                        colors: ['#FF9800', '#F44336'],
                                        start: { x: 0, y: 0.5 },
                                        end: { x: 1, y: 0.5 },
                                    }}
                                    testID="play-chromecast-btn"
                                    onPress={playChromecast}
                                    >
                                        <FontAwesomeIcon icon={faChromecast} color="white" style={{marginRight: "1%"}} />
                                        Play on Chromecast
                                </Button>
                            : null}
                        </Stack>
                    </View>
                </ImageBackground>
                <Video
                    ref={videoRef}
                    controls={true}
                    source={source}
                    shouldPlay={shouldPlay}
                    useNativeControls
                    onLoad={onVideoLoad}
                    onFullscreenUpdate={onFullscreenUpdate}
                /> 
        </View>
    );
}