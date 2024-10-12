import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import styles from './stylesProfileEdit';
import Back from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
//import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function UpdateProfile() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [birth, setBirth] = useState(new Date());
  const route = useRoute();
  const navigation = useNavigation();

  const [showPickerBirth, setShowPickerBirth] = useState(false);

  const selectPhoto = async () => {
    //ImagePicker.openPicker({
    //  width: 400,
    //  height: 400,
    //  cropping: true,
    //  includeBase64: true,
    //  cropperCircleOverlay: true,
    //  avoidEmptySpaceAroundImage: true,
    //  freeStyleCropEnabled: true,
    //}).then(image => {
    //  console.log(image);
    //  const data = `data:${image.mime};base64,${image.data}`;
    //  setImage(data);
    //});

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
        base64: true,
    });

    if (!result.canceled) {
        //const data = `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`;
        const data = `data:image/png;base64,${result.assets[0].base64}`;
        //const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
        setImage(data);
    }
  };

  const onChangeBirthPicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowPickerBirth(false);
    setBirth(currentDate);
  };

  const showTimePickerBirth = () => {
    setShowPickerBirth(true);
  };
 
  useEffect(() => {
    const userData = route.params.data;
    setEmail(userData.email);
    setImage(userData.image);
    setProfession(userData.profession);
    setName(userData.name);
    setBirth(new Date(userData.birth));
  },[]);

  const handleBackPress = () => {
    Alert.alert('Atualizar', 'Atualições de dados de usuário exigem login novamente. Deseja continuar?', [
      {
          text: 'Cancelar',
          onPress: () => { return false; },
          style: 'cancel',
      },
      {
          text: 'Sim',
          onPress: () => updateProfile(),
      },
      ],
      { cancelable: false });
    return true;
  };

  const updateProfile = () => { 
    const formdata = {
      name: name,
      image,
      email,
      birth,
      profession,
    };
    console.log(formdata);
    axios
      .post('https://classregserver.onrender.com/update-user', formdata)
      .then(res => {console.log(res.data)
        if(res.data.status=="Ok"){
          Toast.show({
          type:'success',
          text1:'Dados alterados com sucesso',
          });
          navigation.navigate('ShowProfile');
          BackHandler.exitApp();
        }
      });
  };

  const backToHome = () =>{
    navigation.navigate('ShowProfile');
  }

  function generateDate(data){
    if(data != null && data != undefined){
        const dateBirth = new Date(data);
        return String(dateBirth.getDate()).padStart(2,'0') + "/" + String((dateBirth.getMonth()+1)).padStart(2, '0') + "/" + String(dateBirth.getFullYear()).padStart(2, '0');
    }else{
        return '';
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View>
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={() => backToHome()}>
              <Back name="arrow-back" size={30} style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 3}}>
            <Text style={styles.nameText}>Editar Usuário(a)</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        
        <View style={styles.camDiv}>
          <View style={styles.camIconDiv}>
            <Back name="camera" size={22} style={styles.cameraIcon} />
          </View>

          <TouchableOpacity onPress={() => selectPhoto()}>
            <Avatar.Image
              size={140}
              style={styles.avatar}
              source={{
                uri:
                 image==""|| image==null
                    ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC'
                    : image,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 50,
            marginHorizontal: 22,
          }}>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Usuário(a)</Text>
            <TextInput
              placeholder="Your Name"
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setName(e.nativeEvent.text)}
              defaultValue={name}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>E-mail</Text>
            <TextInput
              editable={false}
              placeholder="E-mail"
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setEmail(e.nativeEvent.text)}
              defaultValue={email}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Data de nascimento</Text>
            <View style={[styles.container,{flexDirection:'row'}]}>
                <Text style={styles.infoEditSecond_text}>{generateDate(birth)}</Text>
                {showPickerBirth && (
                    <DateTimePicker
                    value={birth != null && birth != undefined ? birth : new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeBirthPicker}
                    is24Hour={true}
                    />
                )}
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={showTimePickerBirth}>
                        <Icon name="calendar-clock" size={24} color={"#999797"} />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Profissão</Text>
            <TextInput
              placeholder="Profissão"
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setProfession(e.nativeEvent.text)}
              defaultValue={profession}
            />
          </View>

          {/*<View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Mobile No</Text>
            <TextInput
              placeholder="Your Mobile No"
              placeholderTextColor={'#999797'}
              keyboardType="numeric"
              maxLength={10}
              style={styles.infoEditSecond_text}
              onChange={e => setMobile(e.nativeEvent.text)}
              defaultValue={mobile}
            />
          </View>*/}
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => handleBackPress()}
            style={styles.inBut}>
            <View>
              <Text style={styles.textSign}>Atualizar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default UpdateProfile;