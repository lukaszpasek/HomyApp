import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet,Switch } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useTheme } from 'react-native-paper';
import i18next from '../services/i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserData } from '../components/api';

const ProfileScreen = ({ navigation, route}) => {
  const [user, setUser] = useState(null);
  const { isDarkTheme,setIsDarkTheme,t,changeLng } = React.useContext(AppContext)
  const { colors } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const userData = await fetchUserData(token);
          setUser(userData);
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch user data');
          console.log(error);
        }
      } else {
        navigation.navigate('Login');
      }
    };
  
    fetchUser();
  }, [navigation, route.params]);
  
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={colors.welcomeText}>{t('welcome')} {user[0].userName}</Text>
          <Button title={t('logout')} onPress={handleLogout} />
          <View style={styles.switchcontainer}>
            <View style={styles.switchRow}>
              <Switch value={isDarkTheme} onChange={() => setIsDarkTheme(current => !current)} />
              <Text style={colors.text}>{t('dark-mode')}</Text>
            </View>
            <View style={styles.switchRow}>
              <Switch
                value={i18next.language === 'pl'}
                onValueChange={changeLng}
              />
             <Text style={colors.text}>{t('english')}/{t('polish')}</Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  switchContainer: {
    flex: 1,
    alignItems: 'flex-end', // Przełącznik jest wyrównany do prawej strony
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default ProfileScreen;
