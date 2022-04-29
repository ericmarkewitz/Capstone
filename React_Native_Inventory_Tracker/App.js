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
import * as Calendar from 'expo-calendar';

import HomeScreen from "./screens/HomeScreen";
import FoodScreen from "./screens/FoodScreen";
import FoodPicScreen from "./screens/FoodPicScreen";
import Sections from "./screens/Sections";
import Canning from "./screens/Canning";
import WishList from "./screens/WishList";
import AddItems from './screens/AddItems';
import AddSection from './screens/AddSection';
import EmptyJar from './screens/EmptyJar';
import BatchLocation from './screens/BatchLocation';
import ViewLocation from './screens/ViewLocation';
import AddItemsGeneral from './screens/AddItemsGeneral';
import FoodPicScreenGeneral from "./screens/FoodPicScreenGeneral";


const db = SQLite.openDatabase('db'); //if app wont load after a reload change the name of the db (no clue why this happens)
const Stack = createNativeStackNavigator();
const defaultPic = Asset.fromModule(require('./assets/default.jpg')).uri;

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function setupCalendar(){
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Inventory Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Inventory Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}

async function checkCalendar(){
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status === 'granted') {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    for(calendar of calendars){
      if (calendar['title'] === 'Inventory Calendar'){
        return 1
      }
    }
    return 0
  }
  return -1
}

function setupDB() {
  db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
    console.log('Foreign keys turned on')
  );

  /*
  db.transaction(tx => {

    tx.executeSql('drop table if exists Stock;');
    tx.executeSql('drop table if exists Expiration;');
    tx.executeSql('drop table if exists WishList;');
    tx.executeSql('drop table if exists Product;');
    tx.executeSql('drop table if exists Section;');
    
    tx.executeSql('drop table if exists CannedGoods;');
    tx.executeSql('drop table if exists Jars;');
    tx.executeSql('drop table if exists Batch;');
    tx.executeSql('drop table if exists Shelves;');
    tx.executeSql('drop table if exists Storage;');
    
  });
  */

  //Create tables
  db.transaction(tx => {
    //Canning db
    tx.executeSql('create table if not exists Storage(locationID integer primary key,locationName text);');
    tx.executeSql('create table if not exists Shelves(shelfID integer primary key,locationID integer,shelfName text,foreign key (locationID) references Storage (locationID));');
    tx.executeSql('create table if not exists Batch(batchID integer primary key,product text,datePlaced text check (datePlaced glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\'),expDate text check (expDate glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\' or expDate glob \'N/A\'),shelfID integer, quantity integer check (quantity >= 0), notes text, imagePath text, foreign key (shelfID) references Shelves(shelfID));');
    tx.executeSql('create table if not exists Jars(jarID integer primary key,size text,mouth text check (mouth = \'regular\' or mouth = \'wide\'));');
    tx.executeSql('create table if not exists CannedGoods(jarID integer,batchID integer,primary key (jarID, batchID),foreign key (jarID) references Jars(jarID),foreign key (batchID) references Batch(batchID));');

    //General db
    tx.executeSql('create table if not exists Section(sectionID integer primary key, sectionName text, imagePath text);');
    tx.executeSql('create table if not exists Product(productID integer primary key,productName text,datePlaced text check (datePlaced glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\'),expDate text check (expDate glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\' or expDate glob \'N/A\'),sectionID integer, quantity integer check (quantity >= 0), notes text, imagePath text, foreign key (sectionID) references Section(sectionID)););');
    tx.executeSql('create table if not exists WishList(productID integer primary key, product text, foreign key (productID) references Product(productID));');
    tx.executeSql('create table if not exists Expiration(productID integer primary key, expirationDate text check (expirationDate glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\' or expirationDate glob \'N/A\'),foreign key (productID) references Product (productID));');
    tx.executeSql('create table if not exists Stock(productID integer,shelfID integer,locationID integer,datePurchased text check (datePurchased glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\'),quantity integer check (quantity >= 0),primary key(productID,shelfID,locationID),foreign key (productID) references Product(productID),foreign key (shelfID, locationID) references Shelf(shelfID,locationID));');
  });

  //Storage setup
  db.transaction(tx => {
    tx.executeSql('insert into Storage values (?,?);', [0, 'Pantry']);
    tx.executeSql('insert into Shelves values (?,?,?);', [0, 0, 'Shelf A']);
    tx.executeSql('insert into Section values (?,?,?);',[0, 'Pantry', defaultPic]);
  });

  //dummy data
  db.transaction(tx => {

    tx.executeSql('insert into Batch values (?,?,?,?,?,?,?,?);',[0, 'Pickles', '02/18/22','05/27/22', 0, 4,'Green',defaultPic]);
    tx.executeSql('insert into Batch values (?,?,?,?,?,?,?,?);',[1, 'Peas', '01/17/22','03/18/23', 0, 12,'Also green',defaultPic]);
    tx.executeSql('insert into Batch values (?,?,?,?,?,?,?,?);',[2, 'Walnuts', '01/11/22','03/23/22', 0, 123, 'Not green', defaultPic]);
    tx.executeSql('insert into Batch values (?,?,?,?,?,?,?,?);',[3, 'Peanuts', '12/04/21','03/04/22', 0, 456, '', defaultPic]);
    tx.executeSql('insert into Batch values (?,?,?,?,?,?,?,?);',[4, 'Non perishable', '12/25/19','N/A', 0, 9999, '', defaultPic]);

  });

  db.transaction(tx => {

    tx.executeSql('insert into Jars values (?,?,?);',[0, '16oz', 'regular']);
    tx.executeSql('insert into Jars values (?,?,?);',[1, '20oz', 'wide']);
    tx.executeSql('insert into Jars values (?,?,?);',[2, '48oz', 'regular']);
    tx.executeSql('insert into Jars values (?,?,?);',[3, '12oz', 'wide']);

  });

  db.transaction(tx => {

    tx.executeSql('insert into Product values (?,?,?,?,?,?,?,?);',[0, 'Pickles', '02/18/22','05/27/22', 0, 4,'Green',defaultPic]);
    tx.executeSql('insert into Product values (?,?,?,?,?,?,?,?);',[1, 'Peas', '01/17/22','03/18/23', 0, 12,'Also green',defaultPic]);

  });

  /* //Does not work because of the productID foreign key
  db.transaction(tx => {
  
    tx.executeSql('insert into WishList values (?,?);', [0,'Walnuts']);
    tx.executeSql('insert into WishList values (?,?);', [1,'Medicine']);
  });
  */

  /*
  db.transaction(tx => {
    tx.executeSql('insert into CannedGoods values (0, 0);');
    tx.executeSql('insert into CannedGoods values (1, 1);');
    tx.executeSql('insert into CannedGoods values (2, 2);');
    tx.executeSql('insert into CannedGoods values (3, 3);');

    tx.executeSql('insert into CannedGoods values (2, 0);');
    tx.executeSql('insert into CannedGoods values (0, 1);');
    tx.executeSql('insert into CannedGoods values (0, 2);');
    tx.executeSql('insert into CannedGoods values (0, 3);');
  });
  */
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
        const calendarExists = await checkCalendar();
        console.log("Calendar Exists: ", calendarExists);
        if(!calendarExists){
          await setupCalendar();
        }
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
          <Stack.Screen name="Canning" component={Canning} />
          <Stack.Screen name="AddSection" component={AddSection} />
          <Stack.Screen name="Sections" component={Sections} />
          <Stack.Screen name="EmptyJar" component={EmptyJar} />
          <Stack.Screen name="BatchLocation" component={BatchLocation} />
          <Stack.Screen name="ViewLocation" component={ViewLocation} />
          <Stack.Screen name="WishList" component={WishList} />
          <Stack.Screen name="AddItemsGeneral" component={AddItemsGeneral} />
          <Stack.Screen name="SectionItem" component={FoodPicScreenGeneral} />
        </Stack.Navigator>
      </NavigationContainer></>
  );
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