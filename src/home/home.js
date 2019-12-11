import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import { mapping } from '@eva-design/eva';
import { light as lightTheme } from '@eva-design/eva';
import {
  ApplicationProvider, Layout, ListItem, List, BottomNavigation,
  BottomNavigationTab,
} from 'react-native-ui-kitten';
import { Input } from 'react-native-elements';


const data = new Array(8).fill({
  title: 'Title',
  description: 'Description'
});



export default class Home extends Component {

  state = {
    searchValue: '',
    selectedIndex: 1,
  }
  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem('User');
      if (value !== null) {
         res = JSON.parse(value)
        console.log(res);
        console.log(res.fname);
      }
    } catch (error) {
      console.log(error);
    }    

  }

  renderItem = ({ item, index }) => (
    <ListItem
      title={item.title ? `${item.title}` : `Item ${index}`}
      description={item.description ? `${item.description}` : `This is item ${index}`}
      onPress={() => this.props.navigation.navigate('MealEvent')}
    ></ListItem>
  )

  onTabSelect = (selectedIndex) => {
    this.setState({ selectedIndex });
  };

  onSearchChange = (value) => {
    this.setState({ searchValue: value });
  }

  render() {
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <Layout style={styles.container}>
          <View style={styles.view}>
            <Input
              style={styles.input}
              placeholder="Search"
              value={this.state.searchValue}
              onChangeText={this.onSearchChange}
            >
            </Input>
            <List
              style={styles.list}
              contentContainerStyle={styles.contentContainer}
              data={data}
              renderItem={this.renderItem}
              >
            </List>
          </View>
        </Layout>
      </ApplicationProvider>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  view: {
    flex: 2,
    alignItems: 'center',
    marginTop: '5%'
  },
  input: {
    flex: 1,
    marginHorizontal: 4,
  },
  list: {
    width: '100%'
  },
  contentContainer: {
    paddingHorizontal: 8
  }
})