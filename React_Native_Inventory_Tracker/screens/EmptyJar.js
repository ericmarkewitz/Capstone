import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite

const db = SQLite.openDatabase('db');


function EmptyJar({ navigation, route }) {
    let [jars, setJars] = useState([]);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT jarID, size, mouth, count(mouth) as count FROM jars WHERE jarID NOT IN (SELECT jarID FROM jars Natural JOIN CannedGoods) GROUP BY size;',
        [],
        (tx, results) => {
          var temp = [];
          for (var i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          setJars(temp);
  
        }
      )
    });
    const NoEmptyJarsMessage = ({ item }) => {
      return (
        // Flat List Item
        <Text style={styles.emptyList} onPress={() => getItem(item)}>
          All jars are currently in use
        </Text>
      );
    };
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.item}><Text style={{ fontSize: 28 }}>Size - Mouth - Quantity</Text></View>
        <FlatList
          data={jars}
          ListEmptyComponent={NoEmptyJarsMessage}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index, separators }) =>
            <View>
              <Text style={[styles.item, { fontSize: 26 }]}>{item.size} - {item.mouth} - {item.count}</Text>
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

export default EmptyJar;