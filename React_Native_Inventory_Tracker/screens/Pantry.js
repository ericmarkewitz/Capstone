import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';


function Pantry({ navigation }) {
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.pantryButton}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.push('Food', { shelfID: 0 }) }}>
              <Text style={styles.text}>VIEW INVENTORY</Text>
              <Image source={require("../assets/ViewPantry.png")} />
            </TouchableOpacity>
          </View>
  
          <View style={styles.pantryButton}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('AddItems') }}>
              <Text style={styles.text}>ADD A NEW ITEM</Text>
              <Image source={require("../assets/plusButton.png")} />
            </TouchableOpacity>
  
          </View>
          < StatusBar style="auto" />
  
        </SafeAreaView >
        <FloatingButton //This button takes ther user to the homepage 
          style={styles.floatinBtn}
          onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
        />
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    pantryButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#859a9b',
        borderRadius: 20,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        justifyContent: 'flex-end',
        //marginBottom: 60, //originally was marginBottom20 with no marginTop and marginBottom 60 uncommented, feel free to revert
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    floatinBtn: {
        color: 'grey',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    
});
export default Pantry;