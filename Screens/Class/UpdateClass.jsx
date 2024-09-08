import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button
} from 'react-native';
import {Avatar} from 'react-native-paper';
import styles from './stylesClassEdit';
import Back from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
//import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as ImagePicker from 'expo-image-picker';

function UpdateClass() {
  const [beginHour, setBeginHour] = useState(new Date());
  //const [beginHourFormatted, setBeginHourFormatted] = useState('');
  const [endHour, setEndHour] = useState(new Date());
  //const [endHourFormatted, setEndHourFormatted] = useState('');
  const [busGo, setBusGo] = useState('');
  const [busBack, setBusBack] = useState('');
  const [sameValue, setSameValue] = useState(true);
  const [priceClass, setPriceClass] = useState('');
  const [student, setStudent] = useState('');
  const [classContent, setClassContent] = useState('');
  const [dateDay, setDateDay] = useState(new Date());

  const route = useRoute();
  const navigation = useNavigation();
  const [classToken, setClassToken] = useState('');
  const [userData, setUserData] = useState('');
  const [classData, setClassData] = useState('');
  const [addOrUpdate, setAddOrUpdate] = useState('');

  const [showPickerBegin, setShowPickerBegin] = useState(false);
  const [showPickerEnd, setShowPickerEnd] = useState(false);
  const [showPickerDateDay, setShowPickerDateDay] = useState(false);

  async function getDataClass() {
    const tokenStored = await AsyncStorage.getItem('token');
    axios
    //.post('http://192.168.100.32:5002/userdata', {token: tokenStored})
    .post('https://classregserver.onrender.com/userdata', {token: tokenStored})
    .then(res => {
        //console.log(res.data);
        setUserData(res.data.data);
    });

    const hasToken = route.params.hasToken; //Token de class
    if(hasToken){
        const classDataObj = route.params.classData;
        const idClassCurrent = classDataObj._id;
        setClassToken(idClassCurrent);

        setAddOrUpdate("Update");

        setBeginHour(classDataObj.beginHour != null ? new Date(classDataObj.beginHour) : new Date());
        setEndHour(classDataObj.endHour != null ? new Date(classDataObj.endHour) : new Date());
        setBusGo(classDataObj.busGo);
        setBusBack(classDataObj.busBack);
        setSameValue(classDataObj.busGo == classDataObj.busBack);
        setPriceClass(classDataObj.priceClass);
        setStudent(classDataObj.student);
        setClassContent(classDataObj.content);

        //axios
        //.post('http://192.168.100.32:5002/classData', {token: idClassCurrent})
        //.post('https://classregserver.onrender.com/classData', {token: idClassCurrent})
        //.then(res => {
        //    //console.log(res.data);
        //    setClassData(res.data.data);
        //});
    }else{
        setAddOrUpdate("Add");

        setBeginHour(new Date());
        setEndHour(new Date());
        setBusGo(0);
        setBusBack(0);
        setSameValue(true);
        setPriceClass(0);
        setStudent('');
        setClassContent('');
    }
  }

  useEffect(() => {
    getDataClass();
  },[]);

  const updateClass = () => { 
    var beginHourWithDate = new Date();
    beginHourWithDate.setDate(dateDay.getDate());
    beginHourWithDate.setMonth(dateDay.getMonth());
    beginHourWithDate.setFullYear(dateDay.getFullYear());
    beginHourWithDate.setHours(beginHour.getHours());
    beginHourWithDate.setMinutes(beginHour.getMinutes());
    beginHourWithDate.setSeconds(0);
    beginHourWithDate.setMilliseconds(0);

    var endHourWithDate = new Date();
    endHourWithDate.setDate(dateDay.getDate());
    endHourWithDate.setMonth(dateDay.getMonth());
    endHourWithDate.setFullYear(dateDay.getFullYear());
    endHourWithDate.setHours(endHour.getHours());
    endHourWithDate.setMinutes(endHour.getMinutes());
    endHourWithDate.setSeconds(0);
    endHourWithDate.setMilliseconds(0);

    const formdata = {
        idClass: classToken,
        userId: userData._id,
        beginHour: beginHourWithDate,
        endHour: endHourWithDate,
        busGo: busGo,
        busBack: (sameValue ? busGo : busBack),
        priceClass: priceClass,
        student: student,
        content: classContent,
    };
    console.log(formdata);
    axios
      //.post('http://192.168.100.32:5002/update-class', formdata)
      .post('https://classregserver.onrender.com/update-class', formdata)
      .then(res => {//console.log(res.data)
        if(res.data.status=="Ok"){
          Toast.show({
          type:'success',
          text1:'Dados ' + (addOrUpdate == "Add" ? "registrados" : "alterados") + ' com sucesso',
          });
          navigation.navigate('PseudoHome1');
        }
        else{
          Toast.show({
              type:'error',
              text1: JSON.stringify(res.data),
          }); 
        }
      });
  };

  const onChangeBeginTimePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setBeginHour(currentDate);
    setShowPickerBegin(false); // Fecha o DateTimePicker após seleção

    // Formata a data
    //const formatted = currentDate.toLocaleDateString('pt-BR');
    //if(beginHour != currentDate){
    //  const formatted = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0');
    //  setBeginHourFormatted(formatted);
    //}

    console.log(beginHour);
  };

  const showTimePickerBegin = () => {
    setShowPickerBegin(true);
  };

  const onChangeEndTimePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowPickerEnd(false); // Fecha o DateTimePicker após seleção
    setEndHour(currentDate);

    // Formata a data
    //const formatted = currentDate.toLocaleDateString('pt-BR');
    //if(endHour != currentDate){
    //  const formatted = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0');
    //  setEndHourFormatted(formatted);
    //}
  };

  const showTimePickerEnd = () => {
    setShowPickerEnd(true);
  };

  const onChangeDateDayPicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateDay(currentDate);
    setShowPickerDateDay(false);
  };

  const showTimePickerDateDay = () => {
    setShowPickerDateDay(true);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View>
        <View style={styles.header}>
          <View style={{flex: 1}}>
          </View>
          <View style={{flex: 3}}>
            <Text style={styles.nameText}>{addOrUpdate == "Add" ? "Cadastrar" : "Editar"} Aula</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View
          style={{
            marginTop: 50,
            marginHorizontal: 22,
          }}>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Data</Text>
            <View style={styles.container}>
                {showPickerDateDay && (
                    <DateTimePicker
                    value={dateDay != null ? dateDay : new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeDateDayPicker}
                    is24Hour={true}
                    />
                )}
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={showTimePickerDateDay}>
                        <Icon name="calendar-clock" size={24} color={"#999797"} />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Início</Text>
            <View style={styles.container}>
                {showPickerBegin && (
                    <DateTimePicker
                    value={beginHour != null ? beginHour : new Date()}
                    mode="time"
                    display="default"
                    onChange={onChangeBeginTimePicker}
                    is24Hour={true}
                    />
                )}
                <View style={{flexDirection: 'row'}}>
                    {/*<Text style={styles.infoEditSecond_text}>{beginHourFormatted != '' ? beginHourFormatted : '00:00'}</Text>*/}
                    <TouchableOpacity onPress={showTimePickerBegin}>
                        <Icon name="calendar-clock" size={24} color={"#999797"} />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Fim</Text>
            <View style={styles.container}>
                {showPickerEnd && (
                    <DateTimePicker
                    value={endHour != null ? endHour : new Date()}
                    mode="time"
                    display="default"
                    onChange={onChangeEndTimePicker}
                    is24Hour={true}
                    />
                )}
                <View style={{flexDirection: 'row'}}>
                    {/*<Text style={styles.infoEditSecond_text}>{endHourFormatted != '' ? endHourFormatted : '00:00'}</Text>*/}
                    <TouchableOpacity onPress={showTimePickerEnd}>
                        <Icon name="calendar-clock" size={24} color={"#999797"} />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Transporte Ida</Text>
            <TextInput
              editable={true}
              placeholder="0"
              placeholderTextColor={'#999797'}
              keyboardType='numeric'
              style={styles.infoEditSecond_text}
              onChange={e => setBusGo(e.nativeEvent.text)}
              defaultValue={(busGo != null && busGo != undefined ? busGo.toString() : "0")}
            />
          </View>
          
          {
            !(sameValue) ?
                (<View style={styles.infoEditView}>
                    <Text style={styles.infoEditFirst_text}>Transporte Volta</Text>
                    <TextInput
                        placeholder="0"
                        placeholderTextColor={'#999797'}
                        keyboardType="numeric"
                        //maxLength={10}
                        style={styles.infoEditSecond_text}
                        onChange={e => setBusBack(e.nativeEvent.text)}
                        defaultValue={(busBack != null && busBack != undefined ? busBack.toString() : "0")}
                    />
                </View>)
            :
                ''
          }

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Ida e volta iguais</Text>
            <CheckBox
                value={sameValue}
                onValueChange={setSameValue}
                tintColors={{ true: 'orange', false: 'gray' }} // Cor para estado selecionado e não selecionado
                style={styles.infoEditSecond_text}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Hora Aula</Text>
            <TextInput
              placeholder="0"
              placeholderTextColor={'#999797'}
              keyboardType="numeric"
              style={styles.infoEditSecond_text}
              onChange={e => setPriceClass(e.nativeEvent.text)}
              defaultValue={(priceClass != null && priceClass != undefined ? priceClass.toString() : "0")}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Aluno</Text>
            <TextInput
              placeholder="Nome"
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setStudent(e.nativeEvent.text)}
              defaultValue={student}
            />
          </View>

          <View style={{marginTop: 10, borderBottomWidth: 1, borderColor: '#e6e6e6'}}>
            <Text style={styles.infoEditFirst_text}>Conteúdo Programático</Text>
            <TextInput
              placeholder="Resumo"
              multiline={true}
              numberOfLines={5}
              placeholderTextColor={'#999797'}
              onChange={e => setClassContent(e.nativeEvent.text)}
              defaultValue={classContent}
            />
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => updateClass()}
            style={styles.inBut}>
            <View>
              <Text style={styles.textSign}>{addOrUpdate == "Add" ? "Cadastrar" : "Atualizar"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default UpdateClass;