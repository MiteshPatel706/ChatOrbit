import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Image,
  Platform,
} from 'react-native';
import Colors from '../theme/Color';

const CustomButton = ({
  onPress,
  customStyle,
  title,
  titleStyle,
  disable,
  leftImg,
  leftImgStyle,
  rightImg,
  rightImgStyle,
  rightIconView,
  rightIconHide,
}) => {
  return (
    <TouchableOpacity
      disabled={disable}
      activeOpacity={0.8}
      onPress={() => {
        onPress();
      }}
      style={[styles.button, customStyle, disable && styles.disableButton]}>
      {leftImg && (
        <Image
          style={[styles.leftIcon, leftImgStyle]}
          resizeMode="contain"
          source={leftImg}
        />
      )}
      <Text
        style={[styles.ButtonText, titleStyle, disable && styles.disableText]}>
        {title}
      </Text>
      {!rightIconHide && (
        <></>
        // <Image
        //   style={rightImgStyle ? rightImgStyle : [styles.rightImg]}
        //   resizeMode="contain"
        //   source={rightImg ? rightImg : Images.rightLineArrow}
        // />
      )}
      {rightIconView && rightIconView()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    width: '100%',
    paddingVertical: Platform.OS == 'android' ? 17 : 14,
    marginTop: 9,
  },
  disableButton: {
    backgroundColor: Colors.grey_text,
  },
  ButtonText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  disableText: {
    color: Colors.greyPlaceholder,
  },
  leftIcon: {marginRight: 8, width: 14, height: 14},
  rightImg: {marginLeft: 15, tintColor: Colors.white},
});

export default CustomButton;
