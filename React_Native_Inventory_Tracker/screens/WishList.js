import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db');


function getWishListItems() {
  const [products, setProducts] = useState('');
  db.transaction((tx) => {
    tx.executeSql(
      'select * from WishList;',
      [],
      (tx, results) => {
        var temp = [];
        for (var i = 0; i < results.rows.length; i++) {
          temp.push(results.rows.item(i));
        }
        setProducts(temp);
      }
    )
  });
  return products
}

function WishList({ navigation }) {
    const products = getWishListItems()
  
    const NoItemsInList = ({ item, navigation }) => {
      return (
        <View>
          <Text style={styles.emptyList}>
            Your Wish List is Empty
          </Text>
        </View>
      );
    };
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <FlatList
          data={products}
          ListEmptyComponent={NoItemsInList}
          keyExtractor={(item) => index}
          renderItem={({ item, index, separators }) =>
            <View>
              <Text style={styles.item}>{item.product}</Text>
            </View>
          }
        />
        <TouchableOpacity
          style={styles.addItemToWishList}
          onPress={() => navigation.navigate('Pantry')}>
          <Text style={styles.text} >Add Items</Text>
        </TouchableOpacity>
        <FloatingButton
          style={styles.floatinBtn}
          onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
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
    addItemToWishList: {
        backgroundColor: '#859a9b',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        justifyContent: 'flex-end',
        bottom: 120,
        width: "50%",
        left: 100,
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

export default WishList;