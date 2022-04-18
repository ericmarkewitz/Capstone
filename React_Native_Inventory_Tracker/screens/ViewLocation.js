import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite



const db = SQLite.openDatabase('db');

function ViewLocation({ navigation, route }) {
    const item = route.params; //receive shelfID
    const details = item.details;
    const shelfName = details.shelfName;
    const shelfID = details.shelfID;
  
    let [batches, setBatches] = useState([]);
  
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT shelfID,batchID,product,quantity FROM Batch NATURAL JOIN Shelves WHERE shelfID == ? ORDER BY batchID;',
        [shelfID],
        (tx, results) => {
          var temp = [];
          for (var i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          setBatches(temp);
        }
      )
    });
    //for() 
  
  
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
        <View>
          <View style={styles.item}>
            <Text style={{ fontSize: 30, textAlign: 'center' }}> {shelfName} </Text>
            <Text style={{ fontSize: 24 }}> BatchID | Product | Quantity </Text>
          </View>
  
  
          <FlatList
            data={batches}
            ListEmptyComponent={EmptyPantry}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index, separators }) =>
              <View>
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor={"darkgrey"}
                  onPress={() => navigation.push('Item', { details: item })}
                //style={{flex: 1}}
                >
                  <Text style={styles.item}>{item.batchID} | {item.product} | {item.quantity}</Text>
                </TouchableHighlight>
              </View>
            }
          />
        </View>
  
  
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

export default ViewLocation;