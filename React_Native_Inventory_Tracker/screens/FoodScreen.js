import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import * as ImagePicker from 'expo-image-picker';

const db = SQLite.openDatabase('db');

//Returns items in a given shelf
function selectBatch(sectionID, sortBy) {
  let [items, setItems] = useState([]);
  useEffect(() => {
    let isUnfin = true;
    db.transaction((tx) => {
      tx.executeSql(
        'select * from Product where sectionID = ? ORDER BY ? ASC;',
        [sectionID, sortBy],
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

//Returns sectionName
function getSectionName(sectionID){
  let [secName, setsecName] = useState('Section');

  useEffect(() => {
    let isUnfin = true;
    db.transaction((tx) => {
      tx.executeSql(
        'select sectionName from Section where sectionID = ?;',
        [sectionID],
        (tx, results) => {
          if (isUnfin) {
            setsecName(results.rows.item(0).sectionName);
          }
        }
      )
    });
    return () => isUnfin = false;
  });
  return secName;
}



//updates imagePath field
function updateImagePath(image, sectionID) {
  db.transaction((tx) => {
    tx.executeSql(
      'update Section set imagePath = ? where sectionID = ?;',
      [image, sectionID],
    )
  });
}


/**
 * The foodScreen shows the user a list of all the items that are shown in the database. The list is sorted
 * in alphabetical order and displayed. When the user clicks on an item it displays the information about the item
 * @param {} param0 
 * @returns 
 */
function FoodScreen({ route, navigation }) {
  const { sectionID } = route.params; //receive sectionID
  var sectionName = getSectionName(sectionID);
  const {show, setShow}= useState(false);

  //Returns imagePath
  const getImagePath = () => {
    useEffect(() => {
      let isUnfin = true;
      
      db.transaction((tx) => {
        tx.executeSql(
          'select imagePath from Section where sectionID = ?;',
          [sectionID],
          (tx, results) => {
            if (isUnfin) {
              setImage(results.rows.item(0).imagePath);
            }
          }
        )
      });
      return () => isUnfin = false;
    });
    //setShow(true);
  };



  const [image, setImage] = useState(getImagePath(sectionID));

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      updateImagePath(result.uri, sectionID);
      setImage(result.uri);

    }
  };

  var items = selectBatch(sectionID, 'productID'); //query db for items in shelf
  const NoItemsInSection = ({ item, navigation }) => {
    return (
      <View>
        <Text style={styles.emptyList}>
          This Section is Empty
        </Text>
      </View>
    );
  };
  return (
    <ImageBackground
      source={require('../assets/cart.jpg')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        <View styel={styles.pantryButton}>
          <Text style={styles.textHead}>ITEMS IN {sectionName.toUpperCase()}</Text>
        </View>
        <FlatList
          data={items}
          ListEmptyComponent={NoItemsInSection}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index, separators }) =>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={"#DDDDDD"}
              onPress={() => navigation.push('SectionItem', { details: item })}
            >
              <View>
                <Text style={styles.item} > {item.productName} </Text>
              </View>
            </TouchableHighlight>
          }
          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}> {section.title} </Text>}
        />

      </View>

      <View style={styles.pantryButton}>
        <TouchableHighlight onPress={ pickImage }>
          <Image
              source={{ uri: image }}
              style={{ width: 75, height: 100, position: 'relative', borderRadius: 5 }}
          />
        </TouchableHighlight>

        <TouchableOpacity style={styles.button} onPress={() => { navigation.push('AddItemsGeneral', { sectionID: sectionID, sectionName: sectionName }) }}>
          <Text style={styles.text}>ADD A NEW ITEM</Text>
          <Image source={require("../assets/plusButton.png")} />
        </TouchableOpacity>
      </View>
      <FloatingButton //This button takes ther user to the homepage 
        style={styles.floatinBtn}
        onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pantryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  textHead: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
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
  sectionHeader: {
    textAlign: "center",
    fontWeight: 'bold',
    backgroundColor: 'rgba(153,204,255,1.0)',
    fontSize: 30,
    borderWidth: 1,
    borderColor: "darkgrey",
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
  addItem: {
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
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: 'black',
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
});
export default FoodScreen;