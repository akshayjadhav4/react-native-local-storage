import React, {useState, useEffect} from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import {Container, Form, Item, Input, Button, H1} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';

export default function Edit({navigation, route}) {
  const [name, setName] = useState('');
  const [totalNumberOfSeason, setTotalNumberOfSeason] = useState('');
  const [id, setId] = useState(null);
  const [isWatched, setIsWatched] = useState('');

  const updateSeries = async () => {
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
      const seriesToupdate = {
        id,
        name,
        totalNumberOfSeason,
        isWatched,
      };
      // get already created storage
      const storedValues = await AsyncStorage.getItem('@series_list');
      const prevList = await JSON.parse(storedValues);
      prevList.map((item) => {
        if (item.id == id) {
          item.name = name;
          item.totalNumberOfSeason = totalNumberOfSeason;
          item.isWatched = isWatched;
        }
        return item;
      });
      // save to storage
      await AsyncStorage.setItem('@series_list', JSON.stringify(prevList));

      // navigate to home after adding
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const {item} = route.params;
    const {id, name, totalNumberOfSeason, isWatched} = item;
    setId(id);
    setName(name);
    setTotalNumberOfSeason(totalNumberOfSeason);
    setIsWatched(isWatched);
  }, []);

  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <H1 style={styles.heading}>Edit Series</H1>
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
          <Button rounded block onPress={updateSeries}>
            <Text style={{color: '#eee'}}>Save</Text>
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
