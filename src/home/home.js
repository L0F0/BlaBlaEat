import React, { Component } from 'react';
import { View, Image, StyleSheet, ScrollView, RefreshControl, SafeAreaView, YellowBox } from 'react-native';
import { Layout, Button, Icon, Input, Text } from 'react-native-ui-kitten';
import firebase from "firebase/app";
import { CardList } from 'react-native-card-list';
import QRCode from 'react-native-qrcode';
//import QRCode from 'react-native-qrcode-generator';
//import QRCode from 'react-native-qrcode-svg';
import MealEvent from '../meal/mealEvent';
import _ from 'lodash';


YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};


const mealImg = require('../../assets/mealEx.jpg');

const searchIcon = (style) => (
  <Icon name="search-outline" width={20} height={20}></Icon>
) // this.setState({error: false});
// this.db.collection("meal")
// .where("name", ">", [this.state.searchValue])
// .get()
// .then((res) => {
//   console.log(res);
//   if (res.empty) {
//     console.log('No matching documents.');
//     return;
//   }
//   res.forEach((doc) => {
//     console.log(doc.data());
//   })
// // })

// const contentCard = (data, date, present, maxPeople) => (
//   <View>
//       <View style={{}}>
//         <Text category="h2"  style={{fontWeight: 'bold'}}>Description :</Text>
//         <Text style={{marginLeft: '5%'}}>{data.description.repeat(27)} </Text>
//       </View>
//         <View style={{flex: 1, flexDirection: 'row-reverse'}}>
//           <Layout level="3">
//             <View>
//               <View style={{flex:1}}>
//                 <QRCode
//                   size={70}
//                   value={data.id}/>
//               </View>
//             </View>

//           </Layout>
//       </View>
//       <View style={{marginTop: "3%"}}>
//         <Text  category="h2" style={{fontWeight: 'bold'}}>Price between : </Text>
//         <Text style={{marginLeft: '5%'}}>{data.priceMin.toString() + ' - ' + data.priceMax.toString() + '€'}</Text>
//       </View>
//       <View style={{marginTop: '3%'}}>
//         <Text category="h2" style={{fontWeight: 'bold'}}>Duration : </Text>
//         <Text style={{marginLeft: '5%'}}>{data.duration.toString() + 'min'}</Text>
//       </View>
//       <View style={{marginTop: '3%'}}>
//         <Text category="h2" style={{fontWeight: 'bold'}}>Ingredients : </Text>
//         <View style={{ marginLeft: "5%", flexDirection: 'row',flexWrap: 'wrap'}}>
//           {data.ingredient.map((ingr, index) => (
//             <Text key={index}>{ingr} - </Text>
//           ))}
//         </View>
//       </View>
//       <View style={{marginTop: '3%'}}>
//         <Text category="h2" style={{fontWeight: 'bold'}}>Date : </Text>
//         <Text style={{marginLeft: '5%'}}>{(date.getMonth() + 1) + "/" + date.getDate() +"/"+ date.getFullYear() +" - "+ date.getHours() +":"+ date.getMinutes()}</Text>
//       </View>
//       <View style={{alignItems: 'center', marginTop: '10%'}}>
//         {
//           present ?
//             <Button
//                 onPress={() => this.quitMeal()}
//                 status='danger'>
//                 Quit Meal !
//             </Button>
//           :
//             <Button
//                 disabled={maxPeople}
//                 onPress={() => this.joinMeal()}
//                 status='success'>
//                 Join meal !
//             </Button>
//         }
//       </View>
//   </View>
//)

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.db = firebase.firestore();
  }

  state = {
    meals: [],

    searchValue: '',
    selectedIndex: 1,
    refreshing: false,
    error: false,
  }

  componentDidMount = () => {
    this.getMeals();
  }

  searchMeal = async () => {
    if (!this.state.searchValue) {
      await this.getMeals();
      this.setState({error: true});
    }else {
      await this.getMeals();
      let toto = [];
      this.state.meals.forEach((res) => {
        if (res.name.toLowerCase().includes(this.state.searchValue.toLowerCase()))
          toto.push(res);
      })
      this.setState({
        meals: toto,
      })
    }
  }

  getMeals = async () => {
    let allMeals = this.db.collection('meal');

    await allMeals.where('startAt', '>', new Date()).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      let meals = [];
      let i = 4;
      snapshot.forEach((doc) => {
        let meal = doc.data();

        meal.id = doc.id;
        meal.img = 'https://source.unsplash.com/collection/1353633/'+ i.toString() + '00x900';
        meal.startAt = meal.startAt.toDate();

        if (doc.data().peoples.indexOf(firebase.auth().currentUser.uid) != -1)
            meal.present = true;
        else if (doc.data().peopleNbr === doc.data().peopleMax)
            meal.maxPeople = true;

        meals.push(meal);
        i++;
      });
      this.setState({meals: meals});
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  }

  onTabSelect = (selectedIndex) => {
    this.setState({ selectedIndex });
  };

  onSearchChange = (value) => {
    this.setState({ searchValue: value });
  }

  onRefresh = async () => {
    this.setState({refreshing : true});
    await this.getMeals()
    this.setState({refreshing : false,  searchValue: ''});
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
          <View style={{marginTop:'15%',  alignItems: 'center'}}>
            <View style={{ flexDirection: 'row', width: '80%'}}>
              <Input
                style={styles.input}
                status={this.state.error ? 'danger' : 'info'}
                placeholder="Search"
                value={this.state.searchValue}
                onChangeText={this.onSearchChange}
              />
              <Button status='basic' icon={searchIcon} onPress={this.searchMeal}></Button>
            </View>
          </View>
          <ScrollView style={{marginTop:'3%'}}
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
            }
          >
            <Layout style={styles.container}>
              <View>
                { this.state.meals.length ?
                  this.state.meals.map((meal) => (
                    <View key={meal.id}>
                      <MealEvent meal={meal}/>
                    </View>
                  )) :
                    <View>
                      <Text>No meals registered yet ! Create one !</Text>
                    </View>
                }
              </View>
            </Layout>
          </ScrollView>
      </SafeAreaView>
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
    width: '50%',
  },
})
