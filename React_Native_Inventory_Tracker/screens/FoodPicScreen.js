import React, {useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite
import DateTimePicker from '@react-native-community/datetimepicker'; //npm install @react-native-community/datetimepicker
import FloatingButton from '../FloatingButton';
import * as ImagePicker from 'expo-image-picker'; //expo install expo-image-picker
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {dateToStr} from '../App';

const db = SQLite.openDatabase('db');

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
        source={require('../assets/cart.jpg')}
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
            <TouchableOpacity style={styles.addToWishListbtn} onPress={() => addToWishList(details.batchID, details.product)}><Image style={styles.addItemToWLPic} source={require("../assets/wishList.png")} /></TouchableOpacity>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    textHead4Item: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
        paddingBottom: 20,
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
    textForAddItems: {
        textAlign: 'center',
        fontSize: 14,
    
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    borderText: {
        borderWidth: 1,
        borderColor: "darkgrey",
        justifyContent: 'center',
        textAlign: 'center',
    
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
    addToWishListbtn: {
        bottom: 300,
        left: 130
    },
    addItemToWLPic: {
        height: 70,
        width: 70,
    },
    floatinBtn: {
        color: 'grey',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },

});

export default FoodPicScreen;