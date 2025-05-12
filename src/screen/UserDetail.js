import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';
import GiftedChatUI from '../component/GiftedChatUI';
import UserDetailHeader from '../component/UserDetailHeader';
import Colors from '../theme/Color';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import getUserInfo from '../utils/GetUserInfo';

const UserDetailScreen = ({navigation, route}) => {
  const {user, currentUser} = route?.params;

  const chatId =
    currentUser?.userId > user?.userId
      ? `${currentUser?.userId}_${user.userId}`
      : `${user.userId}_${currentUser?.userId}`;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onClickBack,
    );

    // Cleanup the listener when the component unmounts
    return () => backHandler.remove();
  }, []);

  const myAccontChatRef = firestore()
    .collection('chats')
    .doc(chatId)
    .collection('users')
    .doc(currentUser?.userId);

  const onClickBack = async () => {
    // navigation.goBack();
    const addMydata = {
      isTyping: false,
      isAvailable: false,
      createdAt: new Date(),
    };
    await myAccontChatRef.set(addMydata);
    navigation.goBack();
    return true;
  };

  return (
    <View style={styles.container}>
      <UserDetailHeader userData={user} onClickBack={() => onClickBack()} />
      {user != null && currentUser != null && (
        <GiftedChatUI user={user} navigation={null} currentUser={currentUser} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green,
  },
});

export default UserDetailScreen;
