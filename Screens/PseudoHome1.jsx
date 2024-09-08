import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, Image, BackHandler, Alert, TextInput, FlatList } from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-paper';
//import Icon from 'react-native-vector-icons/FontAwesome5';
import Check from 'react-native-vector-icons/Feather';
import Back from 'react-native-vector-icons/Ionicons';
import Gender from 'react-native-vector-icons/Foundation';
import Mobile from 'react-native-vector-icons/Entypo';
import Error from 'react-native-vector-icons/MaterialIcons';
import Email from 'react-native-vector-icons/MaterialCommunityIcons';
import Profession from 'react-native-vector-icons/AntDesign';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

function PseudoHome1(props) {
    const navigation = useNavigation();
    const [userData, setUserData] = useState('');
    const [userId, setUserId] = useState('');

    async function getData() {
        const token = await AsyncStorage.getItem('token');
        console.log("Token PseudoHome: " + token);
        if(token != null){
            axios
            //.post('http://192.168.100.32:5002/userdata', {token: token})
            .post('https://classregserver.onrender.com/userdata', {token: token})
            .then(res => {
                console.log(res.data);
                setUserData(res.data.data);
            });
        }
    }

    const [allClassesData, setAllClassesData] = useState('');
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    async function getAllClasses() {
        const userIdStored = await AsyncStorage.getItem('userId');
        console.log("user stored: " + userIdStored);

        if(userIdStored != null){
            //axios.post('http://192.168.100.32:5002/get-all-classes', {userId: userIdStored}).then(res => {
            axios.post('https://classregserver.onrender.com/get-all-classes', {userId: userIdStored}).then(res => {
                console.log(res.data);
                if (res.data.status == 'Ok'){
                  if(res.data.data != null && res.data.data != undefined){
                      if(res.data.data.length > 0){
                        setAllClassesData([]);
                        setAllClassesData(res.data.data);
                      }
                  }
                }
              });
            console.log("PseudoHome classes: " + allClassesData);
        }
    }

    function handleChange(query) {
        setSearchQuery(query);
        const filtered = allClassesData.filter(singleClass =>
          (generateTitle(singleClass)).toLowerCase().includes(query.toLowerCase()) ||
          (generateDuration(singleClass)).toLowerCase().includes(query.toLowerCase()) ||
          (generateRenda(singleClass)).toLowerCase().includes(query.toLowerCase()) ||
          (singleClass.content != null ? singleClass.content : '').toLowerCase().includes(query.toLowerCase())
        );
        setFilteredClasses(filtered);
    }

    useEffect(() => {
        getData();

        getAllClasses();
    }, []);


    const handleBackPress = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
        },
        {
            text: 'Exit',
            onPress: () => BackHandler.exitApp(),
        },
        ]);
        return true;
    };

    useFocusEffect(
        React.useCallback(() => {
        getData();
        getAllClasses();
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
        },[]),
    );

    useEffect(() => {
        getData();
    }, []);

    const AddClass = () =>{
        navigation.navigate('UpdateClass',{hasToken: false, classToken: ''});
    }

    function generateTitle(data){
        var title = "";
        if(data.beginHour != null){
            const begin = new Date(data.beginHour);
            const day = String(begin.getDate()).padStart(2, '0');
            const month = String(begin.getMonth() + 1).padStart(2, '0'); // `getMonth()` retorna 0-11, então somamos 1
            const year = begin.getFullYear();

            title = (data.student != null ? data.student : "Aluno") + ` - ${day}/${month}/${year}`;
        }
        else{
            title = "Não informado";
        }
        return title;
    }

    function generateDuration(data){
        var duration = "";
        if(data.beginHour != null && data.endHour != null){
            const begin = new Date(data.beginHour);
            const end = new Date(data.endHour);

            var durationFloat = end - begin;
            const hours = Math.floor((durationFloat / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((durationFloat / (1000 * 60)) % 60);

            const hoursString = String(hours).padStart(2, '0');
            const minutesString = String(minutes).padStart(2, '0');

            duration = hoursString + ":" + minutesString;
        }else{
            duration = "Não foi possível calcular";
        }
        return duration;
    }

    function generateRenda(data){
        var renda = "";
        if(data.beginHour != null && data.endHour != null && data.priceClass != null){
            const begin = new Date(data.beginHour);
            const end = new Date(data.endHour);
            begin.setSeconds(0);
            begin.setMilliseconds(0);
            end.setSeconds(0);
            end.setMilliseconds(0);

            var durationFloat = end - begin;
            const hours = Math.floor((durationFloat / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((durationFloat / (1000 * 60)) % 60);

            const price = data.priceClass;
            const busGo = (data.busGo != null ? parseFloat(data.busGo) : 0);
            const busBack = (data.busBack != null ? parseFloat(data.busBack) : 0);
            var renda = hours*price + (minutes/60.0)*price - (busGo + busBack);

            renda = `${String(renda.toFixed(2)).padStart(2, '0')}`;
        }
        else{
            renda = "Não foi possível calcular";
        }
        return renda;
    }

    function editClass(data){
        if(data != null){
            navigation.navigate('UpdateClass',{hasToken: true, classData: data});
        }else{
            Toast.show({
                type: 'error',
                text: 'Erro',
                text2: "Erro ao carregar aula",
                visibilityTime: 5000,
            }, 2000);
        }
    }

    function deleteSingleClass(data){
        axios
        //.post('http://192.168.100.32:5002/delete-class', {id: data._id})
        .post('https://classregserver.onrender.com/delete-class', {id: data._id})
        .then(res => {
          console.log(res.data);
          if(res.data.status=="Ok"){
            Toast.show({
                type: 'success',
                text: 'Remoção',
                text2: "Remoção de classe realizado com sucesso",
                visibilityTime: 5000,
            }, 2000);
            getData();
            getAllClasses();
          }
        });
    }

    const UserCard = ({data}) => (
        <View style={styles.card}>
        <View style={styles.cardDetails}>
            <Text style={styles.name}>{generateTitle(data)}</Text>
            <Text style={styles.email}>Duração: {generateDuration(data)}</Text>
            <Text style={styles.userType}>Renda: R$ {generateRenda(data)}</Text>
        </View>
        <View>
            <Icon
              name="square-edit-outline"
              size={24}
              color="white"
              backgroundColor="#f0da3a"
              onPress={() => editClass(data)}
              style={{borderRadius:30,padding:5}}
            />
            <Icon
              name="delete"
              size={24}
              color="white"
              backgroundColor="red"
              onPress={() => deleteSingleClass(data)}
              style={{borderRadius:30, padding: 5, marginTop: 5}}
            />
        </View>
        </View>
    );

    return (
        <View>
            <View style={{position: 'relative'}}>
                <TouchableOpacity
                    style={styles.backIcon}
                    onPress={() => {
                    navigation.dispatch(DrawerActions.openDrawer());
                    getData();
                    }}>
                    <Mobile name="menu" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => AddClass()}>
                    <Icon name="book-plus" size={30} color={'white'} />
                </TouchableOpacity>
            </View>

            <Image
                width={100}
                height={60}
                resizeMode="contain"
                style={{
                    position: 'absolute',
                    marginTop: -150
                }}
                source={require('../assets/wave.png')}
            />

            <View style={{padding: 20,marginBottom:-20}}>
                <View style={[styles.searchBar, {marginTop: 50}]}>
                    <View style={styles.searchIcon}>
                    <Icon name="text-search" size={18} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Busca"
                        placeholderTextColor={'#707070'}
                        value={searchQuery}
                        onChangeText={handleChange}
                    />
                    </View>
                    <Text style={styles.recordsText}>
                    {searchQuery.length>0?`${filteredClasses.length} encontrado(s)`:`Total: ${allClassesData.length} `}
                    </Text>
                </View>
                <FlatList
                    data={searchQuery.length > 0 ? filteredClasses : allClassesData}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item._id}
                    renderItem={({item}) => <UserCard data={item} />}
                    style={{maxHeight: '85%'}}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
editIcon: {
    zIndex: 1,
    color: 'white',
    position: 'absolute',
    right: 2,
    margin: 15,
},
backIcon: {
    zIndex: 2,
    color: 'white',
    position: 'absolute',
    left: 2,
    margin: 15,
},
avatar: {
    borderRadius: 100,
    marginTop: -250,
    // marginLeft: 105,
    backgroundColor: 'white',
    height: 200,
    width: 200,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
},
// 420475
nameText: {
    color: 'black',
    fontSize: 28,

    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textAlign: 'center',
},
bookCountMain: {
    borderColor: '#b0b0b0',
    borderWidth: 1,
    marginTop: 18,
    marginHorizontal: 20,

    borderRadius: 20,
    flexDirection: 'row',
    width: '88%',
},
bookCount: {
    width: '50%',
    borderColor: '#b0b0b0',
    borderRightWidth: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
},
bookCountNum: {
    color: '#5D01AA',
    fontSize: 34,
    fontWeight: '800',
},
bookCountText: {color: '#b3b3b3', fontSize: 14, fontWeight: '500'},
infoMain: {
    marginTop: 10,
},
infoCont: {
    width: '100%',
    flexDirection: 'row',
},
infoIconCont: {
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,

    alignItems: 'center',
    elevation: -5,
    borderColor: 'black',
    backgroundColor: 'black',
},

infoText: {
    width: '80%',
    flexDirection: 'column',
    marginLeft: 25,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#e6e6e6',
},
infoSmall_Text: {
    fontSize: 13,
    color: '#b3b3b3',
    fontWeight: '500',
},
infoLarge_Text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
},
booksUploadedMain: {
    paddingHorizontal: 10,
    paddingBottom: 30,
    marginTop: 20,
},
flatlistDiv: {
    borderRadius: 15,
    paddingHorizontal: 10,
},
booksUploadedText: {
    fontSize: 26,
    color: 'black',
    fontWeight: '700',
    paddingLeft: 20,
    paddingBottom: 8,
},
booksUploadedCard: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 9,
    marginBottom: 9,

    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 3,
},
booksUploadedImgDiv: {
    width: '28%',
},
booksUploadedImg: {
    width: '100%',
    height: 120,
    borderRadius: 15,
},
cardMidDiv: {
    paddingHorizontal: 10,
    width: '55%',
    position: 'relative',
},
approvedText: {
    fontSize: 12,
    color: '#0d7313',
    fontWeight: '600',
    marginLeft: 5,
},
cardBookNameText: {
    fontSize: 24,
    color: 'black',
    fontWeight: '700',
    marginTop: 2,
},
cardBookAuthor: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
    marginTop: 1,
},
cardRating: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    flexDirection: 'row',
},
cardRatingCount: {
    fontSize: 14,
    marginTop: -2,
    paddingLeft: 4,
    color: '#303030',
},
cardEditDiv: {
    width: '17%',
    justifyContent: 'center',
    alignItems: 'center',
},
cardEditBtn: {
    height: 44,
    width: 44,
    backgroundColor: '#774BBC',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
},
footer: {
    padding: 10,
    justifyContent: 'center',

    flexDirection: 'row',
},
loadMoreBtn: {
    padding: 10,
    backgroundColor: '#f5a002',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    paddingHorizontal: 20,
},
btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
},
floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30, // Half of width/height to make it circular
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // For Android shadow
    zIndex: 1, // Ensure it is on top of other items
},
containerFloatingButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
buttonTextFloatingButton: {
color: 'white',
fontSize: 24,
},
searchInput: {
    paddingLeft: 10,
    color: '#707070',
    fontSize: 15,
  },
  searchIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 10,
    color: 'black',
  },
  viewStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textStyle: {
    fontSize: 28,
    color: 'black',
  },
  headingStyle: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 18,
    color: '#777777',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#777777',
  },
});
export default PseudoHome1;