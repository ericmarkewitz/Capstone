import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite
import * as SplashScreen from 'expo-splash-screen'; //expo install expo-splash-screen
import * as Font from 'expo-font'; //expo install expo-font
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import FloatingButton from '../FloatingButton';
import DropdownMenu from 'react-native-dropdown-menu';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker'; //expo install expo-image-picker
import { Asset } from 'expo-asset';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const db = SQLite.openDatabase('db');

function Canning({ navigation, route }) {
    const starterCans = route.params.starterCans;
  
    const [open, setOpen] = useState(false);
    const [currValue, setCurrValue] = useState('batchID');
    const [items, setItems] = useState([
      { label: 'BatchID', value: 'batchID' },
      { label: 'Placement Date', value: 'datePlaced' },
      { label: 'Expiration Date', value: 'expDate' },
      { label: 'Product Name', value: 'product' }
    ]);
  
    const [isEnabled, setIsEnabled] = useState(false); //True if the switch is toggled
    let canArr = [];
  
    let bIDAsc = selectCans('batchID');
    let bIDDesc = bIDAsc.slice().reverse();
  
    let bIDAscTuple = [bIDAsc, 'batchID', 'ASC'];
    let bIDDescTuple = [bIDDesc, 'batchID', 'Desc'];
  
    canArr.push(bIDAscTuple);
    canArr.push(bIDDescTuple);
  
  
    for (let currItem of items) {
      let sortVal = currItem.value;
      if (sortVal != 'batchID') {
        let tempArr = bIDAsc.slice();
  
        let canAsc = tempArr.sort((a, b) => {
          if(sortVal === 'datePlaced' || sortVal === 'expDate'){
            if(a === 'N/A'){
              if(b === 'N/A'){
                return 0
              }
              else{
                return 1;
              }
            }
            if(b === 'N/A'){
              return -1;
            }
  
            //Dates should be format MM/DD/YY so arr will be [MM, DD, YY] 
            aStr = String(a[sortVal]);
            bStr = String(b[sortVal]);
            
            const aDates = aStr.split('/');
            const bDates = bStr.split('/');
  
            const aYears = aDates[2];
            const bYears = bDates[2];
  
            if(aYears > bYears){
              return 1;
            }
            else if(aYears < bYears){
              return -1
            }
            else{
              //This block represents if they have the same year
              const aMonths = aDates[0];
              const bMonths = bDates[0];
  
              if(aMonths > bMonths){
                return 1;
              }
              else if(aMonths < bMonths){
                return -1;
              }
              else{
                //If they have the same year and month
                const aDays = aDates[1];
                const bDays = bDates[1];
  
                if(aDays > bDays){
                  return 1;
                }
                else if(aDays < bDays){
                  return -1;
                }
                else return 0; //If they are the same date, default to prior sorting
              }
            }
          }
          else{
            //If they're not a date just use default localeCompare to sort
            return a[sortVal].localeCompare(b[sortVal]);
          }
        });
  
  
        let canDesc = canAsc.slice().reverse(); //Copys and reverses the array into descending order
  
        let ascTuple = [canAsc, sortVal, 'ASC'];
        let descTuple = [canDesc, sortVal, 'DESC'];
  
        canArr.push(ascTuple);
        canArr.push(descTuple);
      }
  
    }
  
    const [cans, setCans] = useState(starterCans);
  
  
    return ( //"View Empty Jars and "View Batch by Location" and "View Empty Jars" text breaks with more than 4 items
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.canningRow}>
            <View style={styles.canningFloatingDropdown}>
              <View style={styles.text}>
                <Text>Sort Batches By:</Text>
              </View>
              <DropDownPicker
                open={open}
                value={currValue}
                items={items}
                setOpen={setOpen}
                setValue={setCurrValue}
                setItems={setItems}
                //containerStyle={{ width: 200 }}
                onSelectItem={(item) => {
                  let currVal = item.value;
                  setCurrValue(currVal);
                  for (let i = 0; i < canArr.length; i++) {
                    let order = canArr[i][1];
                    if (order === currVal) {
                      if (isEnabled) {
                        setCans(canArr[i + 1][0]);
                      }
                      else {
                        setCans(canArr[i][0]);
                      }
                      break;
                    }
                  }
  
                }}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Text>ASC/DESC</Text>
              <Switch
                onValueChange={(newValue) => {
                  setIsEnabled(previousState => !previousState);
  
                  for (let i = 0; i < canArr.length; i++) {
                    let order = canArr[i][1];
                    if (order === currValue) {
                      if (newValue) {
                        setCans(canArr[i + 1][0]);
                        break;
                      }
                      else {
                        setCans(canArr[i][0]);
                        break;
                      }
                    }
                  }
                }
                }
                value={isEnabled}
              />
            </View>
          </View>
  
  
          <View style={styles.canningList}>
            <FlatList
              data={cans}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index, separator }) =>
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor={"darkgrey"}
                  onPress={() => navigation.push('Item', { details: item })}
                //style={{flex: 1}}
                >
                  <View>
                    <Text style={styles.canningItems}> Batch {item.batchID}: {item.product} {"\n"}                                          Placed:{item.datePlaced}{"\n"}                                          Expires:{item.expDate}</Text>
                  </View>
  
                </TouchableHighlight>
              }
            />
          </View>
  
          <View style={styles.canningAllButtons}>
  
            <TouchableOpacity style={styles.canningAddButton} onPress={() => { navigation.navigate('AddItems') }}>
              <Text style={styles.text}>Add a Batch</Text>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.canningButton} onPress={() => { navigation.navigate('EmptyJar') }}>
              <Text style={styles.text}>View Empty Jars</Text>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.canningButton} onPress={() => { navigation.navigate('BatchLocation') }}>
              <Text style={styles.text}>View Batch by Location</Text>
            </TouchableOpacity>
  
  
  
          </View>
          <View style={{ flex: 0.3 }} />
          <FloatingButton //This button takes ther user to the homepage 
            style={styles.floatinBtn}
            onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
          />
        </SafeAreaView >
      </ImageBackground>
    );
} 

//Returns all items in Batch table sorted on an input
function selectCans(sortBy) {
    let [items, setItems] = useState([]);
    useEffect(() => {
      let isUnfin = true;
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Batch ORDER BY ? ASC;',
          [sortBy],
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    canningList: {
        flex: 1.8,
    },
    canningRow: {
        top: 15,
        //padding: -50,
        flex: 0.4,
        flexDirection: "row",
        ...Platform.select({
          ios: {
            zIndex: 5
          },
        })
    },
    canningFloatingDropdown: {
        flex: 0.6,
        //padding: 10,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',  
    },
    canningItems: {
        textAlign: "auto",
        borderWidth: 5,
        borderColor: "darkgrey",
        fontSize: 15,
        color: "black",
        height: 75,
        width: 300,
    },
    canningAllButtons: {
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'center',
        textAlign: 'center',
    },
    canningAddButton: {
        top: 7,
        backgroundColor: '#859a9b',
        borderRadius: 8,
        padding: 7,

        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        justifyContent: 'flex-end',
        marginBottom: 50,
    },
    
    canningButton: {
        backgroundColor: '#859a9b',
        borderRadius: 8,
        padding: 7,
        //marginBottom: 20,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    floatinBtn: {
        color: 'grey',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },


});

export default Canning;