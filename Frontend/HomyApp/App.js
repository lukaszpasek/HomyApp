import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import i18next from './src/services/i18next';
import {useTranslation} from 'react-i18next';
import { AppContext } from './src/context/AppContext';
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Stack = createStackNavigator();


const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0A84FF',
    background: '#141a1f',
    card: '#202934',
    text: '#fbfefe',
    border: '#272729',
    notification: '#FF453A',
    placeholder: '#9a9ea4',
    descriptionText: '#9cabc2',
    buttonBackground: '#344457',
    income: '#2ecc71',
    incomeBackground: 'rgba(46, 204, 113, 0.2)',
    expense: '#e74c3c',
    expenseBackground: 'rgba(231, 76, 60, 0.2)',
    welcomeText: {
      fontSize: 24,
      marginBottom: 20,
      color: 'white',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: 'blue',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    button: {
      backgroundColor: 'blue',
      color: 'white',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
    },
  },
};

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ea',
    welcomeText: {
      fontSize: 24,
      marginBottom: 20,
      color: 'black',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: '#6200ea',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'black',
    },
    button: {
      backgroundColor: '#6200ea',
      color: 'white',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
    },
  },
};

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const {t} = useTranslation();
  const changeLng = () => {
  const newLanguage = i18next.language === 'en' ? 'pl' : 'en';
  i18next.changeLanguage(newLanguage);
  };

  const appContext = useMemo(() => {
    return {
      isDarkTheme,
      setIsDarkTheme,
      t,
      changeLng
    };
  }, [isDarkTheme]);

  return (
    <PaperProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
      <AppContext.Provider value={appContext}>
        <NavigationContainer theme={isDarkTheme ? DarkTheme : LightTheme}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                headerLeft: null,
                headerRight: () => (
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={styles.navButton}
                      onPress={() => navigation.navigate('Profile')}
                    >
                      <AntDesign name="user" size={20} color={isDarkTheme ? 'white' : 'black'} />
                      <Text style={isDarkTheme ? styles.navButtonDark : styles.navButtonText}>{t('profile')}</Text>
                    </TouchableOpacity>
                  </View>
                ),
                headerTitleStyle: {
                  color: isDarkTheme ? 'white' : 'black',
                  display: 'none',
                },
              })}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={() => ({
                headerTitleStyle: {
                  color: isDarkTheme ? 'white' : 'black',
                  display: 'none',
                },
              })}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={() => ({
                headerTitleStyle: {
                  color: isDarkTheme ? 'white' : 'black',
                  display: 'none',
                },
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={({ navigation }) => ({
                headerRight: () => (
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Register')}
                  >
                    <AntDesign name="adduser" size={20} color={isDarkTheme ? 'white' : 'black'} />
                    <Text style={isDarkTheme ? styles.navButtonDark : styles.navButtonText}>{t('register')}</Text>
                  </TouchableOpacity>
                ),
                headerTitleStyle: {
                  color: isDarkTheme ? 'white' : 'black',
                  display: 'none',
                },
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtonDark: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
  },
  navButtonText: {
    marginLeft: 5,
    color: 'black',
  },
});
