import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import logo from '../../assets/logo.png';

import styles from './styles';

import api from '../../services/api';

const Login = () => {
  const [user, setUser] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('@tindev/user').then(storedUser => {
      if (storedUser) {
        navigateToMainScreenWithParam(storedUser);
      }
    });
  }, []);

  function navigateToMainScreenWithParam(param) {
    navigation.navigate('Main', {
      param,
    });
  }

  async function handleLogin() {
    const response = await api.post('/devs', {username: user});

    const {_id} = response.data;

    await AsyncStorage.setItem('@tindev/user', _id);

    navigateToMainScreenWithParam(_id);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Image source={logo} />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuário do Github"
        placeholderTextColor="#999"
        value={user}
        onChangeText={setUser}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;
