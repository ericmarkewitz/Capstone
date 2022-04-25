import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db');

//Returns items in a given shelf
function getWishListItems() {
  let [items, setItems] = useState([]);
  useEffect(() => {
    let isUnfin = true;
    db.transaction((tx) => {
      tx.executeSql(
        'select * from WishList;',
        [],
        (tx, results) => {
          if (isUnfin) {
            var temp = [];
            for (var i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            setItems(temp);
          }

        }
      )
    });
    return () => isUnfin = false;
  });
  return items;
}

function deleteItem(productID){
  db.transaction((tx) => {
    tx.executeSql(
      'delete from WishList where productID = ?;',
      [productID],
      (tx, results) => {
        if (results.rowsAffected>0){
          console.log(results)
          return(
            Alert.alert(
              "",
              "Item has been deleted",
              [{
                text: "Ok",
                onPress: console.log("Success!")
              }]
            )
          )
        } else{
            return (
              Alert.alert(
                "",
                "Something went wrong",
                [{
                  text: "Ok",
                  onPress: console.log("Failed!")
                }]
              )
            )
        }
      } 
    )
  }); 
  
}

/*
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
*/

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
          style={styles.table}
          data={products}
          ListEmptyComponent={NoItemsInList}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index, separators }) =>
            <TouchableOpacity onPress={()=> Alert.alert(
              "Are you sure you want to delete this item?",
              "You cannot undo this action.",
              [
                {
                  text: "No",
                },
                {
                  text: "Yes",
                  onPress: () =>
                    Alert.alert(
                      "Are you REALLY sure?",
                      "There is no going back from this.",
                      [
                        {
                          text: "Wait, take me back!",
                        },
                        {
                          text: "Yes",
                          onPress: () => deleteItem(item.productID) //NOTE/TODO: atm if you do this from foodscreen it will refresh but not canning
                        }])
                }])}>
              <Text style={styles.item}>{item.product}</Text>
            </TouchableOpacity>
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
    table:{
      top: 100,
      left:20,
    },
    emptyList: {
        top: 100,
        padding: 10,
        fontSize: 18,
        right:15,
        textAlign: "center",
        fontWeight: "bold",
    },
    item: {
        textAlign: "center",
        borderWidth: 5,
        borderColor: "#8D9797",
        backgroundColor: "#8D9797",
        fontSize: 30,
        color: "black",
        height: 75,
        width: 300,
        margin: 10,
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