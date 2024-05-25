import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import { loginUser,fetchUserData } from '../components/api';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const { t } = React.useContext(AppContext)

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      console.log(data);
      await AsyncStorage.setItem('userToken', data.token);
      const userData = await fetchUserData(data.token);
      console.log(userData);
      await AsyncStorage.setItem('userId', userData[0].id.toString());
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Title style={styles.title}>{t('login')}</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        theme={theme}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        theme={theme}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button} theme={theme}>
      {t('login')}
      </Button>
      <Button onPress={() => navigation.navigate('Register')} style={styles.link} theme={theme}>
      {t('go-to-register')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  link: {
    marginTop: 8,
  },
});

export default LoginScreen;
