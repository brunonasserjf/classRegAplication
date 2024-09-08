const { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } = require('react-native');
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

function LoginPage({props}) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  function handleSubmit() {
    const userData = {
      email: email,
      password,
    };

    console.log(userData.email, userData.password);
    //axios.post('http://192.168.100.32:5002/login-user', userData).then(res => {
    axios.post('https://classregserver.onrender.com/login-user', userData).then(res => {      
      console.log(res.data);
      if (res.data.status == 'ok') {
        //Alert.alert('Logged In Successfull');
        
        AsyncStorage.setItem('token', res.data.data);
        console.log("Token: " + res.data.data);
        AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        AsyncStorage.setItem('userType',res.data.userType);
        // navigation.navigate('Home');
        if(res.data.userType=="Admin"){
           navigation.navigate('AdminScreen');
        }else{
          navigation.navigate('Home');
        }
      
      }else{
        Toast.show({
          type: 'error',
          text: 'Erro',
          text2: (res.data.data != null && res.data.data != "" ? res.data.data : "Erro ao realizar login"),
          visibilityTime: 5000,
      }, 2000);
      }
    });
  }
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    
    //console.log(data, 'at app.jsx');
  
  }
  useEffect(()=>{
    getData();
    //console.log("Hii");
  },[])

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps={'always'}>
      <View style={{backgroundColor: 'white'}}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/icon.png')}
          />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>Tela Inicial</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="orange" style={styles.smallIcon} />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              onChange={e => setEmail(e.nativeEvent.text)}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="lock" color="orange" style={styles.smallIcon} />
            <TextInput
              placeholder="Senha"
              style={styles.textInput}
              onChange={e => setPassword(e.nativeEvent.text)}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length < 1 ? null : !showPassword ? (
                    <Feather
                    name="eye-off"
                    style={{marginRight: -10, marginTop: -5}}
                    size={23}
                    color='orange'
                    />
                ) : (
                    <Feather
                    name="eye"
                    style={{marginRight: -10, marginTop: -5}}
                    size={23}
                    color='orange'
                    />
                )}
                </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginTop: 8,
              marginRight: 10,
            }}>
            <Text style={{color: 'orange', fontWeight: '700', display:'none'}}>
              Forgot Password
            </Text>
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
            <View>
              <Text style={styles.textSign}>Entrar</Text>
            </View>
          </TouchableOpacity>

          <View style={{padding: 15}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#919191'}}>
              ----- Ou entre por -----
            </Text>
          </View>
          <View style={styles.bottomButton}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
              }}>
              <TouchableOpacity style={styles.inBut2}>
                <FontAwesome
                  name="user-circle-o"
                  color="white"
                  style={styles.smallIcon2}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Login 1</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
              }}>
              <TouchableOpacity
                style={styles.inBut2}>
                <FontAwesome
                  name="user-circle-o"
                  color="white"
                  style={styles.bottomText}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Login 2</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
              }}>
              <TouchableOpacity
                style={styles.inBut2}>
                <FontAwesome
                  name="facebook-f"
                  color="white"
                  style={styles.bottomText}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Login 3</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={styles.inBut2}
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                <FontAwesome
                  name="user-plus"
                  color="white"
                  //style={[styles.smallIcon2, {fontSize: 30}]} //Quando for importar e quiser colocar mais um estilizado
                  style={styles.smallIcon2}
                />
              </TouchableOpacity>
              <Text style={[styles.bottomText, {color: '#919191'}]}>Cadastro</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
export default LoginPage;