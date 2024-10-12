import 'react-native-gesture-handler';
import 'react-native-safe-area-context';
import 'react-native-reanimated';
import { Text, ActivityIndicator, AppRegistry } from "react-native"
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import UserScreen from "./Screens/UserScreen";
import DrawerContent from './DrawerContent';
import LoginPage from "./Screens/Login&Register/Login";
import RegisterPage from "./Screens/Login&Register/Register";
import UpdateProfile from './Screens/UpdateProfile/UpdateProfile';
import AdminScreen from './Screens/AdminScreen';
import ShowProfile from './Screens/UpdateProfile/showProfile';
import PseudoHome1 from "./Screens/PseudoHome1";
import UpdateClass from "./Screens/Class/UpdateClass";
import { useState, useEffect } from "react";
import ReportScreen from "./Screens/Report/Report";
import ReportPage from "./Screens/Report/reportPage";
import ReportPageContent from "./Screens/Report/reportPageContent";

AppRegistry.registerComponent("main", () => App);

//Toastr customizado de sucesso e erro
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'green',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text2NumberOfLines={3}
      style={{
        borderLeftColor: 'red',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'red',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  )
};

//Navegação depois que o usuário já esta logado
const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return(
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        statusBarColor: "orange", //#ffa16e
        headerShown: false,
        headerStyle:{
          backgroundColor: "orange"
        },
        headerTintColor: '#ffffff',
        headerTitleAlign: "center",
      }}>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerLeft: () => {
            return(
              <Icon 
                name="menu"
                onPress={()=>{navigation.dispatch(DrawerActions.openDrawer());}}
                size={30}
                color="#ffffff"
              />
            );
          }
        }}
        >
      </Stack.Screen>
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}>
      </Stack.Screen>
      <Stack.Screen 
        name="User" 
        component={UserScreen}
        options={{
          headerShown: false,
        }}>
      </Stack.Screen>
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        screenOptions={{
          statusBarColor: "orange", //#ffa16e
          headerShown: false,
          headerStyle:{
            backgroundColor: "orange"
          },
          headerTintColor: '#ffffff',
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen name="LoginUser" component={LoginNav} />
      <Stack.Screen name="ShowProfile" component={ShowProfile} />
      <Stack.Screen name="PseudoHome1" component={PseudoHome1} />
      <Stack.Screen name="UpdateClass" component={UpdateClass} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} />
      <Stack.Screen name="ReportPage" component={ReportPage} />
      <Stack.Screen name="ReportPageContent" component={ReportPageContent} />
    </Stack.Navigator>
  )
}

//Menu lateral - Navegação
const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      >
      <Drawer.Screen name="Home" component={StackNav} />
    </Drawer.Navigator>
  );
};

//Navegação de login
const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Home" component={DrawerNav} />
      <Stack.Screen name="AdminScreen" component={AdminStack} />
    </Stack.Navigator>
  );
};

//Navegação de admin depois que loga
const AdminStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          statusBarColor: '#0163d2',
          headerShown: true,
          headerBackVisible:false,
          headerStyle: {
            backgroundColor: '#0163d2',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
        name="AdminScreen"
        component={AdminScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={LoginNav}
      />
    </Stack.Navigator>
  );
};

function App(){
  const [isLoggedIn, setIsLoggedIn] = useState(false); //Se já esta logado
  const [userType, setUserType] = useState(false); //Se é usuário normal ou admin

  //Pega informações localmente no celular
  async function getData(){
    const data = await AsyncStorage.getItem('isLoggedIn');
    const userType1 = await AsyncStorage.getItem("userType");
    //console.log(data, 'at app.jsx');
    setIsLoggedIn(data);
    setUserType(userType1);
  }

  useEffect(() => {
    getData();
  }, []);

  //Cria navegação, se for admin logado vai para um, se não for admin mas estiver logado vai para outro e se não tiver logado vai para um terceiro
  const Stack = createNativeStackNavigator();
  return(
    <NavigationContainer>
      {isLoggedIn && userType == 'Admin' ? <AdminStack /> : (isLoggedIn ? <DrawerNav /> : <LoginNav />)}
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;