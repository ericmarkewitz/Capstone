import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Switch, ImageBackground, Alert, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import FloatingButton from '../FloatingButton';
import * as ImagePicker from 'expo-image-picker'; //expo install expo-image-picker
import { Asset } from 'expo-asset';

import { insertSection } from '../App';

const defaultPic = Asset.fromModule(require('../assets/default.jpg')).uri;

function AddSection({ navigation }) {
    const [sectionName, setSectionName] = useState('');
  
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
  
  
    return (
      <ImageBackground
        source={require('../assets/cart.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={toggleStyles.container}>
          <View>
            <Text style={styles.textHead}>Enter Section Information</Text>
          </View>
  
          {image && <Image
            source={{ uri: image }}
            style={{ width: 90, height: 120 }}
          />}
  
          <TouchableOpacity //Add the items into the database from here! check if the expiration date should be stored
            style={styles.button}
            onPress=
            {pickImage}
          //console.log('adding' + nameOfItem + ' with a quantity of ' + quantity + ' expiring on ' + expDate + ' with Additional info of:\n' + addntInfo) 
          >
            <Text style={styles.textForAddItems}>ADD IMAGE</Text>
          </TouchableOpacity>
  
          <TextInput
            style={styles.inputAddSection}
            placeholder="Section Name" //ENTER NAME OF CATGEORY
            //onChangeText={(sectionName) => setText(sectionName)}
            onChangeText={(sectionName) => setSectionName(sectionName)}
            defaultValue={sectionName}
          />
          <TouchableOpacity
            style={styles.AddSection}
            onPress={() => { insertSection(sectionName, image) }}>
            <Text style={styles.text} >Add New Secction</Text>
          </TouchableOpacity>
  
        </View>
        <FloatingButton //This button takes ther user to the homepage 
          style={styles.floatinBtn}
          onPress={() => navigation.navigate('INVENTORY TRACKING APP')}
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
    textHead: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    textForAddItems: {
        textAlign: 'center',
        fontSize: 14,
    
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: 'black',
    },
    inputAddSection: {
        borderColor: "gray",
        width: "60%",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'flex-end',
        marginBottom: 70,
    },
    AddSection: {
        backgroundColor: '#859a9b',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#303838',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        justifyContent: 'flex-end',
        top: 80,
        width: "50%",
        left: 10,
    },
    text: {
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

export default AddSection;
