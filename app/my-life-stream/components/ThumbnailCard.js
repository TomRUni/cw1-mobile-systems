import React from 'react';
import { Image, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const handlePress = (navigation, data) => {
    navigation.push('FilmScreen', { data })
};

export default ThumbnailCard = ({data}) => {
    const navigation = useNavigation();


    return (
    <TouchableOpacity onPress={() => handlePress(navigation, data)} testID='card'>
        <Card wrapperStyle={{width: Dimensions.get('window').width / 3.5}}>
            <View style={{position:"relative",alignItems:"center"}}>
                <Image
                    style={{width:"100%",height:100}}
                    resizeMode="contain"
                    source={{ uri: data.heroUri }}
                    />
                <Text numberOfLines={1} ellipsizeMode='tail' style={{textAlign: "center"}} testID={`card-${data.title}`}>
                    {data.title}
                </Text>
            </View>
        </Card>
    </TouchableOpacity>
    );
}