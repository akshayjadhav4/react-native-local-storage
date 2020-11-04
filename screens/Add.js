import React, {useState} from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import {Container, Form, Item, Input, Button, H1} from 'native-base';
import shortid from 'shortid';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
export default function Add({navigation}) {
  const [name, setName] = useState('');
  const [totalNumberOfSeason, setTotalNumberOfSeason] = useState('');

  const saveSeries = async () => {
    try {
      // check if input is provided
      if (!name || !totalNumberOfSeason) {
        return Snackbar.show({
          text: 'Please provide both fields',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#00b7c2',
          textColor: '#eee',
        });
      }
      // make object to add in storage
      const seriesToAdd = {
        id: shortid.generate(),
        name,
        totalNumberOfSeason,
        isWatched: false,
      };
      // get already created storage
      const storedValues = await AsyncStorage.getItem('@series_list');
      const prevList = await JSON.parse(storedValues);
      // check already storage exists
      if (!prevList) {
        const newList = [seriesToAdd];
        await AsyncStorage.setItem('@series_list', JSON.stringify(newList));
      } else {
        prevList.push(seriesToAdd);
        await AsyncStorage.setItem('@series_list', JSON.stringify(prevList));
      }
      // navigate to home after adding
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <H1 style={styles.heading}>Add to watch list</H1>
        <Form>
          <Item rounded style={styles.formItem}>
            <Input
              placeholder="Series Name"
              style={{color: '#eee'}}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </Item>
          <Item rounded style={styles.formItem}>
            <Input
              placeholder="Total number of seasons"
              style={{color: '#eee'}}
              value={totalNumberOfSeason}
              onChangeText={(text) => setTotalNumberOfSeason(text)}
            />
          </Item>
          <Button rounded block onPress={saveSeries}>
            <Text style={{color: '#eee'}}>Add</Text>
          </Button>
        </Form>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  heading: {
    textAlign: 'center',
    color: '#00b7c2',
    marginHorizontal: 5,
    marginTop: 50,
    marginBottom: 20,
  },
  formItem: {
    marginBottom: 20,
  },
});
