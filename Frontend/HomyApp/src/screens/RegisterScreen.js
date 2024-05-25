import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { registerUser } from '../components/api';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const { colors } = useTheme();
  const { t } = React.useContext(AppContext)
  const handleRegister = async () => {
    try {
      await registerUser(email, password);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration Failed:', error);
      Alert.alert('Registration Failed', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={colors.title}>{t('register')}</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleRegister} style={colors.button} theme={theme}>
      {t('register')}
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default RegisterScreen;
