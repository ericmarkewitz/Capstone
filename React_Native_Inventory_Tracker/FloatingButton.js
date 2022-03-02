import React from 'react';
import { View, Image, TouchableOpacity } from "react-native";

export default props => (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
        <Image
            style={{
                backgroundColor: 'grey',
                width: 50,
                height: 50,
                borderRadius: 50,
            }}
            source={require("./assets/house.png")} />
    </TouchableOpacity>
);