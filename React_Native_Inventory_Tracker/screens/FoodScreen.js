import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';

import {selectBatch} from '../App';
/**
 * The foodScreen shows the user a list of all the items that are shownin the database. The list is sorted
 * in alphabetical order and displayed. When the user clicks on an item it displays the information about the item
 * @param {} param0 
 * @returns 
 */
 function FoodScreen({ route, navigation }) {
    const { shelfID } = route.params; //receive shelfID
  
    var items = selectBatch(shelfID, 'batchID'); //query db for items in shelf
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <View styel={styles.pantryButton}>
            <Text style={styles.textHead}>YOUR PANTRY:</Text>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index, separators }) =>
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor={"#DDDDDD"}
                onPress={() => navigation.push('Item', { details: item })}
              >
                <View>
                  <Text style={styles.item} > {item.product} </Text>
                </View>
              </TouchableHighlight>
            }
            renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}> {section.title} </Text>}
          />
        </View>
        <FloatingButton //This button takes ther user to the homepage 
          style={styles.floatinBtn}
          onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
        />
      </ImageBackground>
    )
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
    textHead: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    item: {
        textAlign: "auto",
        borderWidth: 5,
        borderColor: "darkgrey",
        fontSize: 30,
        color: "black",
        height: 75,
        width: 300,
    },
    sectionHeader: {
        textAlign: "center",
        fontWeight: 'bold',
        backgroundColor: 'rgba(153,204,255,1.0)',
        fontSize: 30,
        borderWidth: 1,
        borderColor: "darkgrey",
    },
    floatinBtn: {
        color: 'grey',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});
export default FoodScreen;