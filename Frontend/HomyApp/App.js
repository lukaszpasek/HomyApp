import { StyleSheet, View,Text,TouchableOpacity } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen"; 
import RegisterScreen from "./src/screens/RegisterScreen"; 
import ProfileScreen from "./src/screens/ProfileScreen";

const Stack = createStackNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ea',
  },
};

export default function App() {
  AsyncStorage.removeItem('userToken');
  return (
  <PaperProvider theme={theme}>
    <NavigationContainer>
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
                <AntDesign name="user" size={20} color="black" />
                <Text style={styles.navButtonText}>Profile</Text>
              </TouchableOpacity>
            </View>
            ),
          })}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
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
                <AntDesign name="adduser" size={20} color="black" />
                <Text style={styles.navButtonText}>Register</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
  navButtonText: {
    marginLeft: 5,
    color: 'black',
  },
});
