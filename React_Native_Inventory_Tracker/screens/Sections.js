import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';

import {getSection, removeSection} from '../App';


function Sections({ navigation }) {
    const sections = getSection()
  
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View>
          <Text style={styles.textHead}>Select Section you want to Delete</Text>
          <FlatList
            data={sections}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index, separators }) =>
              <TouchableOpacity style={styles.sections} onPress={() => { removeSection(item.sectionID) }}>
                <Text style={styles.text}>{item.sectionName}</Text>
              </TouchableOpacity>
            }
          />
          <TouchableOpacity
            style={styles.addToWishList}
            onPress={() => navigation.navigate('AddSection')}>
            <Text style={styles.text} >Add Section</Text>
          </TouchableOpacity>
        </View>
        <FloatingButton
          style={styles.floatinBtn}
          onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
        />
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
    textHead: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    sections: {
        textAlign: "center",
        borderWidth: 3,
        borderColor: "darkgrey",
        fontSize: 40,
        color: "black",
        height: 60,
        width: 250,
        left: 70,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    addToWishList: {
        backgroundColor: '#859a9b',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        justifyContent: 'flex-end',
        top: 200,
        width: "50%",
        left: 90,
    },
    floatinBtn: {
        color: 'grey',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    

});

export default Sections;