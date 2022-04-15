import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite
import * as SplashScreen from 'expo-splash-screen'; //expo install expo-splash-screen
import * as Font from 'expo-font'; //expo install expo-font
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker'; //npm install @react-native-community/datetimepicker
//import { TouchableHighlight } from "react-native-web";
import FloatingButton from './FloatingButton';
//import {Dropdown} from 'react-native-material-dropdown';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker'; //expo install expo-image-picker
import { Asset } from 'expo-asset';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import HomeScreen from "./screens/HomeScreen";
import FoodScreen from "./screens/FoodScreen";
import FoodPicScreen from "./screens/FoodPicScreen";
import Sections from "./screens/Sections";
import Canning from "./screens/Canning";
import WishList from "./screens/WishList";
import AddItems from './screens/AddItems';
import AddSection from './screens/AddSection';
import Pantry from './screens/Pantry';
import EmptyJar from './screens/EmptyJar';
import BatchLocation from './screens/BatchLocation';
import ViewLocation from './screens/ViewLocation';



const db = SQLite.openDatabase('db'); //if app wont load after a reload change the name of the db (no clue why this happens)
const Stack = createNativeStackNavigator();
const defaultPic = Asset.fromModule(require('./assets/default.jpg')).uri;

function setupDB() {
  db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
    console.log('Foreign keys turned on')
  );

  db.transaction(tx => {

    /*
    tx.executeSql('drop table if exists CannedGoods');
    tx.executeSql('drop table if exists Jars');
    tx.executeSql('drop table if exists Batch');
    tx.executeSql('drop table if exists Shelves');
    tx.executeSql('drop table if exists Storage');

    tx.executeSql('drop table if exists Stock');
    tx.executeSql('drop table if exists Expiration');
    tx.executeSql('drop table if exists WishList');
    tx.executeSql('drop table if exists Product');
    tx.executeSql('drop table if exists Section');
    */

    tx.executeSql('create table if not exists Storage(locationID integer primary key,locationName text);');
    tx.executeSql('create table if not exists Shelves(shelfID integer primary key,locationID integer,shelfName text,foreign key (locationID) references Storage (locationID));');
    tx.executeSql('create table if not exists Batch(batchID integer primary key,product text,datePlaced text check (datePlaced glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\'),expDate text check (expDate glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\' or expDate glob \'N/A\'),shelfID integer, quantity integer check (quantity >= 0), notes text, imagePath text, foreign key (shelfID) references Shelves(shelfID));');
    tx.executeSql('create table if not exists Jars(jarID integer primary key,size text,mouth text check (mouth = \'regular\' or mouth = \'wide\'));');
    tx.executeSql('create table if not exists CannedGoods(jarID integer,batchID integer,primary key (jarID, batchID),foreign key (jarID) references Jars(jarID),foreign key (batchID) references Batch(batchID));');

    //General db
    tx.executeSql('create table if not exists Section(sectionID integer primary key, sectionName text, imagePath text);');
    tx.executeSql('create table if not exists Product(productID integer primary key, productName text, notes text, sectionID integer, foreign key (sectionID) references Section(sectionID));');
    tx.executeSql('create table if not exists WishList(batchID integer primary key, product text, foreign key (batchID) references Batch(batchID));');
    tx.executeSql('create table if not exists Expiration(productID integer primary key, expirationDate text check (expirationDate glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\' or expirationDate glob \'N/A\'),foreign key (productID) references Product (productID));');
    tx.executeSql('create table if not exists Stock(productID integer,shelfID integer,locationID integer,datePurchased text check (datePurchased glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\'),quantity integer check (quantity >= 0),primary key(productID,shelfID,locationID),foreign key (productID) references Product(productID),foreign key (shelfID, locationID) references Shelf(shelfID,locationID));');

    //dummy data
    tx.executeSql('insert into Storage values (0, \'Pantry\');');
    tx.executeSql('insert into Shelves values (0, 0, \'Shelf A\');');
    tx.executeSql('insert into Batch values (0, \'Pickles\', \'02/18/22\',\'05/27/22\', 0, 4,\'green\',\'' + defaultPic + '\');');
    tx.executeSql('insert into Batch values (1, \'Peas\', \'01/17/22\',\'03/18/23\', 0, 12,\'also green\',\'' + defaultPic + '\');');
    tx.executeSql('insert into Batch values (2, \'Walnuts\', \'01/11/22\',\'03/23/22\', 0, 123,\'\',\'' + defaultPic + '\');');
    tx.executeSql('insert into Batch values (3, \'Peanuts\', \'12/04/21\',\'03/04/22\', 0, 456,\'\',\'' + defaultPic + '\');');
    tx.executeSql('insert into Batch values (4, \'delete me\', \'12/04/21\',\'03/04/22\', 0, 456,\'\',\'' + defaultPic + '\');');

    tx.executeSql('insert into Jars values (0, \'16oz\', \'regular\');');
    tx.executeSql('insert into Jars values (1, \'20oz\', \'wide\');');
    tx.executeSql('insert into Jars values (2, \'48oz\', \'regular\');');
    tx.executeSql('insert into Jars values (3, \'12oz\', \'wide\');');

    tx.executeSql('insert into WishList values (2, \'Walnuts\');');


    //tx.executeSql('insert into CannedGoods values (0, 0);');
    //tx.executeSql('insert into CannedGoods values (1, 1);');
    //tx.executeSql('insert into CannedGoods values (2, 2);');
    //tx.executeSql('insert into CannedGoods values (3, 3);');

    //tx.executeSql('insert into CannedGoods values (2, 0);');
    //tx.executeSql('insert into CannedGoods values (0, 1);');
    //tx.executeSql('insert into CannedGoods values (0, 2);');
    //tx.executeSql('insert into CannedGoods values (0, 3);');
  })
}

export default function App() {
  //Splash screen + loading
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync(); //keep screen visible while resources load
        await Font.loadAsync({ //load font
          Avenir: require("./assets/fonts/Avenir.otf")
        });
        await setupDB();
        //await new Promise(resolve => setTimeout(resolve, 1500)); //force splash screen to stay on for 1.5 seconds
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true); //advance
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  console.log("App executed");
  return (
    <><View onLayout={onLayoutRootView}></View>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen"
          screenOptions={{
            headerStyle: { backgroundColor: 'rgba(255,180,0,1.0)' }
          }}
        >
          <Stack.Screen name="INVENTORY TRACKING APP" component={HomeScreen} />
          <Stack.Screen name="Food" component={FoodScreen} />
          <Stack.Screen name="Item" component={FoodPicScreen} />
          <Stack.Screen name="AddItems" component={AddItems} />
          <Stack.Screen name="Pantry" component={Pantry} />
          <Stack.Screen name="Canning" component={Canning} />
          <Stack.Screen name="AddSection" component={AddSection} />
          <Stack.Screen name="Sections" component={Sections} />
          <Stack.Screen name="EmptyJar" component={EmptyJar} />
          <Stack.Screen name="BatchLocation" component={BatchLocation} />
          <Stack.Screen name="ViewLocation" component={ViewLocation} />
          <Stack.Screen name="WishList" component={WishList} />
        </Stack.Navigator>
      </NavigationContainer></>
  );
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



//Returns items in a given shelf
function selectBatch(shelfID, sortBy) {
  let [items, setItems] = useState([]);
  useEffect(() => {
    let isUnfin = true;
    db.transaction((tx) => {
      tx.executeSql(
        'select batchID,product,datePlaced,expDate,notes,quantity,imagePath from Batch natural join Shelves where shelfID = ? ORDER BY ? ASC;',
        [shelfID, sortBy],
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



/*
function updateDetails(notes, quantity, expDate, batchID) { //DEPRECATED
  db.transaction((tx) => {
    tx.executeSql(
      'update Batch set notes = ?, quantity = ?, expDate = ? where batchID = ?;',
      [notes, quantity, expDate, batchID],
    )
  });
  console.log("Updated batch fields:\n  Quantity: " + quantity + "\n  ExpDate: " + expDate + "\n  Notes: " + notes);
  return (
    Alert.alert(
      "Updated",
      "",
      [
        {
          text: "OK",
        }
      ]
    )
  );
}
*/

/**
 * Returns a string in MM/DD/YY format for a given date 
 * @param {} param0 
 * @returns 
 */
function dateToStr(date) {
  function addZeroes(str) { //adds 0s to month and date to fit schema format
    if (str.length < 2) { return "0" + str; }
    else return str;
  }
  if (date + "" == 'Invalid Date') { return 'N/A'; }
  else { return ((addZeroes((date.getMonth() + 1).toString())) + '/' + (addZeroes(date.getDate().toString())) + '/' + (date.getFullYear().toString().substring(2))); }
}

//updates imagePath field
function updateImagePath(image, batchID) {
  db.transaction((tx) => {
    tx.executeSql(
      'update Batch set imagePath = ? where batchID = ?;',
      [image, batchID],
    )
  });
}



function addToWishList(batchID, product) {
  db.transaction(tx => {
    tx.executeSql(
      'insert into WishList (batchID, product) values (?,?);',
      [batchID, product]
    )
  });
  return (
    Alert.alert(
      "",
      "Item has been added",
      [{
        text: "Ok",
        onPress: console.log("Success!")
      }]
    )
  )
}



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


function insertSection(sectionName, imagePath) {
  let sectionID = 0
  db.transaction((tx) => {
    tx.executeSql(
      'select sectionID from Section;',
      [],
      (tx, results) => {
        var temp = 0;
        temp = 0
        temp = results.rows.length
        temp += 1
        sectionID = temp;
      }
    )
  });
  if (sectionName != '') {
    console.log('sectionName: ' + sectionName + '\nsectionID: ' + sectionID + '\nimagePath: ' + imagePath)
    db.transaction(tx => {
      tx.executeSql(
        'insert into Section (sectionID, sectionName, imagePath) values (?,?,?);',
        [sectionID, sectionName, imagePath]
      )
    });
    return (
      Alert.alert(
        "",
        "Section has been added",
        [{
          text: "Ok",
          onPress: console.log("Success!")
        }]
      )
    )
  } else {
    return (
      Alert.alert(
        "",
        "Enter valid name",
        [{
          text: "Ok",
          onPress: console.log("Request Valid Name"),
        }]
      )
    )
  }
};

function removeSection(sectionID) {
  console.log("removing section")
  console.log(sectionID)
  db.transaction((tx) => {
    tx.executeSql(
      'delete from Section where sectionID = ?;',
      [sectionID],
    )
    console.log("Deleting")
  });
  return (
    Alert.alert(
      "",
      "Section has been deleted",
      [{
        text: "Ok",
        onPress: console.log("Success!")
      }]
    )
  )
}



function addItem(product, expDate, shelfID, quantity, notes, imagePath) {
  var datePlaced = dateToStr(new Date());
  if (quantity === '') { quantity = 0; }

  console.log('product: ' + product + '\ndatePlaced: ' + datePlaced + '\nexpDate: ' + expDate + '\nshelfID: ' + shelfID + '\nquantity: ' + quantity + '\nnotes: ' + notes + '\nimagePath: ' + imagePath);

  if (product != '') {
    db.transaction(tx => {
      tx.executeSql('insert into Batch (product, datePlaced, expDate, shelfID, quantity, notes, imagePath) values (?, ?, ?, ?, ?, ?, ?);',
        [product, datePlaced, expDate, shelfID, quantity, notes, imagePath],
      )
    });
    /* //making sure was actually added
    db.transaction(tx => {
      tx.executeSql('select * from Batch where product = ?;',
      [product],
      (tx, results) => {
          console.log(results.rows.item(0))
      }
      )
    });
    */
    return (
      Alert.alert(
        "Product added.",
        "",
        [
          {
            text: "OK",
          }
        ]
      )
    );
  }
  else {
    return (
      Alert.alert(
        "Please enter an item name.",
        "",
        [
          {
            text: "OK",
          }
        ]
      )
    );
  }
}






const sort_Array_Alphabetically = () => {

  set_DATA(list_Items.sort());

}





/*


*/

//STYLES


const toggleStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
    alignItems: "center",
  },
  
  button: {
    backgroundColor: '#859a9b',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    justifyContent: 'flex-end',
    //marginBottom: 60, //originally was marginBottom20 with no marginTop and marginBottom 60 uncommented, feel free to revert
  },

  redButton: {
    backgroundColor: '#d43215',
    borderRadius: 20,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    justifyContent: 'flex-end',
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
  
  textAddItems: {
    textAlignVertical: 'top',
    textAlign: 'center',
    fontSize: 14,
    padding: 10,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
  },

  

  row: {
    flexDirection: "row",
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
});

export {getSection, selectBatch, dateToStr, updateImagePath, addToWishList, getWishListItems, insertSection, removeSection, addItem};
