import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite
import FloatingButton from '../FloatingButton';
import DropDownPicker from 'react-native-dropdown-picker';

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

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Regular', value: 'regular' },
    { label: 'Wide', value: 'wide' }
  ]);


  return (
    <ImageBackground
      source={require('../assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={{ flex: 3 }}>
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
      </View>


      <View style={[{ flex: 2 }, { justifyContent: 'flex-start' }, { alignItems: 'center' }, { textAlign: 'center' }]}>
        <View>
          <Text>ADD NEW JAR</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={[{ flex: 1 }, { alignItems: 'flex-end' }, { flexDirection: 'column' }, { justifyContent: 'center' }]}>
            <Text style={[{ paddingRight: 10 }]}>Jar Size</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput //stores the quantitiy of an item in quantity
              style={styles.input}
              keyboardAppearance={'dark'}
              placeholder="12oz"
              onChangeText={(quantity) => {
                //setTextQuan(quantity)

              }}
            />
          </View>
        </View>

        <View style={[{ flex: 0.3 }, styles.dropdownZIndex, { width: '50%' }]}>
          <DropDownPicker
            //style={}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            theme="DARK"
            placeholder='Select Mouth Type'
            onSelectItem={(selected) => {
              //console.log(selected.value);
              setValue(selected.value);
            }}
          />



        </View>




        <TouchableOpacity style={styles.canningButton} onPress={() => console.log(db)}>
          <Text style={styles.text}>Add New Jar</Text>
        </TouchableOpacity>

      </View>

      <FloatingButton //This button takes ther user to the homepage 
        style={styles.floatinBtn}
        onPress={() => navigation.navigate('INVENTORY TRACKING')}
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

  input: {
    borderColor: "gray",
    width: "50%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'flex-end',
    marginBottom: 5,
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

  dropdownZIndex: {
    ...Platform.select({
      ios: {
        zIndex: 5
      },
    }),
    //flex: .5,
  },
});

export default EmptyJar;