import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite


const db = SQLite.openDatabase('db');

function BatchLocation({ navigation, route }) {
  let [shelves, setShelves] = useState([]);
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT shelfID,shelfName FROM Shelves ORDER BY shelfID;',
      [],
      (tx, results) => {
        var temp = [];
        for (var i = 0; i < results.rows.length; i++) {
          temp.push(results.rows.item(i));
        }
        setShelves(temp);
      }
    )
  });

  const EmptyPantry = ({ item }) => {
    return (
      // Flat List Item
      <Text style={styles.emptyList} onPress={() => getItem(item)}>
        Your Pantry is Empty
      </Text>
    );
  };
  return (
    <ImageBackground
      source={require('../assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View><Text style={styles.item}> Name        |        Shelf #</Text></View>
      <FlatList
        data={shelves}
        ListEmptyComponent={EmptyPantry}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index, separators }) =>
          <View>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={"darkgrey"}
              onPress={() => navigation.push('ViewLocation', { details: item })}
            //style={{flex: 1}}
            >
              <Text style={styles.item}>{item.shelfName}                     {item.shelfID} </Text>
            </TouchableHighlight>
          </View>
        }
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  emptyList: {
    top: 200,
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
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

});

export default BatchLocation;