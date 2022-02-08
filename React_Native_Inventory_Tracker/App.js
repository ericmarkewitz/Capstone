import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, Button } from "react-native";
import { openDatabase } from 'react-native-sqlite-storage';

export default function App() {
  console.log("App executed");

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

      <Text></Text>

      <Button
        color= "coral"
        title= "Add A New Section"
        onPress={() => alert('Section Selected')}/>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
