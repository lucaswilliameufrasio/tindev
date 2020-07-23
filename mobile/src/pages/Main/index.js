import React, {useState, useEffect} from 'react';
import {SafeAreaView, Image, View, Text, TouchableOpacity} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';
import io from 'socket.io-client';

import styles from './styles';

import logo from '../../assets/logo.png';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import itsamatch from '../../assets/itsamatch.png';

const Main = () => {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  const navigation = useNavigation();

  const route = useRoute();
  const userId = route.params.param;

  useEffect(() => {
    async function loadUsers() {
      if (userId) {
        const response = await api.get('/devs', {
          headers: {
            user: userId,
          },
        });

        setUsers(response.data);
      }
    }

    loadUsers();
  }, [userId]);

  useEffect(() => {
    const socket = io('http://10.0.2.2:7777', {
      query: {user: userId},
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });
  }, [userId]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: {
        user: userId,
      },
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {
        user: userId,
      },
    });

    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {
        user: userId,
      },
    });

    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>{'Acabou :('}</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, {zIndex: users.length - index}]}>
              <Image
                style={styles.avatar}
                source={{
                  uri: user.avatar,
                }}
              />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      )}

      {!!matchDev && (
        <View style={styles.matchContainer}>
          <Image style={styles.matchImage} source={itsamatch} />
          <Image
            style={styles.matchAvatar}
            source={{
              uri: matchDev.avatar,
            }}
          />

          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>

          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Main;
