import React from 'react';
import { FlatList, View, Text } from 'react-native';
import ThumbnailCard from './ThumbnailCard';

export default CarouselComponent = ({title, data}) => {
    return (
        <View style={{paddingTop: '2%', paddingLeft: '2%', paddingRight: '2%'}} testID='carousel'>
            {/* Renders user's movies into a list */}
            <FlatList
                data={data}
                renderItem={({item}) => <ThumbnailCard data={item}/>}
                horizontal={true}
                keyExtractor={(item) => item.id.timestamp}
            />
        </View>
    )
};