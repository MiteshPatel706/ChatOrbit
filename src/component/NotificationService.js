import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const setupNotificationHandlers = async () => {
  // Request notification permissions
  const authStatus = await messaging().requestPermission();
  const isPermissionGranted =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!isPermissionGranted) {
    Alert.alert(
      'Permission denied',
      'Please enable notifications in settings.',
    );
    return;
  }

  console.log('Notification permissions granted.');

  // Get the device's FCM token
  const fcmToken = await messaging().getToken();
  console.log('FCM Token:', fcmToken);

  // Listen for foreground notifications
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground Notification:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title ?? 'New Notification',
      remoteMessage.notification?.body ?? 'You have a new message!',
    );
  });

  // Listen for notifications when the app is opened from the background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('App opened from background by Notification:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title ?? 'Notification Clicked',
      remoteMessage.notification?.body ?? 'You clicked a notification!',
    );
  });

  // Handle the case when the app is opened from a quit state
  const initialNotification = await messaging().getInitialNotification();
  if (initialNotification) {
    console.log(
      'App opened from quit state by Notification:',
      initialNotification,
    );
    Alert.alert(
      initialNotification.notification?.title ?? 'Initial Notification',
      initialNotification.notification?.body ??
        'The app was opened by a notification.',
    );
  }
};
