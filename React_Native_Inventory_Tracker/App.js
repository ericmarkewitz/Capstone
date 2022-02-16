import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, TouchableHighlight, TextInput, Switch, ImageBackground } from "react-native";
import { openDatabase, SQLite} from 'react-native-sqlite-storage';
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
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
      </Stack.Navigator>

    </NavigationContainer>

  );
}

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    //paddingTop: 2,
    //paddingLeft: 10,
    //paddingRight: 10,
    //paddingBottom: 2,
    //fontSize: 14,
    textAlign: "center",
    fontWeight: 'bold',
    backgroundColor: 'rgba(153,204,255,1.0)',
    fontSize: 30,
    borderWidth: 1,
    borderColor: "darkgrey",
  },
  item: {
    //padding: 10,
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
  },
});

function HomeScreen({ navigation }) {
  const [section, setText] = useState('');
  return (
    <ImageBackground
        source={require('./assets/cart.jpg')}
        style={{width: '100%', height: '100%'}}
    >




        <SafeAreaView style={styles.container}>


          <Text>Welcome to the inventory tracking App!</Text>
          <Text>Click below to add new sections or view existing ones...</Text>
          <Text></Text>
          <Text></Text>


          <View style={styles.container}>
            <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE SECTION
              style={styles.input}
              placeholder="Add section name here"
              onChangeText={(section) => setText(section)}
              defaultValue={section}
            />

          <Button
            color="#0437A0"
            title="Add A New Section"
            onPress={() => console.log("Now add a new section")}
          />
          </View>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>

          <View style ={{backgroundColor: "#B8B5A3", borderRadius: 5}}>
          < Button
            color="#0437A0"
            title="Pantry"
            onPress={() => navigation.navigate('Pantry')
            } />
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
          style={{width: '100%', height: '100%'}}
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
            onPress={() => navigation.navigate('FoodPic')}
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

function FoodPicScreen() {
  return (
    <View style={styles.container}>
      <Text>Food!</Text>
      <Image
        source={{
          width: 200,
          height: 300,
          uri: "https://www.usu.edu/today/images/stories/xl/food-preservation-UST.jpg",
        }} />
    </View>
  );
}

function AddItems({ navigation }) {
  const [nameOfItem, setText] = useState('');
  const [quantity, setTextQuan] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{width: '100%', height: '100%'}}
    >
    <View style={styles.container}>
      <Text>Add to Groceries</Text>
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
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE NAMEOFITEM
          style={styles.input}
          placeholder="Add expiration date"
          onChangeText={(quantity) => setTextQuan(quantity)} //CHANGE TO A NEW VAR
          defaultValue={quantity}
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
        title="Add Item to Inventory"
        onPress={() => console.log('the name of the item is: ' + nameOfItem + quantity)}
      />
    </View>
    </ImageBackground>
  );
}

function Pantry({ navigation }) {
  const [nameOfItem, setText] = useState('');
  const [quantity, setTextQuan] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <ImageBackground
      source={require('./assets/cart.jpg')}
      style={{width: '100%', height: '100%'}}
    >
    <View style={styles.container}>

    < Button
      color="#0437A0"
      title="View Inventory"
      onPress={() => navigation.navigate('Food')
      } />

    <Button
      style ={{borderRadius: 20}}
      color="#0437A0"
      title="Add A New Item"
      onPress={() => navigation.navigate('AddItems')}
    />

    </View>
    </ImageBackground>
  );
}




const toggleStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  }
});
