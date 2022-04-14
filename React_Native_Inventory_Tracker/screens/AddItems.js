import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'; //npm install @react-native-community/datetimepicker
import FloatingButton from '../FloatingButton';
import * as ImagePicker from 'expo-image-picker'; //expo install expo-image-picker
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Asset } from 'expo-asset';

import { dateToStr, addItem } from '../App';

const defaultPic = Asset.fromModule(require('../assets/default.jpg')).uri;

function AddItems({ navigation }) {
    const [nameOfItem, setText] = useState('');
    const [quantity, setTextQuan] = useState('');
    //const [expDate, setExpDate] = useState('');
    const [addntInfo, setaddntInfo] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
      setIsEnabled(previousState => !previousState);
      toggleExpDate(isEnabled);
    }
    //image handling
  
    const [image, setImage] = useState(defaultPic);
    const pickImage = async () => {
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
  
      if (!result.cancelled) {
  
        setImage(result.uri);
      }
    };
  
    //datePicker
    const [expDate, setExpDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false); //determines when datePicker is shown
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || expDate;
      setShow(Platform.OS === 'ios');
      setExpDate(currentDate);
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatePicker = () => {
      showMode('date');
    };
  
    //Toggle expDate between date and N/A
    const [realExpDate, setRealExpDate] = useState('N/A');
    const toggleExpDate = (isEnabled) => {
      if (isEnabled) { setRealExpDate('N/A'); }
      else { setRealExpDate(dateToStr(expDate)); }
    }
  
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View styel={styles.pantryButton}>
              <Text style={styles.textHead}>ADD ITEMS TO YOUR PANTRY</Text>
            </View>
            <Text></Text>
            <Text></Text>
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
                style={styles.space}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text>Expiration Date:</Text>
              <TouchableHighlight
                onPress={showDatePicker}
                activeOpacity={0.6}
                underlayColor={"#DDDDDD"} >
                <Text style={styles.input}>{realExpDate}</Text>
  
              </TouchableHighlight>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={expDate}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
  
              <TextInput //stores additional info in addntInfo
                style={styles.textBox}
                placeholder="Add additional info"
                onChangeText={(addntInfo) => setaddntInfo(addntInfo)}
                defaultValue={addntInfo}
              />
  
              <View style={styles.row}>
                <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
                  style={styles.button}
                  onPress=
                  {pickImage}
                //console.log('adding' + nameOfItem + ' with a quantity of ' + quantity + ' expiring on ' + expDate + ' with Additional info of:\n' + addntInfo) 
                >
                  <Text style={styles.textForAddItems}>ADD IMAGE</Text>
                </TouchableOpacity>
                {image && <Image
                  source={{ uri: image }}
                  style={{ width: 45, height: 60 }}
                />}
              </View>
  
            </View>
  
            <View style={styles.pantryButton}>
              <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
                style={styles.button}
                onPress={() => {
                  addItem(nameOfItem, realExpDate, 0, quantity, addntInfo, image)
                  //console.log('adding' + nameOfItem + ' with a quantity of ' + quantity + ' expiring on ' + expDate + ' with Additional info of:\n' + addntInfo) 
                }}>
                <Text style={styles.textForAddItems}>ADD ITEM TO INVENTORY</Text>
              </TouchableOpacity>
            </View>
  
          </View>
        </KeyboardAwareScrollView>
        <FloatingButton //This button takes ther user to the homepage 
          style={styles.floatinBtn}
          onPress={() => navigation.navigate('INVENTORY TRACKING')}
        />
  
      </ImageBackground>
    );
}

const toggleStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
});

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
    input: {
        borderColor: "gray",
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    textAddExpiration: {
        textAlignVertical: 'top',
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    space: {
        margin: 20,
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
    row: {
        flexDirection: "row",
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
    floatinBtn: {
        color: 'grey',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});

export default AddItems;