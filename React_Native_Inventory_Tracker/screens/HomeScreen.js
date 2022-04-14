import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite

import {getSection} from '../App'; 

/**
 * Displays the homescreeen of the app to the user, the homescreen shows an add new section button, a view canning
 * button and a view pantry button. Each of the buttons take you to a new screen 
 * @param {} param0 
 * @returns 
 */
 function HomeScreen({ navigation }) {
  
    const sections = getSection();
  
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.pantryButton}>
              <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Sections') }}>
                <Text style={styles.text}>ADD NEW SECTION</Text>
                <Image source={require("../assets/newSection.png")} />
              </TouchableOpacity>
            </View>
  
            <View style={styles.pantryButton}>
              <TouchableOpacity style={styles.button} onPress={() => { navigation.push('Canning') }}>
                <Text style={styles.text}>VIEW CANNING</Text>
                <Image source={require("../assets/can.png")} />
              </TouchableOpacity>
            </View>
  
            <View style={styles.pantryButton}>
              <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Pantry') }}>
                <Text style={styles.text}>VIEW PANTRY</Text>
                <Image source={require("../assets/pantry.png")} />
              </TouchableOpacity>
            </View>
            <View style={styles.pantryButton}>
              <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('WishList') }}>
                <Text style={styles.text}>Wish List</Text>
                <Image style={styles.homeWishList} source={require("../assets/wishList.png")} />
              </TouchableOpacity>
            </View>
            <View>
              {sections.map(sections => {
                return (
                  <View key={sections.sectionID}>
                    <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('WishList') }}>
                      <Text style={styles.text}>{sections.sectionName}</Text>
                      <Image source={require("../assets/newSection.png")} />
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          </ScrollView>
          < StatusBar style="auto" />
          <TouchableOpacity style={styles.editHome} //This button takes ther user to the homepage 
            onPress={() => navigation.navigate('Sections')}>
            <Text style={styles.text}>Edit</Text>
          </TouchableOpacity>
        </SafeAreaView >
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
    homeWishList: {
        height: 150,
        width: 150,
    },
    editHome: {
        backgroundColor: '#859a9b',
        borderRadius: 30,
        padding: 10,
        marginBottom: 20,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        justifyContent: 'flex-end',
        marginBottom: 10,
        left: 125
    },
    

});
export default HomeScreen;