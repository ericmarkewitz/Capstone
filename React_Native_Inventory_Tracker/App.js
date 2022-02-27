import React, { useCallback, useEffect, useState  } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, TouchableWithoutFeedback } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite
import * as SplashScreen from 'expo-splash-screen'; //expo install expo-splash-screen
import * as Font from 'expo-font'; //expo install expo-font
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
//import { TouchableHighlight } from "react-native-web";

const db = SQLite.openDatabase('Deeb'); //if app wont load after a reload change the name of the db (no clue why this happens)

function setupDB(){

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

      </Stack.Navigator>
    </NavigationContainer></>

  );
}

const Stack = createNativeStackNavigator();

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
            <Image source={require("./assets/can.png")} />
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



function FoodScreen({ route, navigation }) {
  const { shelfID } = route.params;
  //let [IDs, setIDs] = useState(0), [products, setProducts] = useState(1);
  let [items, setItems] = useState([]);
    db.transaction((tx) => {
      tx.executeSql(
        'select batchID, product from batch natural join shelves where shelfID = '+shelfID+';',
        [],
        (tx, results) => {
          var temp = [];
          for (var i = 0; i < results.rows.length; i++){
            temp.push(results.rows.item(i));
          }
          setItems(temp);
          
        }
      )
    });
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >


      <View style={styles.container}>
        <Text>Food Screen</Text>

        <Button
          color="coral"
          title="Return Home"
          onPress={() => navigation.navigate('INVENTORY TRACKING APP')} />


        <FlatList
          data = {items}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index, separators }) => 
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={"#DDDDDD"}
              onPress={() => navigation.push('Item', { id: item.batchID })}
            >
              <View>
                <Text style={styles.item} > {item.product} </Text>
              </View>
            </TouchableHighlight>
          }

          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}> {section.title} </Text>}

        />

      </View>
    </ImageBackground>
  )
}

function FoodPicScreen({ route, navigation }) {
  const { id } = route.params;
  //var name, datePlaced, expDate, notes, quantity;
  //details[0].product = "jajaja"
  let [details, setDetails] = useState([]);
  db.transaction((tx) => {
    tx.executeSql(
      'select product,datePlaced,expDate,notes,quantity from batch where batchID = '+id+';',
      [],
      (tx, results) => {
        setDetails(results.rows.item(0));
      }
    )
  });
  //const [text, onChangeText] = React.useState(details.notes);
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
      <Text>Quantity: {details.quantity}</Text> 
      <Text>Date added: {details.datePlaced}</Text>
      <Text>Expiration Date: {details.expDate}</Text>
      <TextInput //TODO: cant edit any of these
        //value = {text}
        //onChangeText = {onChangeText}
        value = {details.notes}
        style={styles.textBox}
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
            onPress={() => console.log('the section' +sectionName+'has been added.')}
          />
      </View>
    </ImageBackground>
  );
}

function AddItems({ navigation }) {
  const [nameOfItem, setText] = useState('');
  const [quantity, setTextQuan] = useState('');
  const [expirationDate, setExpDate] = useState('');

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        <View style={styles.button}>
          <Text style={styles.textAddItems}>ADD ITEMS TO YOUR PANTRY</Text>
        </View>
        <View style={toggleStyles.container}>
          <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE NAMEOFITEM
            style={styles.input}
            placeholder="Add name of Item"
            onChangeText={(nameOfItem) => setText(nameOfItem)}
            defaultValue={nameOfItem}
          />

          <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE NAMEOFITEM
            style={styles.input}
            placeholder="Add quantity"
            onChangeText={(quantity) => setTextQuan(quantity)}
            defaultValue={quantity}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={console.log('value changes')}
            value={isEnabled}
          />
          <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE NAMEOFITEM
            style={styles.input}
            placeholder="Add expiration date"
            onChangeText={(expirationDate) => setExpDate(expirationDate)} //CHANGE TO A NEW VAR
            defaultValue={expirationDate}
          />

          <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE NAMEOFITEM
            style={styles.input}
            placeholder="Add additional info"
            onChangeText={(quantity) => setTextQuan(quantity)} //CHANGE TO A NEW VAR
            defaultValue={quantity}
          />

        </View>

        <Button
          color="coral"
          backgroundColor="darkgrey"
          title="Add Item to Inventory"
          onPress={() => console.log('the name of the item is: ' + nameOfItem + quantity)}
        />
      </View>
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
          <TouchableOpacity style={styles.button} onPress={() => { navigation.push('Food',{ shelfID: 0 }) }}> 
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
    </ImageBackground>

  );
}


function Canning({ navigation }) {

  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >

      <SafeAreaView style={styles.container}>
        <View style={styles.text}>


          <Text>const mystring = 'hello'</Text>

          <Text>mystring</Text>

          <Text>hi</Text>
          <Text>myString</Text>




        </View>
      </SafeAreaView >
    </ImageBackground>
  );
}


//STYLES


const toggleStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  }
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
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "darkgrey",
    fontSize: 30,
    color: "black",
    height: 75,
    width: 400,
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
});
