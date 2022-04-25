import React, {useCallback, useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('db');

function removeSection(sectionID){
  db.transaction((tx) => {
    tx.executeSql(
      'delete from Section where sectionID = ?;',
      [sectionID],
      (tx, results) => {
        if (results.rowsAffected>0){
          console.log(results)
          return(
            Alert.alert(
              "",
              "Section has been deleted",
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

function getSection() {
  let [sections, setSection] = useState([]);
  db.transaction((tx) => {
    tx.executeSql(
      'select * from Section;',
      [],
      (tx, results) => {
        var temp = [];
        for (var i = 0; i < results.rows.length; i++) {
          temp.push(results.rows.item(i));
        }
        setSection(temp);
      }
    )
  });
  return sections
}

function Sections({ navigation }) {
    const sections = getSection()
  
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View>
          <Text style={styles.textHead}>Delete Section: </Text>
          <FlatList
            data={sections}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index, separators }) =>
              <TouchableOpacity style={styles.sections} 
                onPress={() =>
                  Alert.alert(
                    "Are you sure you want to delete this section?",
                    "You cannot undo this action.",
                    [
                      {
                        text: "No",
                      },
                      {
                        text: "Yes",
                        onPress: () => removeSection(item.sectionID)
                      }])}>
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
export {getSection};