import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';
import { createNativeStackNavigator, NativeStackView } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
//npm install react-navigation

export default function App() {
  console.log("App executed");
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Home">
        <Stack.Screen name = "Home" component = {HomeScreen} />
        <Stack.Screen name = "Food" component = {FoodScreen} />
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
  },
  item: {
    //padding: 10,
    //fontSize: 18,
    //height: 44,
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
      renderItem = {({item}) => <Text style = {styles.item}> {item} </Text>}
      renderSectionHeader = {({section}) => <Text style = {styles.sectionHeader}> {section.title} </Text> }
      keyExtractor = { (item, index) => index }
      />

    </View>
  )
}
