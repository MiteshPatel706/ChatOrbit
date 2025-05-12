import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import Store from '../Store/Store';
import Colors from '../theme/Color';

const {width} = Dimensions.get('window');

const CustomToast = () => {
  const {isVisible, text1, text2, type, iconType} = Store(
    state => state.toastData,
  );

  const setToastData = Store(state => state.setToastData);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -150,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setToastData({
            type: 1,
            text1: '',
            text2: '',
            iconType: '',
            isVisible: false,
          });
        });
      }, 4000); // Show for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    isVisible && (
      <Animated.View
        style={[
          styles.toastContainer,
          {
            opacity,
            transform: [{translateY}],
            backgroundColor: type ? Colors.blue : Colors.red1,
          },
        ]}>
        <View style={styles.toastBody}>
          {/* <Image source={iconType ?? Images.infoIc} style={[styles.icon]} /> */}
          <View style={{marginLeft: 10}}>
            <Text numberOfLines={2} style={styles.titleTxt}>
              {text1}
            </Text>
            {text2 ? (
              <Text numberOfLines={3} style={styles.desTxt}>
                {text2}
              </Text>
            ) : null}
          </View>
        </View>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    width: width - 50,
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  toastBody: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    tintColor: Colors.white,
    height: 24,
    width: 24,
    resizeMode: 'center',
  },
  titleTxt: {
    color: Colors.white,
    width: width - 116,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
  desTxt: {
    color: Colors.white + '90',
    width: width - 116,
    fontFamily: '400',
    fontSize: 12,
    lineHeight: 14,
  },
});

export default CustomToast;
