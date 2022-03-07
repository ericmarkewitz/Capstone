import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, TouchableWithoutFeedback } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite
import * as SplashScreen from 'expo-splash-screen'; //expo install expo-splash-screen
import * as Font from 'expo-font'; //expo install expo-font
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker'; //npm install @react-native-community/datetimepicker
//import { TouchableHighlight } from "react-native-web";
import FloatingButton from './FloatingButton';

const db = SQLite.openDatabase('Deeb'); //if app wont load after a reload change the name of the db (no clue why this happens)
const Stack = createNativeStackNavigator();

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
    */
    tx.executeSql('create table if not exists Storage(locationID integer primary key,locationName text);');
    tx.executeSql('create table if not exists Shelves(shelfID integer primary key,locationID integer,shelfName text,foreign key (locationID) references Storage (locationID));');
    tx.executeSql('create table if not exists Batch(batchID integer primary key,product text,datePlaced text check (datePlaced glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\'),expDate text check (expDate glob \'[0-9][0-9]/[0-9][0-9]/[0-9][0-9]\'),shelfID integer, quantity integer check (quantity >= 0), notes text,foreign key (shelfID) references Shelves(shelfID));');
    tx.executeSql('create table if not exists Jars(jarID integer primary key,size text,mouth text check (mouth = \'regular\' or mouth = \'wide\'));');
    tx.executeSql('create table if not exists CannedGoods(jarID integer,batchID integer,primary key (jarID, batchID),foreign key (jarID) references Jars(jarID),foreign key (batchID) references Batch(batchID));');

    //dummy data
    tx.executeSql('insert into Storage values (0, \'Pantry\');');
    tx.executeSql('insert into Shelves values (0, 0, \'Shelf A\');');
    tx.executeSql('insert into Batch values (0, \'Pickles\', \'02/18/22\',\'05/27/22\', 0, 4,\'green\');');
    tx.executeSql('insert into Batch values (1, \'Peas\', \'01/17/22\',\'03/18/23\', 0, 12,\'also green\');');
    tx.executeSql('insert into Batch values (2, \'Walnuts\', \'01/11/22\',\'03/23/22\', 0, 123,\'\');');
    tx.executeSql('insert into Batch values (3, \'Peanuts\', \'12/04/21\',\'03/04/22\', 0, 456,\'\');');

    tx.executeSql('insert into Jars values (0, \'16oz\', \'regular\');');
    tx.executeSql('insert into Jars values (1, \'20oz\', \'wide\');');
    tx.executeSql('insert into Jars values (2, \'48oz\', \'regular\');');
    tx.executeSql('insert into Jars values (3, \'12oz\', \'wide\');');

    //tx.executeSql('insert into CannedGoods values (0, 0);');
    //tx.executeSql('insert into CannedGoods values (1, 1);');
    //tx.executeSql('insert into CannedGoods values (2, 2);');
    //tx.executeSql('insert into CannedGoods values (3, 3);');
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
          <Stack.Screen name="EmptyJar" component={EmptyJar} />
          <Stack.Screen name="BatchLocation" component={BatchLocation} />
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
  const [section, setText] = useState('');
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.pantryButton}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('AddSection') }}>
            <Text style={styles.text}>ADD NEW SECTION</Text>
            <Image source={require("./assets/newSection.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.pantryButton}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Canning') }}>
            <Text style={styles.text}>VIEW CANNING</Text>
            <Image style={styles.cannedItem} source={require("./assets/can.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.pantryButton}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Pantry') }}>
            <Text style={styles.text}>VIEW PANTRY</Text>
            <Image source={require("./assets/pantry.png")} />
          </TouchableOpacity>
        </View>
        < StatusBar style="auto" />

      </SafeAreaView >
    </ImageBackground>
  );
}

//Returns items in a given shelf
function selectBatch(shelfID){
  let [items, setItems] = useState([]);
  useEffect(() => {
    let isUnfin = true;
    db.transaction((tx) => {
      tx.executeSql(
        'select batchID,product,datePlaced,expDate,notes,quantity from batch natural join shelves where shelfID = ?;',
        [shelfID],
        (tx, results) => {
          if (isUnfin){
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

  var items = selectBatch(shelfID); //query db for items in shelf
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        <View styel={styles.pantryButton}>
          <Text style={styles.textAddItems}>YOUR PANTRY:</Text>
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

//Updates Batch fields 
function updateDetails(notes,quantity,expDate,batchID) {
  console.log("Updated batch fields:\n  Quantity: "+quantity+"\n  ExpDate: "+expDate+"\n  Notes: "+notes);
  db.transaction((tx) => {
    tx.executeSql(
      'update Batch set notes = ?, quantity = ?, expDate = ? where batchID = ?;',
      [notes, quantity, expDate, batchID],
    )
  });
  return(
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

//Returns a string in MM/DD/YY format for a given date
function dateToStr(date){
  function addZeroes(str){ //adds 0s to month and date to fit schema format
    if (str.length < 2) { return "0"+str; }
    else return str;
  }

  return ( (addZeroes((date.getMonth()+1).toString())) +'/'+ (addZeroes(date.getDate().toString())) +'/'+ (date.getFullYear().toString().substring(2)) );
}

//Lists all items in a shelf
function FoodPicScreen({ route, navigation }) {
  const { details } = route.params; //receive details

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
    showMode('date');
  };

  //notes and quantity
  const [notes, onChangeNotes] = React.useState(details.notes);
  const [quan, onChangeQuan] = React.useState(details.quantity+'');

  return (
    <View style={styles.listContainer}>
      <Text> {details.product} </Text>
      <Image
        source={{
          width: 200,
          height: 300,
          uri: "https://www.usu.edu/today/images/stories/xl/food-preservation-UST.jpg",
        }} />
      <Button
        color="#0437A0"
        title="Replace image"
        onPress={() =>
          Alert.alert(
            "This box does nothing",
            "",
            [
              {
                text: "cancel",
              },
              {
                text: "OK",
              }
            ]
          )
        }
      />

      <View style = {styles.row}>
        <Text >Quantity: </Text>
        <TextInput
            value = {quan}
            onChangeText = {onChangeQuan}
            keyboardType= "numeric"
            style = {styles.borderText}
        ></TextInput>
      </View>

      <Text>Date added: {details.datePlaced}</Text>

      <View style = {styles.row}>
        <Text >Expiration Date: </Text>
        <TouchableHighlight 
          onPress={ showDatePicker }
          activeOpacity={0.6}
          underlayColor={"#DDDDDD"} >
          <Text style = {styles.borderText}>{dateToStr(date)}</Text>
        </TouchableHighlight>
      </View>
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

      
      <TextInput //TODO: allow changing of dateAdded (maybe), allow changing of image, automatic updates instead of pressing button (stretch goal maybe)
        value = {notes}
        onChangeText = {onChangeNotes}
        style = {styles.textBox}
      />
      <Button
        color="#0437A0"
        title="Update"
        onPress={() =>
          updateDetails(notes, quan, dateToStr(date), details.batchID)
        }
      />
      <FloatingButton //This button takes ther user to the homepage 
        style={styles.floatinBtn}
        onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
      />
    </View>


  );
}

function AddSection({ navigation }) {
  const [sectionName, setText] = useState('');
  const [expDate, setExpDate] = useState('');
  const [outStock, setOutStock] = useState('');
  const [location, setLocation] = useState('');
  const [addSection, setAddSection] = useState('');


  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={toggleStyles.container}>
        <View style={styles.button}>
          <Text>Enter Section Information</Text>
        </View>
        <TextInput
          style={styles.inputAddSection}
          placeholder="Section Name" //ENTER NAME OF CATGEORY
          onChangeText={(sectionName) => setText(sectionName)}
          defaultValue={sectionName}
        />
        <View style={toggleStyles.container}>
          <Text style={styles.textAddItems}>Section {sectionName} will be sorted by</Text>
          <Text>{outStock}</Text>
          <Text>{expDate}</Text>
          <Text>{location}</Text>
        </View>
        <View style={toggleStyles.container}>
          <Text style={styles.textAddItems}>Select Sorting Options</Text>
        </View>
        <Button
          color="coral"
          backgroundColor="darkgrey"
          title="Out of Stock"
          onPress={(outStock) => setOutStock('Out of Stock')}
        />
        <Button
          color="coral"
          backgroundColor="darkgrey"
          title="About to Expire"
          onPress={(expDate) => setExpDate('About to Expire')}
        />
        <Button
          color="coral"
          backgroundColor="darkgrey"
          title="Location"
          onPress={(location) => setLocation('Location')}
        />
        <Button
          color="coral"
          backgroundColor="darkgrey"
          title="Submit"
          onPress={() => console.log('the section' + sectionName + 'has been added.')}
        />

      </View>
      <FloatingButton //This button takes ther user to the homepage 
        style={styles.floatinBtn}
        onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
      />
    </ImageBackground>
  );
}

function AddItems({ navigation }) {
  const [nameOfItem, setText] = useState('');
  const [quantity, setTextQuan] = useState('');
  const [expDate, setExpDate] = useState('');
  const [addntInfo, setaddntInfo] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        <View styel={styles.pantryButton}>
          <Text style={styles.textAddItems}>ADD ITEMS TO YOUR PANTRY</Text>
        </View>
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
          <TextInput //stores the expiration date in expDate
            style={styles.input}
            placeholder="Add expiration date"
            onChangeText={(expDate) => setExpDate(expDate)}
            defaultValue={expDate}
          />
          <TextInput //stores additional info in addntInfo
            style={styles.input}
            placeholder="Add additional info"
            onChangeText={(addntInfo) => setaddntInfo(addntInfo)}
            defaultValue={addntInfo}
          />
        </View>
        <View style={styles.pantryButton}>
          <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
            style={styles.button}
            onPress={() => { console.log('adding' + nameOfItem + ' with a quantity of ' + quantity + ' expiring on ' + expDate + ' with Additional info of:\n' + addntInfo) }}>
            <Text style={styles.textForAddItems}>ADD ITEM TO INVENTORY</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FloatingButton //This button takes ther user to the homepage 
        style={styles.floatinBtn}
        onPress={() => navigation.navigate('INVENTORY TRACKING')}
      />
    </ImageBackground>
  );
}
/**
 * This determines if the toggle is switched to true or false
 */
function toggleTF() {
  if (isEnabled == true) {
    //then remember the expriation date
  } else {
    //do not remeber the expriation date 
  }
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


function Canning({ navigation }) {
  let [cans, setCans] = useState([]);
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT batchID, product FROM Batch;',
      [],
      (tx, results) => {
        var temp = [];
        for (var i = 0; i < results.rows.length; i++) {
          temp.push(results.rows.item(i));
        }
        setCans(temp);
      }
    )
  });


  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <SafeAreaView style={styles.container}>
        <View>
          <Text>HI</Text>
        </View>
        <View style={styles.pantryButton}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('EmptyJar') }}>
            <Text style={styles.text}>View Empty Jars</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pantryButton}>
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('BatchLocation') }}>
            <Text style={styles.text}>View Batch by Location</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={cans}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index, separator }) =>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={"darkgrey"}
              onPress={() => console.log('Item Pressed')}
            >
              <View>
                <Text style={styles.item}> Batch {item.batchID} - {item.product}</Text>
              </View>
            </TouchableHighlight>
          }
        />
        <View>
          <Text>Add Canned Item</Text>
        </View>
        <FloatingButton //This button takes ther user to the homepage 
          style={styles.floatinBtn}
          onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
        />
      </SafeAreaView >
    </ImageBackground>
  );
}

function EmptyJar({ navigation, route }) {
  let [jars, setJars] = useState([]);
    db.transaction((tx) => {
      tx.executeSql(
        'select size, mouth, count(mouth) as count from jars where jarID NOT IN (SELECT jarID FROM jars Natural JOIN CannedGoods) GROUP BY size;',
        [],
        (tx, results) => {
          var temp = [];
          for (var i = 0; i < results.rows.length; i++){
            temp.push(results.rows.item(i));
          }
          setJars(temp);
          
        }
      )
    });
    const NoEmptyJarsMessage = ({ item }) => {
      return (
        // Flat List Item
        <Text style={styles.emptyList } onPress={() => getItem(item)}>
          All jars are currently in use
        </Text>
      );
    };
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View><Text style={styles.item}>Size - Mouth - #</Text></View>
      <FlatList
            data = {jars}
            ListEmptyComponent={NoEmptyJarsMessage}
            renderItem = {({item, index, separators}) =>
             <View>
               <Text style={styles.item}>{item.size} - {item.mouth} - {item.count}</Text>
             </View>
          }
      />
    </ImageBackground>
  );
}

function BatchLocation({ navigation, route }){
  let [shelves, setShelves] = useState([]);
    db.transaction((tx) => {
      tx.executeSql(
        'select product, quantity, shelfName from Batch NATURAL JOIN SHELVES GROUP BY shelfID;',
        [],
        (tx, results) => {
          var temp = [];
          for (var i = 0; i < results.rows.length; i++){
            temp.push(results.rows.item(i));
          }
          setShelves(temp);
          
        }
      )
    });
    const EmptyPantry = ({ item }) => {
      return (
        // Flat List Item
        <Text style={styles.emptyList } onPress={() => getItem(item)}>
          Your Pantry is Empty
        </Text>
      );
    };
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View><Text style={styles.item}>Location - Product - #</Text></View>
      <FlatList
            data = {shelves}
            ListEmptyComponent={EmptyPantry}
            renderItem = {({item, index, separators}) =>
             <View>
               <Text></Text>
               <Text style={styles.item}>{item.shelfName} - {item.product} - {item.quantity}</Text>
             </View>
          }
      />
    </ImageBackground>
  );
}


//STYLES


const toggleStyles = StyleSheet.create({
  container: {
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
    marginBottom: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    justifyContent: 'flex-end',
    marginBottom: 60,

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
    margin: 12,
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
    marginBottom: 30,
    marginTop: 100,
  },
  cannedItem: {
    alignItems: "center",
    backgroundColor: "darkgrey",
    padding: 10
  },
  floatinBtn: {
    color: 'grey',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  emptyList: {
    top: 100,
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#303838"
  },
  row: {
    flexDirection: "row",
  },
  borderText: {
    borderWidth: 1,
    borderColor: "darkgrey",
    justifyContent: 'center',
    textAlign: 'center',

  }
});