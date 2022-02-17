import React, { useState } from 'react';
import { openDatabase, SQLite} from 'react-native-sqlite-storage';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, TouchableHighlight, TextInput, Switch, ImageBackground } from "react-native";

function OpenDatabase(props){
    return(
        errorCB(err) {
          console.log("SQL Error: " + err);
        },

        successCB() {
          console.log("SQL executed fine");
        },

        openCB() {
          console.log("Database OPENED");
        },

        const db = SQLite.openDatabase("../../db", "1.0", "Can Database", 200000, openCB, errorCB);
    );
}
