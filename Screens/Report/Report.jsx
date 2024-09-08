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
import styles from './stylesReportEdit';
import Back from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
//import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {DrawerActions, useNavigation} from '@react-navigation/native';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons as Icon } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

function ReportScreen() {
  const [beginDate, setbeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  //const [locais, setLocais] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();
  const [classToken, setClassToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState('');
  const [classData, setClassData] = useState('');

  const [showPickerBegin, setShowPickerBegin] = useState(false);
  const [showPickerEnd, setShowPickerEnd] = useState(false);

  async function getDataClass() {
    const tokenStored = await AsyncStorage.getItem('token');
    const userStored = await AsyncStorage.getItem('userId');
    setUserId(userStored);
    axios
    //.post('http://192.168.100.32:5002/userdata', {token: tokenStored})
    .post('https://classregserver.onrender.com/userdata', {token: tokenStored})
    .then(res => {
        //console.log(res.data);
        setUserData(res.data.data);
    });
  }

  async function getStudentsByUser() {
    const userStored = await AsyncStorage.getItem('userId');
    const id = (userStored != userId ? userStored : userId);

    axios
      //.post('http://192.168.100.32:5002/get-students-by-user', {userId: id})
      .post('https://classregserver.onrender.com/get-students-by-user', {userId: id})
      .then(res => {
        //console.log(res.data)
        if(res.data.status=="Ok"){
            if(res.data.data != null && res.data.data != [null]){
                var arrayWithAllStudents = [];
                for(var i = 0; i < res.data.data.length; i++){
                    arrayWithAllStudents.push({ name: res.data.data[i], id: res.data.data[i]});
                }
                setAllStudents(arrayWithAllStudents);
            }
            //console.log(allStudents);
        }
        else{
          Toast.show({
              type:'error',
              text1: JSON.stringify(res.data),
          }); 
        }
      });
  }

  useEffect(() => {
    getDataClass();

    getStudentsByUser();
  },[]);

  const generateReport = () => { 
    const formdata = {
        userId: userId,
        beginDate: beginDate,
        endDate: endDate,
        students: students,
    };
    console.log(formdata);
    axios
      //.post('http://192.168.100.32:5002/get-report', formdata)
      .post('https://classregserver.onrender.com/get-report', formdata)
      .then(res => {
        //console.log(res.data)
        if(res.data.status=="Ok"){
          Toast.show({
          type:'success',
          text1:'Relatório gerado com sucesso',
          });
          console.log(res.data.data);
          navigation.navigate('ReportPage',{report: res.data.data});
        }
        else{
          Toast.show({
              type:'error',
              text1: JSON.stringify(res.data.error),
          }); 
        }
      });
  };

  const generateReportContent = () => { 
    const formdata = {
        userId: userId,
        beginDate: beginDate,
        endDate: endDate,
        students: students,
    };
    console.log(formdata);
    axios
      //.post('http://192.168.100.32:5002/get-report-content', formdata)
      .post('https://classregserver.onrender.com/get-report-content', formdata)
      .then(res => {//console.log(res.data)
        if(res.data.status=="Ok"){
          Toast.show({
          type:'success',
          text1:'Relatório gerado com sucesso',
          });
          console.log(res.data.data);
          navigation.navigate('ReportPageContent',{report: res.data.data});
        }
        else{
          Toast.show({
              type:'error',
              text1: JSON.stringify(res.data.error),
          }); 
        }
      });
  };

  const onChangeBeginTimePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setbeginDate(currentDate);
    setShowPickerBegin(false); // Fecha o DateTimePicker após seleção

    // Formata a data
    //const formatted = currentDate.toLocaleDateString('pt-BR');
    //if(beginDate != currentDate){
    //  const formatted = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0');
    //  setbeginDateFormatted(formatted);
    //}
  };

  const showTimePickerBegin = () => {
    setShowPickerBegin(true);
  };

  const onChangeEndTimePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowPickerEnd(false); // Fecha o DateTimePicker após seleção
    setEndDate(currentDate);

    // Formata a data
    //const formatted = currentDate.toLocaleDateString('pt-BR');
    //if(endDate != currentDate){
    //  const formatted = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0');
    //  setEndDateFormatted(formatted);
    //}
  };

  const showTimePickerEnd = () => {
    setShowPickerEnd(true);
  };

  function renderSelectText() {
    let c = students.length;
    if(c > 0) {
        if(c == 1){
            return "Selecionado: 1";
        }
        else{
            return "Selecionados: " + c;
        }
    }

    return '';
  }

  function MultiSelectHeader() {
    return (
        <View style={{padding:5}}>
            <View style={[styles.infoEditView,{marginTop:0}]}>
                <Button title="Selecionar Todos" onPress={selectAll} />
                <Button title="Remover Todos" onPress={deselectAll} />
            </View>
        </View>
    );
  }

  const selectAll = () => {
    const allItemIds = allStudents.map(item => item.id).flat();
    setStudents(allItemIds);
  };

  const deselectAll = () => {
    setStudents([]);
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
            <Text style={styles.nameText}>Gerar Relatório</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <View
          style={{
            marginTop: 50,
            marginHorizontal: 22,
          }}>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Início</Text>
            <View style={styles.container}>
                {showPickerBegin && (
                    <DateTimePicker
                    value={beginDate != null ? beginDate : new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeBeginTimePicker}
                    is24Hour={true}
                    />
                )}
                <View style={{flexDirection: 'row'}}>
                    {/*<Text style={styles.infoEditSecond_text}>{beginDateFormatted != '' ? beginDateFormatted : '00:00'}</Text>*/}
                    <TouchableOpacity onPress={showTimePickerBegin}>
                        <Icon name="calendar-month" size={24} color={"#999797"} />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Fim</Text>
            <View style={styles.container}>
                {showPickerEnd && (
                    <DateTimePicker
                    value={endDate != null ? endDate : new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeEndTimePicker}
                    is24Hour={true}
                    />
                )}
                <View style={{flexDirection: 'row'}}>
                    {/*<Text style={styles.infoEditSecond_text}>{endDateFormatted != '' ? endDateFormatted : '00:00'}</Text>*/}
                    <TouchableOpacity onPress={showTimePickerEnd}>
                        <Icon name="calendar-month" size={24} color={"#999797"} />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          <View style={[styles.infoEditView,{flexDirection:'row'}]}>
            <Text style={styles.infoEditFirst_text}>Aluno(s)</Text>
            <View style={{flex: 1}}>
                <SectionedMultiSelect
                    items={allStudents}
                    IconRenderer={Icon}
                    uniqueKey="id"
                    onSelectedItemsChange={setStudents}
                    selectedItems={students}
                    selectText=""
                    searchPlaceholderText="Busca"
                    modalAnimationType="slide"
                    renderSelectText={renderSelectText}
                    headerComponent={<MultiSelectHeader/>}
                    style={{selectToogle:{textAlign: 'right'}}}
                />
            </View>
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => generateReport()}
            style={styles.inBut}>
            <View>
              <Text style={styles.textSign}>Gerar Relatório Renda</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => generateReportContent()}
            style={styles.inBut}>
            <View>
              <Text style={styles.textSign}>Gerar Relatório Conteúdo</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default ReportScreen;