import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {
  Fab,
  Icon,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Button,
  CheckBox,
  Title,
  Container,
  H1,
  Text,
  Spinner,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {useIsFocused} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
export default function Home({navigation, route}) {
  const [seriesList, setSeriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  const getList = async () => {
    setIsLoading(true);
    const storedList = await AsyncStorage.getItem('@series_list');
    if (!storedList) {
      setSeriesList([]);
    }
    const list = JSON.parse(storedList);
    setSeriesList(list);
    setIsLoading(false);
  };

  const deleteSeries = async (id) => {
    const newList = await seriesList.filter((list) => list.id !== id);
    await AsyncStorage.setItem('@series_list', JSON.stringify(newList));
    setSeriesList(newList);
    Snackbar.show({
      text: 'Series Deleted.',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#00b7c2',
      textColor: '#eee',
    });
  };

  const markComplete = async (id) => {
    const newArr = seriesList.map((item) => {
      if (item.id == id) {
        item.isWatched = !item.isWatched;
      }
      return item;
    });

    await AsyncStorage.setItem('@series_list', JSON.stringify(newArr));
    setSeriesList(newArr);
  };

  useEffect(() => {
    getList();
  }, [isFocused]);
  if (isLoading) {
    return (
      <Container style={styles.emptyContainer}>
        <Spinner color="#00b7c2" />
      </Container>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {seriesList?.length == 0 ? (
        <Container style={styles.emptyContainer}>
          <H1 style={styles.heading}>Your watch list is empty</H1>
        </Container>
      ) : (
        <Container style={styles.container}>
          <H1 style={styles.heading}>Next series to watch</H1>
          <List>
            {seriesList?.map((item) => (
              <ListItem style={styles.listItem} noBorder key={item.id}>
                <Left>
                  <Button
                    style={styles.actionButton}
                    danger
                    onPress={() => deleteSeries(item.id)}>
                    <Icon name="trash" active />
                  </Button>
                  <Button style={styles.actionButton} warning>
                    <Icon name="edit" type="Feather" active />
                  </Button>
                </Left>
                <Body>
                  <Title style={styles.seasonName}>{item.name}</Title>
                  <Text note>{item.totalNumberOfSeason} seasons to watch</Text>
                </Body>
                <Right>
                  <CheckBox
                    checked={item.isWatched}
                    onPress={() => markComplete(item.id)}
                  />
                </Right>
              </ListItem>
            ))}
          </List>
        </Container>
      )}
      <Fab
        style={{backgroundColor: '#5067FF'}}
        position="bottomRight"
        onPress={() => navigation.navigate('Add')}>
        <Icon name="add" />
      </Fab>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
  },
  heading: {
    textAlign: 'center',
    color: '#00b7c2',
    marginVertical: 15,
    marginHorizontal: 5,
  },
  actionButton: {
    marginLeft: 5,
  },
  seasonName: {
    color: '#fdcb9e',
    textAlign: 'justify',
  },
  listItem: {
    marginLeft: 0,
    marginBottom: 20,
  },
});
