import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, TouchableHighlight, TextInput, Switch } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
//import { TouchableHighlight } from "react-native-web";
//npm install react-navigation




export default function App() {
  console.log("App executed");
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="INVENTORY TRACKING APP" component={HomeScreen} />
        <Stack.Screen name="Food" component={FoodScreen} />
        <Stack.Screen name="FoodPic" component={FoodPicScreen} />
        <Stack.Screen name="AddItems" component={AddItems} />

      </Stack.Navigator>

    </NavigationContainer>

  );
}

const textBox = StyleSheet.create({
  input: {
    borderColor: "gray",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});


const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
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
});

function HomeScreen({ navigation }) {
  const [section, setText] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome to the inventory tracking App!</Text>
      <Text>Click below to add items or view your items...</Text>
      <Image
        source={{
          width: 200,
          height: 300,
          uri: "https://picsum.photos/200/300",
        }}
      />


      <Button
        color="coral"
        title="Add A New Section"
        onPress={() => navigation.navigate('AddItems')}
      />
      <View style={textBox.container}>
        <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE SECTION
          style={textBox.input}
          placeholder="Add section name here"
          onChangeText={(section) => setText(section)}
          defaultValue={section}
        />
      </View>

      < Button
        color="coral"
        title="View food items"
        onPress={() => navigation.navigate('Food')
        } />

      < StatusBar style="auto" />

    </SafeAreaView >

  );
}



function FoodScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Food Screen</Text>

      <Button
        color="coral"
        title="Return Home"
        onPress={() => navigation.navigate('Home')} />


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
    <View style={styles.container}>
      <Text>ADD AN ITEM</Text>
      <View style={toggleStyles.container}>
        <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE NAMEOFITEM
          style={textBox.input}
          placeholder="Add name of Item"
          onChangeText={(nameOfItem) => setText(nameOfItem)}
          defaultValue={nameOfItem}
        />
        <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE NAMEOFITEM
          style={textBox.input}
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
          style={textBox.input}
          placeholder="Add expiration date"
          onChangeText={(quantity) => setTextQuan(quantity)} //CHANGE TO A NEW VAR
          defaultValue={quantity}
        />

        <TextInput //THIS STORES THE INPUT THAT THE USER WRITES IN THE VARIABLE NAMEOFITEM
          style={textBox.input}
          placeholder="Add additional info"
          onChangeText={(quantity) => setTextQuan(quantity)} //CHANGE TO A NEW VAR
          defaultValue={quantity}
        />

      </View>

      <Button
        color="coral"
        title="Add Item to inventory"
        onPress={() => console.log('the name of the item is: ' + nameOfItem + quantity)}
      />
    </View>

  );
}

const toggleStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  }
});
