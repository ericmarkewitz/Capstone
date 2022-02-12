import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, TouchableHighlight } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
//import { TouchableHighlight } from "react-native-web";
//npm install react-navigation

export default function App() {
  console.log("App executed");
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Home">
        <Stack.Screen name = "Home" component = {HomeScreen} />
        <Stack.Screen name = "Food" component = {FoodScreen} />
        <Stack.Screen name = "FoodPic" component = {FoodPicScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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

function HomeScreen({ navigation }){
  return (
    <SafeAreaView style={styles.container}>
      <Text>Inventory Tracking App</Text>
      <Text></Text>

      <Image
        source={{
          width: 200,
          height: 300,
          uri: "https://picsum.photos/200/300",
        }}
      />

      <Button
        color= "coral"
        title= "Add A New Section"
        onPress={() => alert('Section Selected')}/>

      <Button
        color= "coral"
        title= "View food items"
        onPress={() => navigation.navigate('Food')}/>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function FoodScreen({ navigation }){
  return(
    <View style={styles.container}>
      <Text>Food Screen</Text>

      <Button
        color= "coral"
        title= "Return Home"
        onPress={() => navigation.navigate('Home')}/>
        

      <SectionList
      sections={[
        {title: 'P', data: ['Peas','Pickles']},
        {title: 'N', data: ['Nuts']},
      ]}
      keyExtractor = { (item, index) => index }
      renderItem = {({item, index, separators}) => 
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={"#DDDDDD"}
          onPress={() => navigation.navigate('FoodPic')}
          >
        <View>
          <Text style = {styles.item} > {item} </Text>
        </View>
        </TouchableHighlight>
      }
      
      renderSectionHeader = {({section}) => <Text style = {styles.sectionHeader}> {section.title} </Text> }
      
      />

    </View>
  )
}

function FoodPicScreen(){
  return(
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