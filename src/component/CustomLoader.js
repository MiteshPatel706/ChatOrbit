import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Colors from '../theme/Color';
import OpcityModal from './OpcityModal';
import LottieView from 'lottie-react-native';
import Lotties from '../theme/Lotties';

const CustomLoader = ({isVisible}) => {
  return (
    <OpcityModal
      isVisible={isVisible}
      onClose={() => null}
      onRequestClose={() => null}>
      {/* <ActivityIndicator
        size={'large'}
        color={Colors.green}
        animationType={'none'}
      /> */}
      <View
        style={{
          alignSelf: 'center',
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 80,
        }}>
        <LottieView
          source={Lotties.loaderAnimation}
          autoPlay
          loop
          style={{
            height: 55,
            width: 55,
          }}
        />
      </View>
    </OpcityModal>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({});
