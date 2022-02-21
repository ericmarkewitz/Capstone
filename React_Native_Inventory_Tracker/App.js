import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert } from "react-native";
//import { openDatabase, SQLite } from 'react-native-sqlite-storage';
//import * as SQLite from 'expo-sqlite';
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
//import { OpenDatabase } from "./screens/OpenDatabase.js"
//import connect, {sql} from '@databases/expo';

//import WelcomeScreen from "./screens/WelcomeScreen";
//import { TouchableHighlight } from "react-native-web";
//npm install react-navigation

export default function App() {
  console.log("App executed");
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: 'rgba(255,180,0,1.0)' }
        }}
      >
        <Stack.Screen name="INVENTORY TRACKING APP" component={HomeScreen} />
        <Stack.Screen name="Food" component={FoodScreen} />
        <Stack.Screen name="FoodPic" component={FoodPicScreen} />
        <Stack.Screen name="AddItems" component={AddItems} />
        <Stack.Screen name="Pantry" component={Pantry} />
        <Stack.Screen name="Canning" component={Canning} />
        <Stack.Screen name="AddSection" component={AddSection} />

      </Stack.Navigator>

    </NavigationContainer>

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



function FoodScreen({ navigation }) {
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


        <SectionList
          sections={[
            { title: 'P', data: ['Peas', 'Pickles'] },
            { title: 'N', data: ['Nuts'] },
          ]}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index, separators }) =>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={"#DDDDDD"}
              onPress={() => navigation.push('FoodPic', { name: item })}
            >
              <View>
                <Text style={styles.item} > {item} </Text>
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
  const { name } = route.params;
  return (
    <View style={styles.listContainer}>
      <Text> {JSON.stringify(name)} </Text>
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
      <Text>
        Quantity:
        <TextInput
          placeholder=" Enter Amount"
        />
      </Text>
      <Text>
        Expiration Date:
        <TextInput
          placeholder=" Enter Date"
        />
      </Text>
      <TextInput //TODO: NOT PERSISTENT YET
        style={styles.textBox}
        placeholder="Add notes here"
      />
    </View>

  );
}

function AddSection({ navigation }) {
  const [nameOfItem, setText] = useState('');
  const [quantity, setTextQuan] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
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
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Food') }}>
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

/*
async function openDatabase(pathToDatabaseFile){
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require(pathToDatabaseFile)).uri,
    FileSystem.documentDirectory + './sql/canning.db'
  );
  return SQLite.openDatabase('canning.db');
}*/





function Canning({ navigation }) {
  //const db = connect('./sql/canning.sqlite');

  /*const db = openDatabase('./sql/canning.db');
  
  
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Storage (locationID, locationName) VALUES (?,?);", 
        [1, "FirstLocation"]
      );
    });
  }, []); */

  return (
    //<OpenDatabase />;


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
    borderWidth: 1,
    borderColor: "darkgrey",
    fontSize: 30,
    color: "slategray",
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
  },
  textAddItems: {
    textAlignVertical: 'top',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
  }
});
