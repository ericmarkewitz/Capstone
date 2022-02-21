import React, { useState } from 'react';
import { openDatabase, SQLite} from 'react-native-sqlite-storage';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, SectionList, TouchableHighlight, TextInput, Switch, ImageBackground } from "react-native";


/*
errorCB(err) {
    console.log("SQL Error: " + err);
}

successCB() {
    console.log("SQL executed fine");
}

openCB() {
    console.log("Database OPENED");
}*/

/*
const db = SQLite.openDatabase({
    name : 'canning',
    createFromLocation: '../sql/canning.sqlite'
    },
    ()=>{},
    error=>{console.log("error")}
);


export default function OpenDatabase(props){
    
    

    const addDummyData = () => {
        db.transaction((tx) =>{
            tx.executeSql(
                "PRAGMA foreign_keys = ON;"
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Storage("
                + "locationID integer primary key, "
                + "locationName text"
                + ");"
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Shelves("
                + "shelfID integer,"
                + "locationID integer,"
                + "shelfName text,"
                + "foreign key (locationID) references Storage (locationID)"
                + ");"
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Batch("
                + "batchID integer primary key,"
                + "product text,"
                + "datePlaced text check (datePlaced glob '[0-9][0-9]/[0-9][0-9]/[0-9][0-9]'),"
                + "shelfID integer,"
                + "quantity integer check (quantity >= 0),"
                + "foreign key (shelfID) references Shelves(shelfID)"
                + ");"
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Jars("
                + "jarID integer primary key,"
                + "size text,"
                + "mouth text check (mouth = 'regular' or mouth = 'wide')"
                + ");"
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS CannedGoods("
                + "jarID integer,"
                + "batchID integer,"
                + "primary key (jarID, batchID),"
                + "foreign key (jarID) references Jars(jarID),"
                + "foreign key (batchID) references Batch(batchID)"
                + ");"
            );

            tx.executeSql(
                "INSERT INTO Storage (locationID, locationName) VALUES (?,?);",
                [1, "FirstLocation"]
            );
            tx.executeSql(
                "INSERT INTO Shelves (shelfID, locationID, shelfName) VALUES (?,?,?);",
                [1, 1, "FirstShelf"]
            );
            tx.executeSql(
                "INSERT INTO Batch (batchID, product, datePlaced, shelfID, quantity) VALUES (?,?,?,?,?);",
                [1, "FirstProduct", "00/00/00", 1, 1]
            );
            tx.executeSql(
                "INSERT INTO Jars (jarID, size, mouth) VALUES (?,?,?);",
                [1, "big", "regular"]
            );
            tx.executeSql(
                "INSERT INTO Jars (jarID, size, mouth) VALUES (?,?,?);",
                [2, "small", "regular"]
            );
            tx.executeSql(
                "INSERT INTO Jars (jarID, size, mouth) VALUES (?,?,?);",
                [3, "medium", "wide"]
            );
            tx.executeSql(
                "INSERT INTO CannedGoods (jarID, batchID) VALUES (?,?);",
                [1, 1]
            );

            tx.executeSql(
                "SELECT * FROM JARS;",
                [],
                (tx, results) => {
                    let len = results.rows.length;
                    for (let i=0; i<len; i++){
                        let jars = results.rows.item(i).Name;
                        console.log(jars);
                    }
                }
            );

        })
    }    
}
/*
return(
    <ImageBackground
    source={require('./assets/cart.jpg')}
    style={{ width: '100%', height: '100%' }}
    >

      <SafeAreaView style={styles.container}>
      <View style={styles.text}>


      <Text>const mystring = 'hello'</Text>

      <Text>mystring</Text>

      <Text>hi</Text>
      <Text>myString</Text>




      </View>
      </SafeAreaView >
  </ImageBackground>
); */
