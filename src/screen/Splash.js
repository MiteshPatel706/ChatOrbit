import React, {useEffect, useRef} from 'react';
import {Animated, View, Image, StyleSheet} from 'react-native';
import Images from '../theme/Images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommanStyle from '../theme/CommanStyle';
import getUserInfo from '../utils/GetUserInfo';
import Store from '../Store/Store';

const SplashScreen = ({onAnimationEnd, navigation}) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const setIsLoaderVisible = Store(state => state.setIsLoaderVisible);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 500,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onAnimationEnd) onAnimationEnd();
    });

    setTimeout(() => {
      getUserInfo().then(info => {
        if (
          info?.userId != undefined &&
          info.userId != null &&
          info?.userId != ''
        ) {
          navigation.reset({
            index: 0,
            routes: [{name: 'BottomTabNavigation'}],
          });
          setIsLoaderVisible(true);
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'LoginScreen'}],
          });
        }
      });
    }, 1800);
  }, [logoOpacity, logoScale, onAnimationEnd]);

  return (
    <View style={CommanStyle.containerItemCenter}>
      <Animated.Image
        source={Images.AppIcon}
        style={[
          styles.logo,
          {opacity: logoOpacity, transform: [{scale: logoScale}]},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
