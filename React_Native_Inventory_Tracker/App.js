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
import DropdownMenu from 'react-native-dropdown-menu';
import DropDownPicker from 'react-native-dropdown-picker';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker'; //expo install expo-image-picker
import { Asset } from 'expo-asset';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Canning from "./screens/Canning";



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
        <Stack.Navigator initialRouteName="Home"
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
/**
 * Displays the homescreeen of the app to the user, the homescreen shows an add new section button, a view canning
 * button and a view pantry button. Each of the buttons take you to a new screen 
 * @param {} param0 
 * @returns 
 */
function HomeScreen({ navigation }) {
  const cans = selectCans('batchID');

  const sections = getSection();

  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.pantryButton}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Sections') }}>
              <Text style={styles.text}>ADD NEW SECTION</Text>
              <Image source={require("./assets/newSection.png")} />
            </TouchableOpacity>
          </View>

          <View style={styles.pantryButton}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.push('Canning', { starterCans: cans }) }}>
              <Text style={styles.text}>VIEW CANNING</Text>
              <Image source={require("./assets/can.png")} />
            </TouchableOpacity>
          </View>

          <View style={styles.pantryButton}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Pantry') }}>
              <Text style={styles.text}>VIEW PANTRY</Text>
              <Image source={require("./assets/pantry.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.pantryButton}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('WishList') }}>
              <Text style={styles.text}>Wish List</Text>
              <Image style={styles.homeWihsList} source={require("./assets/wishList.png")} />
            </TouchableOpacity>
          </View>
          <View>
            {sections.map(sections => {
              return (
                <View key={sections.sectionID}>
                  <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('WishList') }}>
                    <Text style={styles.text}>{sections.sectionName}</Text>
                    <Image source={require("./assets/newSection.png")} />
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        </ScrollView>
        < StatusBar style="auto" />
        <TouchableOpacity style={styles.editHome} //This button takes ther user to the homepage 
          onPress={() => navigation.navigate('Sections')}>
          <Text style={styles.text}>Edit</Text>
        </TouchableOpacity>
      </SafeAreaView >
    </ImageBackground>
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

/**
 * The foodScreen shows the user a list of all the items that are shownin the database. The list is sorted
 * in alphabetical order and displayed. When the user clicks on an item it displays the information about the item
 * @param {} param0 
 * @returns 
 */
function FoodScreen({ route, navigation }) {
  const { shelfID } = route.params; //receive shelfID

  var items = selectBatch(shelfID, 'batchID'); //query db for items in shelf
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        <View styel={styles.pantryButton}>
          <Text style={styles.textHead}>YOUR PANTRY:</Text>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index, separators }) =>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={"#DDDDDD"}
              onPress={() => navigation.push('Item', { details: item })}
            >
              <View>
                <Text style={styles.item} > {item.product} </Text>
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
 * Deletes Items from a batch ID
 * @param {} param0 
 * @returns 
 */
function deleteItem(batchID, navigation) {
  db.transaction((tx) => {
    tx.executeSql(
      'delete from Batch where batchID = ?;',
      [batchID],
    )
  });
  console.log("Deleted Item " + batchID);
  navigation.goBack(null);
}

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

/**
 * Lists details for an item
 * @param {} param0 
 * @returns 
 */function FoodPicScreen({ route, navigation }) {

  const { details } = route.params; //receive details



  //image handling
  const [image, setImage] = useState(details.imagePath);
  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.cancelled) {

      updateImagePath(result.uri, details.batchID);

      setImage(result.uri);
    }
  };

  //datePicker
  const [date, setDate] = useState(new Date(details.expDate));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false); //determines when datePicker is shown

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    if (details.expDate != 'N/A') { showMode('date') };

  };

  //notes and quantity
  const [notes, onChangeNotes] = React.useState(details.notes);
  const [quan, onChangeQuan] = React.useState(details.quantity + '');
  //updates quantity field
  const updateQuantity = (quantity, batchID) => {
    db.transaction((tx) => {
      tx.executeSql(
        'update Batch set quantity = ? where batchID = ?;',
        [quantity, batchID],
      )
    });
  }
  //updates expDate field
  const updateExpDate = (expDate, batchID) => {
    db.transaction((tx) => {
      tx.executeSql(
        'update Batch set expDate = ? where batchID = ?;',
        [expDate, batchID],
      )
    });
    return expDate;
  }
  //updates notes field
  const updateNotes = (notes, batchID) => {
    db.transaction((tx) => {
      tx.executeSql(
        'update Batch set notes = ? where batchID = ?;',
        [notes, batchID],
      )
    });
  }

  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <KeyboardAwareScrollView>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          scrollEnabled={false}
        >
          <Text style={styles.textHead4Item} > {details.product}  </Text>

          {image && <Image
            source={{ uri: image }}
            style={{ width: 225, height: 300 }}
          />}
          <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
            style={styles.button}
            onPress=
            {pickImage}
          //console.log('adding' + nameOfItem + ' with a quantity of ' + quantity + ' expiring on ' + expDate + ' with Additional info of:\n' + addntInfo) 
          >
            <Text style={styles.textForAddItems}>ADD/REPLACE IMAGE</Text>
          </TouchableOpacity>

          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={false}>
            <Text style={styles.text} >Quantity: </Text>

            <TextInput
              value={quan}
              onChangeText={onChangeQuan}
              onChange={updateQuantity(quan, details.batchID)}
              keyboardType="numeric"
              style={styles.borderText}

            ></TextInput>
          </KeyboardAwareScrollView>
          <Text style={styles.text} >Date added: {details.datePlaced}</Text>

          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={false}>
            <Text style={styles.text} >Expiration Date: </Text>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}

            <TouchableHighlight
              onPress={
                showDatePicker
              }
              style={{ width: 320, backgroundColor: "white" }}
              activeOpacity={0.6}
              underlayColor={"#DDDDDD"} >
              <Text style={styles.borderText} onChange={updateExpDate(dateToStr(date), details.batchID)} >{dateToStr(date)}</Text>
            </TouchableHighlight>
            <Text>selected: {date.toLocaleString()}</Text>

          </KeyboardAwareScrollView>



          <TextInput //TODO: allow changing of dateAdded (maybe)
            value={notes}
            onChangeText={onChangeNotes}
            onChange={updateNotes(notes, details.batchID)}
            style={styles.textBox}
          />

          <TouchableOpacity
            style={styles.redButton}
            title="Delete"
            onPress={() =>
              Alert.alert(
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
                            onPress: () => deleteItem(details.batchID, navigation) //NOTE/TODO: atm if you do this from foodscreen it will refresh but not canning
                          }])
                  }])}>
            <Text style={styles.textForAddItems}>DELETE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addToWishListbtn} onPress={() => addToWishList(details.batchID, details.product)}><Image style={styles.addItemToWLPic} source={require("./assets/wishList.png")} /></TouchableOpacity>
          <FloatingButton //This button takes ther user to the homepage 
            style={styles.floatinBtn}
            onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
          />
          <Text>selected: {date.toLocaleString()}</Text>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </KeyboardAwareScrollView >
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
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

function Sections({ navigation }) {
  const sections = getSection()

  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View>
        <Text style={styles.textHead}>Select Section you want to Delete</Text>
        <FlatList
          data={sections}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index, separators }) =>
            <TouchableOpacity style={styles.sections} onPress={() => { removeSection(item.sectionID) }}>
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
      source={require('./assets/cart.jpg')}
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
function getSectionID() {
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
  return sectionID
}

function insertSection(sectionName, imagePath) {
  let sectionID = getSectionID();
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

function AddSection({ navigation }) {
  const [sectionName, setSectionName] = useState('');

  //image handling
  const [image, setImage] = useState(defaultPic);
  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.cancelled) {

      setImage(result.uri);
    }
  };


  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={toggleStyles.container}>
        <View>
          <Text style={styles.textHead}>Enter Section Information</Text>
        </View>

        {image && <Image
          source={{ uri: image }}
          style={{ width: 90, height: 120 }}
        />}

        <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
          style={styles.button}
          onPress=
          {pickImage}
        //console.log('adding' + nameOfItem + ' with a quantity of ' + quantity + ' expiring on ' + expDate + ' with Additional info of:\n' + addntInfo) 
        >
          <Text style={styles.textForAddItems}>ADD IMAGE</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.inputAddSection}
          placeholder="Section Name" //ENTER NAME OF CATGEORY
          //onChangeText={(sectionName) => setText(sectionName)}
          onChangeText={(sectionName) => setSectionName(sectionName)}
          defaultValue={sectionName}
        />
        <TouchableOpacity
          style={styles.AddSection}
          onPress={() => { insertSection(sectionName, image) }}>
          <Text style={styles.text} >Add New Secction</Text>
        </TouchableOpacity>

      </View>
      <FloatingButton //This button takes ther user to the homepage 
        style={styles.floatinBtn}
        onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
      />
    </ImageBackground>
  );
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

function AddItems({ navigation }) {
  const [nameOfItem, setText] = useState('');
  const [quantity, setTextQuan] = useState('');
  //const [expDate, setExpDate] = useState('');
  const [addntInfo, setaddntInfo] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    toggleExpDate(isEnabled);
  }
  //image handling

  const [image, setImage] = useState(defaultPic);
  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.cancelled) {

      setImage(result.uri);
    }
  };

  //datePicker
  const [expDate, setExpDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false); //determines when datePicker is shown

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || expDate;
    setShow(Platform.OS === 'ios');
    setExpDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
  };

  //Toggle expDate between date and N/A
  const [realExpDate, setRealExpDate] = useState('N/A');
  const toggleExpDate = (isEnabled) => {
    if (isEnabled) { setRealExpDate('N/A'); }
    else { setRealExpDate(dateToStr(expDate)); }
  }

  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View styel={styles.pantryButton}>
            <Text style={styles.textHead}>ADD ITEMS TO YOUR PANTRY</Text>
          </View>
          <Text></Text>
          <Text></Text>
          <View style={toggleStyles.container}>
            <TextInput //Stores the name of an item in nameOfItem
              style={styles.input}
              placeholder="Add name of Item"
              onChangeText={(nameOfItem) => setText(nameOfItem)}
              defaultValue={nameOfItem}
            />
            <TextInput //stores the quantitiy of an item in quantity
              style={styles.input}
              placeholder="Add quantity"
              onChangeText={(quantity) => setTextQuan(quantity)}
              defaultValue={quantity}
            />
            <Text style={styles.textAddExpiration}>Would you like to add</Text>
            <Text style={styles.textAddExpiration}> an expiration date?</Text>
            <Switch //toggle switch, if on then 
              style={toggleStyles.space}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text>Expiration Date:</Text>
            <TouchableHighlight
              onPress={showDatePicker}
              activeOpacity={0.6}
              underlayColor={"#DDDDDD"} >
              <Text style={styles.input}>{realExpDate}</Text>

            </TouchableHighlight>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={expDate}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}

            <TextInput //stores additional info in addntInfo
              style={styles.textBox}
              placeholder="Add additional info"
              onChangeText={(addntInfo) => setaddntInfo(addntInfo)}
              defaultValue={addntInfo}
            />

            <View style={styles.row}>
              <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
                style={styles.button}
                onPress=
                {pickImage}
              //console.log('adding' + nameOfItem + ' with a quantity of ' + quantity + ' expiring on ' + expDate + ' with Additional info of:\n' + addntInfo) 
              >
                <Text style={styles.textForAddItems}>ADD IMAGE</Text>
              </TouchableOpacity>
              {image && <Image
                source={{ uri: image }}
                style={{ width: 45, height: 60 }}
              />}
            </View>

          </View>

          <View style={styles.pantryButton}>
            <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
              style={styles.button}
              onPress={() => {
                addItem(nameOfItem, realExpDate, 0, quantity, addntInfo, image)
                //console.log('adding' + nameOfItem + ' with a quantity of ' + quantity + ' expiring on ' + expDate + ' with Additional info of:\n' + addntInfo) 
              }}>
              <Text style={styles.textForAddItems}>ADD ITEM TO INVENTORY</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAwareScrollView>
      <FloatingButton //This button takes ther user to the homepage 
        style={styles.floatinBtn}
        onPress={() => navigation.navigate('INVENTORY TRACKING')}
      />

    </ImageBackground>
  );
}


function Pantry({ navigation }) {
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.pantryButton}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.push('Food', { shelfID: 0 }) }}>
            <Text style={styles.text}>VIEW INVENTORY</Text>
            <Image source={require("./assets/ViewPantry.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.pantryButton}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('AddItems') }}>
            <Text style={styles.text}>ADD A NEW ITEM</Text>
            <Image source={require("./assets/plusButton.png")} />
          </TouchableOpacity>

        </View>
        < StatusBar style="auto" />

      </SafeAreaView >
      <FloatingButton //This button takes ther user to the homepage 
        style={styles.floatinBtn}
        onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
      />
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
      source={require('./assets/cart.jpg')}
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


const sort_Array_Alphabetically = () => {

  set_DATA(list_Items.sort());

}

function BatchLocation({ navigation, route }) {
  let [shelves, setShelves] = useState([]);
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT shelfID,shelfName FROM Shelves ORDER BY shelfID;',
      [],
      (tx, results) => {
        var temp = [];
        for (var i = 0; i < results.rows.length; i++) {
          temp.push(results.rows.item(i));
        }
        setShelves(temp);
      }
    )
  });

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
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View><Text style={styles.item}> Name        |        Shelf #</Text></View>
      <FlatList
        data={shelves}
        ListEmptyComponent={EmptyPantry}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index, separators }) =>
          <View>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={"darkgrey"}
              onPress={() => navigation.push('ViewLocation', { details: item })}
            //style={{flex: 1}}
            >
              <Text style={styles.item}>{item.shelfName}                     {item.shelfID} </Text>
            </TouchableHighlight>
          </View>
        }
      />
    </ImageBackground>
  );
}

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
      source={require('./assets/cart.jpg')}
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
  space: {
    margin: 20,
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
  pantryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
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
  sectionHeader: {
    textAlign: "center",
    fontWeight: 'bold',
    backgroundColor: 'rgba(153,204,255,1.0)',
    fontSize: 30,
    borderWidth: 1,
    borderColor: "darkgrey",
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
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
  },
  textHead: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
  },
  textHead4Item: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
    paddingBottom: 20,
  },
  textForAddItems: {
    textAlign: 'center',
    fontSize: 14,

    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
  },
  textBox: {
    height: 150,
    width: 200,
    margin: 6,
    borderWidth: 1,
    borderColor: "darkgrey",
    padding: 10,
    textAlignVertical: "top",
    color: "black",
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
  textAddExpiration: {
    textAlignVertical: 'top',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
  },
  inputAddSection: {
    borderColor: "gray",
    width: "60%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'flex-end',
    marginBottom: 70,
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
  row: {
    flexDirection: "row",
  },
  borderText: {
    borderWidth: 1,
    borderColor: "darkgrey",
    justifyContent: 'center',
    textAlign: 'center',

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
  AddSection: {
    backgroundColor: '#859a9b',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    justifyContent: 'flex-end',
    top: 80,
    width: "50%",
    left: 10,
  },
  editHome: {
    backgroundColor: '#859a9b',
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    justifyContent: 'flex-end',
    marginBottom: 10,
    left: 125
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
  homeWihsList: {
    height: 150,
    width: 150,
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
  addToWishListbtn: {
    bottom: 300,
    left: 130
  },
  addItemToWLPic: {
    height: 70,
    width: 70,
  }
});