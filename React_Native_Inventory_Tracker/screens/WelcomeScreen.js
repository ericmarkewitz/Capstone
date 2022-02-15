import React from 'react';
import {ImageBackground, StyleSheet} from "react-native";

function WelcomeScreen(props){
    return(
        <ImageBackground>
            source={require('../assets/cart.jpg')}
            style={styles.background}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background{

    }
})

export default WelcomeScreen;
