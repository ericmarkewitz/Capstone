import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db');

//Returns items in a given shelf
function getProducts() {
  let [items, setItems] = useState([]);
  useEffect(() => {
    let isUnfin = true;
    db.transaction((tx) => {
      tx.executeSql(
        
        'select * from Product ORDER BY ? ASC;',
        ['productName'], 
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

function changeSection(productID, sectionID){
    db.transaction((tx) => {
        tx.executeSql(
          'update Product set sectionID = ? where productID = ?;',
          [sectionID, productID],
          (tx, results) => {
            if (results.rowsAffected>0){
              return(
                Alert.alert(
                  "",
                  "Item was added to section",
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

function setSection(productID, sectionID){
    var current_section = 0
    db.transaction((tx) => {
        tx.executeSql(
          'select sectionID from Product where productID = ?;',
          [productID],
        
        (tx, results) => {
            current_section = results;
        }
        )
      });
    if (current_section == 0){
        changeSection(productID, sectionID);
    } else{
        return(
            Alert.alert(
              "This item already belongs to another section",
              "Would you like to move it?",
              [{
                text: "Yes",
                onPress: () => changeSection(productID, sectionID)
              },
              {
                text: "No",
            }])

        )
    }
}


/**
 * 
 * @param {} param0 
 * @returns 
 */
 function AddItemSection({ route, navigation }) {
    const { sectionID } = route.params; //receive sectionID

    var items = getProducts(); //query db for items in shelf
    const NoItemsInPantry = ({ item, navigation }) => {
      return (
        <View>
          <Text style={styles.emptyList}>
            Your Pantry is Empty
          </Text>
        </View>
      );
    };
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <View styel={styles.pantryButton}>
            <Text style={styles.textHead}>Adding Items to Section {sectionID}:</Text>
          </View>
          <FlatList
            data={items}
            ListEmptyComponent={NoItemsInPantry}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index, separators }) =>
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor={"#DDDDDD"}
                onPress={() => setSection(item.productID, sectionID)}
              >
                <View>
                  <Text style={styles.item} > {item.productName}  </Text>
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
    emptyList: {
      top: 200,
      padding: 10,
      fontSize: 18,
      textAlign: "center",
      fontWeight: "bold",
  },
  addItem: {
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
});
export default AddItemSection;