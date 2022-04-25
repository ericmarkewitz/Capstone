import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'; //npm install @react-native-community/datetimepicker
import FloatingButton from '../FloatingButton';
import * as ImagePicker from 'expo-image-picker'; //expo install expo-image-picker
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Asset } from 'expo-asset';
import * as SQLite from 'expo-sqlite';
import * as Calendar from 'expo-calendar';



const db = SQLite.openDatabase('db');

const defaultPic = Asset.fromModule(require('../assets/default.jpg')).uri;

function AddItems({ navigation }) {
  const [calId, setCalId] = useState(getCalendarId());
  const [nameOfItem, setText] = useState('');
  const [quantity, setTextQuan] = useState('');
  //const [expDate, setExpDate] = useState('');
  const [addntInfo, setaddntInfo] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [makeCalEvent, setMakeCalEvent] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    toggleExpDate(isEnabled);
  }
  const toggleMakeCalEvent = () => {
    setMakeCalEvent(previousState => !previousState);
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
  const [show, setShow] = useState(Platform.OS === 'ios'); //determines when datePicker is shown
  const [showAndroid] = useState(Platform.OS === 'android');
  const [showiOS] = useState(Platform.OS === 'ios');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || expDate;
    setShow(Platform.OS === 'ios');
    setExpDate(currentDate);
    if (isEnabled) { setRealExpDate(dateToStr(currentDate)); }
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
          <View style={styles.pantryButton}>
            <Text style={styles.textHead}>ADD A NEW BATCH</Text>
          </View>
          <Text></Text>
          <Text></Text>
          <View style={toggleStyles.container}>
            <TextInput //Stores the name of an item in nameOfItem
              style={styles.input}
              keyboardAppearance={'dark'}
              placeholder="Add name of Item"
              onChangeText={(nameOfItem) => setText(nameOfItem)}
              defaultValue={nameOfItem}
            />
            <TextInput //stores the quantitiy of an item in quantity
              style={styles.input}
              keyboardAppearance={'dark'}
              keyboardType={'number-pad'}
              placeholder="Add quantity"
              onChangeText={(quantity) => 
                {
                  setTextQuan(quantity)
                  if(quantity > 0 && quantity !== null){
                    //toggle add cans page
                    
                  }
                  else{
                    //dont need to toggle the cans page
                    
                  }
                }}
              defaultValue={quantity}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.textAddExpiration}>Would you like to add</Text>
                <Text style={styles.textAddExpiration}> an expiration date?</Text>
              </View>
              <Switch //toggle switch, if on then 
                style={styles.space}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            
            <View style={styles.row}>
              <View style={{flexDirection: 'row'}}>
                <View style={{justifyContent: 'center'}}>
                  <Text>{'Expiration Date:'}</Text>
                </View>
              </View>
              
              {(showAndroid &&
                <TouchableHighlight
                  onPress={showDatePicker}
                  activeOpacity={0.6}
                  underlayColor={"#DDDDDD"} >
                  <Text style={styles.input}>{realExpDate}</Text>
                </TouchableHighlight>
              )}

              {show && ((isEnabled && showiOS) || showAndroid) && (
                <DateTimePicker
                  style={{ width: '30%' }}
                  testID="dateTimePicker"
                  value={expDate}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}

              {showiOS && !isEnabled && (<Text>N/A</Text>)}
            </View>
            
              {show && isEnabled &&(
                <View style={{flexDirection: 'row'}}>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{justifyContent: 'center'}}>Add to Calendar</Text>
                  </View>
                  
                  <Switch //toggle switch, if on then 
                    style={styles.space}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleMakeCalEvent}
                    value={makeCalEvent}
                  />
                </View>
              )}
           
            

            <TextInput //stores additional info in addntInfo
              style={styles.textBox}
              keyboardAppearance={'dark'}
              multiline={true}
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

            </View>

          </View>

          <View style={styles.pantryButton}>
            <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
              style={styles.button}
              onPress={() => {
                addItem(nameOfItem, realExpDate, 0, quantity, addntInfo, image);
                //console.log(realExpDate);
                if((realExpDate !== 'N/A') && makeCalEvent) {
                  //console.log("creating cal event");
                  //console.log(realExpDate);
                  createCalendarEvent(realExpDate, nameOfItem, addntInfo);
                  
                }

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

function addItem(product, expDate, shelfID, quantity, notes, imagePath) {
  var datePlaced = dateToStr(new Date());
  if (quantity === '') { quantity = 0; }

  console.log('product: ' + product + '\ndatePlaced: ' + datePlaced + '\nexpDate: ' + expDate + '\nshelfID: ' + shelfID + '\nquantity: ' + quantity + '\nnotes: ' + notes + '\nimagePath: ' + imagePath);

  if (product != '') {
    db.transaction(tx => {
      tx.executeSql('insert into Batch (product, datePlaced, expDate, shelfID, quantity, notes, imagePath) values (?, ?, ?, ?, ?, ?, ?);',
        [product, datePlaced, expDate, shelfID, quantity, notes, imagePath],
      )
    });
    /* //making sure was actually added
    db.transaction(tx => {
      tx.executeSql('select * from Batch where product = ?;',
      [product],
      (tx, results) => {
          console.log(results.rows.item(0))
      }
      )
    });
    */
    return (
      Alert.alert(
        "Product added.",
        "",
        [
          {
            text: "OK",
          }
        ]
      )
    );
  }
  else {
    return (
      Alert.alert(
        "Please enter an item name.",
        "",
        [
          {
            text: "OK",
          }
        ]
      )
    );
  }
}


async function createCalendarEvent(expDate, nameOfItem, note){
  const firstAlarm = {relativeOffset: -2880};
  const secondAlarm = {relativeOffset: -10080};
  const eventName = nameOfItem + " expires";
  
  const calId = await getCalendarId();
  console.log("calid", calId);
  //console.log(expDate);
  //const formatDate = expDate.replaceAll('/', '-');
  const dateList = expDate.split('/');
  const formatDate = '20'.concat(dateList[2], '-', dateList[0], '-', dateList[1]);
  const startTime = Date.parse(formatDate) + 43200000 + 25200000 //turn it into seconds since 1970 plus 12 hours plus 5 hours
  const endTime = startTime + 3600000 //Start time + 1 hour
  const eventID = eventName.concat(' ', startTime);

  console.log("format date", formatDate);
  console.log("start time", startTime);
  console.log("end time", endTime);
  

  const calEvent = await Calendar.createEventAsync(
    calId, 
    {
      alarms: [firstAlarm, secondAlarm], 
      allDay: false, 
      availability: Calendar.Availability.FREE,
      calendarId: calId, 
      startDate: startTime, 
      id: eventID,
      endDate: endTime, 
      title: eventName,
      notes: note
    }
  );
  console.log(calEvent);
}

async function getCalendarId(){
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status === 'granted') {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    for(calendar of calendars){
      if (calendar['title'] === 'Inventory Calendar'){
        return calendar['id'];
      }
    }
    return -1
  }
}


/**
 * Returns a string in MM/DD/YY format for a given date 
 * @param {} param0 
 * @returns 
 */
 function dateToStr(date) {
  function addZeroes(str) { //adds 0s to month and date to fit schema format
    if (str.length < 2) { return "0" + str; }
    else return str;
  }
  if (date + "" == 'Invalid Date') { return 'N/A'; }
  else { return ((addZeroes((date.getMonth() + 1).toString())) + '/' + (addZeroes(date.getDate().toString())) + '/' + (date.getFullYear().toString().substring(2))); }
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
    marginBottom: 5,
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