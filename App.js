
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList } from 'react-native';

var SQLite = require('react-native-sqlite-storage');

const SQL_CREATE_TODO = 'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT , name TEXT, checked INTEGER NOT NULL)';
const SQL_DROP_TODO = 'DROP TABLE IF EXISTS todos';
const SQL_INSERT_TODO = 'INSERT INTO todos (name, checked) VALUES (?,?)';
const SQL_SELECT_TODO = 'SELECT * FROM `todos`';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {
      sqliteData: [],
     };
  }

  componentDidMount() {
    this.connection();
  }

  connection() {
    console.log('Estableciendo la conexion');
    SQLite.openDatabase({ name: 'database-test.db', location: 'default' }, (db) => {
      console.log('Success', db)
      db.transaction((tx) => {
        tx.executeSql(SQL_DROP_TODO, []);
        tx.executeSql(SQL_CREATE_TODO, [], (tx, results) => {
          console.log('results tx', results)
        });
        tx.executeSql(SQL_INSERT_TODO, ['Lavar ropa', 1]);
        tx.executeSql(SQL_INSERT_TODO, ['Hacer desayuno', 1]);
        tx.executeSql(SQL_INSERT_TODO, ['Hacer aseo', 1]);
        tx.executeSql(SQL_SELECT_TODO, [],(tx, results) => {
          this.setState({sqliteData: results.rows.raw()})
        });
      })
    }, (err) => {
      console.log('Error', err)
    });
    
  }

  keyExtractor = (item) => item.id.toString();

  render() {
    console.log("STATE LIST" , this.state.sqliteData)
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <FlatList 
          data = {this.state.sqliteData} 
          renderItem={({item}) => <Text>{item.name}</Text>}
          keyExtractor = {this.keyExtractor}
        /> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
