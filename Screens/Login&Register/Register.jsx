const { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } = require('react-native');
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Error from 'react-native-vector-icons/MaterialIcons';
import {useState} from 'react';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
  
function RegisterPage({props}) {
const [name, setName] = useState('');
const [nameVerify, setNameVerify] = useState(false);
const [email, setEmail] = useState('');
const [emailVerify, setEmailVerify] = useState(false);
const [birth, setBirth] = useState(new Date());
const [birthVerify, setBirthVerify] = useState(false);
const [password, setPassword] = useState('');
const [passwordVerify, setPasswordVerify] = useState(false);
const [showPassword, setShowPassword] = useState(true);
const [userType, setUserType] = useState('User');
const [secretText, setSecretText] = useState('');

const [showPickerBirth, setShowPickerBirth] = useState(false);

const navigation = useNavigation();

function handleSubmit(){
    const userData={
        name: name,
        email: email,
        birth: birth,
        password: password,
        userType: userType,
    };

    //Se usamos localhost no lado do front, ele pega informação do proprio device e não do servidor, por isso que precisa ser o ip do pc
    if(nameVerify && emailVerify && birthVerify && passwordVerify){
        if (userType == 'Admin' && secretText != 'Text1243') {
            return Alert.alert('Invalid Admin');
        }
        
        //axios.post("http://192.168.100.32:5002/register", userData)
        axios.post("https://classregserver.onrender.com/register", userData)
        .then((res) => {
            console.log(res.data);
            if(res.data.status == 'ok'){
                Alert.alert('Cadastro realizado');
                navigation.navigate("Login");
            }else{
                console.log(res.data);
                Alert.alert(JSON.stringify(res.data));
            }
        })
        .catch(e => {
            console.log(JSON.stringify(e));
        });
    }
    else{
        //Alert.alert("Fill mandatory details");
        Toast.show({
            type: 'error',
            text: 'Erro',
            text2: 'Preencha todos os campos corretamente',
            visibilityTime: 5000,
        }, 2000);
    }
}

function handleName(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerify(false);

    if (nameVar.length > 1) {
    setNameVerify(true);
    }
}
function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
    setEmail(emailVar);
    setEmailVerify(true);
    }
}
function handleBirth(e) {
    const birthVar = e;
    setBirth(birthVar);
    setBirthVerify(false);
    if (birthVar - new Date() < 0) {
        setBirth(birthVar);
        setBirthVerify(true);
    }
}
function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
    setPassword(passwordVar);
    setPasswordVerify(true);
    }
}
const onChangeBirthPicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowPickerBirth(false);
    handleBirth(currentDate);
};
const showTimePickerBirth = () => {
    setShowPickerBirth(true);
  };
return (
    <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        //   keyboardShouldPersistTaps={true}
        style={{backgroundColor: 'white'}}>
        <View>
            <View style={styles.logoContainer}>
            <Image
                style={styles.logo}
                source={require('../../assets/signin.png')}
            />
            </View>
            <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Cadastro de Usuário</Text>
            
            <View style={styles.radioButton_div}>
                <Text style={styles.radioButton_title}>             </Text>
                <View style={styles.radioButton_inner_div}>
                <Text style={styles.radioButton_text}>Comum</Text>
                <RadioButton
                    
                    value="User"
                    status={userType == 'User' || (userType != 'User' && userType != 'Admin') ? 'checked' : 'unchecked'}
                    onPress={() => setUserType('User')}
                    color='orange'
                    uncheckedColor='orange'
                />
                </View>
                {/*<View style={styles.radioButton_inner_div}>
                <Text style={styles.radioButton_text}>Admn.</Text>
                <RadioButton
                    value="Admin"
                    status={userType == 'Admin' ? 'checked' : 'unchecked'}
                    onPress={() => setUserType('Admin')}
                    color='orange'
                    uncheckedColor='orange'
                />
                </View>*/}
            </View>
            
            {userType == 'Admin' ? (
                <View style={styles.action}>
                <FontAwesome
                    name="user-o"
                    color="orange"
                    style={styles.smallIcon}
                />
                <TextInput
                    placeholder="Código de Validação"
                    style={styles.textInput}
                    onChange={e => setSecretText(e.nativeEvent.text)}
                />
                </View>
            ) : (
                ''
            )}

            <View style={styles.action}>
                <FontAwesome
                name="user-o"
                color="orange"
                style={styles.smallIcon}
                />
                <TextInput
                placeholder="Nome"
                style={styles.textInput}
                onChange={e => handleName(e)}
                />
                {name.length < 1 ? null : nameVerify ? (
                <Feather name="check-circle" color="green" size={20} />
                ) : (
                <Error name="error" color="red" size={20} />
                )}
            </View>
            {name.length < 1 ? null : nameVerify ? null : (
                <Text
                style={{
                    marginLeft: 20,
                    color: 'red',
                }}>
                Nome deve ter mais caracteres
                </Text>
            )}
            <View style={styles.action}>
                <Fontisto
                name="email"
                color="orange"
                size={24}
                style={{marginLeft: 0, paddingRight: 5}}
                />
                <TextInput
                placeholder="E-mail"
                style={styles.textInput}
                onChange={e => handleEmail(e)}
                />
                {email.length < 1 ? null : emailVerify ? (
                <Feather name="check-circle" color="green" size={20} />
                ) : (
                <Error name="error" color="red" size={20} />
                )}
            </View>
            {email.length < 1 ? null : emailVerify ? null : (
                <Text
                style={{
                    marginLeft: 20,
                    color: 'red',
                }}>
                Informe um e-mail válido
                </Text>
            )}
            <View style={styles.action}>
                <FontAwesome
                name="calendar"
                color="orange"
                size={20}
                style={{paddingRight: 10, marginTop: -5, marginLeft: 3}}
                />

                {showPickerBirth && (
                    <DateTimePicker
                    value={birth != null ? birth : new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeBirthPicker}
                    is24Hour={true}
                    />
                )}
                <TouchableOpacity style={[styles.textInput,{paddingTop:3}]} onPress={showTimePickerBirth}>
                <TextInput
                    placeholder="Data de Nascimento"
                    editable={false}
                />
                </TouchableOpacity>

                {birthVerify ? (
                <Feather name="check-circle" color="green" size={20} />
                ) : (
                <Error name="error" color="red" size={20} />
                )}
            </View>
            {birthVerify ? null : (
                <Text
                style={{
                    marginLeft: 20,
                    color: 'red',
                }}>
                Insert a date
                </Text>
            )}
            <View style={styles.action}>
                <FontAwesome name="lock" color="orange" style={styles.smallIcon} />
                <TextInput
                placeholder="Senha"
                style={styles.textInput}
                onChange={e => handlePassword(e)}
                secureTextEntry={showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length < 1 ? null : !showPassword ? (
                    <Feather
                    name="eye-off"
                    style={{marginRight: -10}}
                    color={passwordVerify ? 'green' : 'red'}
                    size={23}
                    />
                ) : (
                    <Feather
                    name="eye"
                    style={{marginRight: -10}}
                    color={passwordVerify ? 'green' : 'red'}
                    size={23}
                    />
                )}
                </TouchableOpacity>
            </View>
            {password.length < 1 ? null : passwordVerify ? null : (
                <Text
                style={{
                    marginLeft: 20,
                    color: 'red',
                }}>
                Uppercase, Lowercase, Number and 6 or more characters.
                </Text>
            )}
            </View>
            <View style={styles.button}>
            <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
                <View>
                <Text style={styles.textSign}>Cadastrar</Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    );
}

export default RegisterPage;