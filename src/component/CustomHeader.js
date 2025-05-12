import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../theme/Color';
import Images from '../theme/Images';
import {moderateScale} from '../utils/dimen';

const CustomHeader = ({
  container,
  centerView,
  rightView,
  leftView,
  shadow,
  goBack,
  title,
  subTitle,
  subTitleStyle,
  showBack = true,
  showGradient = false,
  titleStyle,
  backImageStyle,
  backImgContainer,
  backTxtStyle,
  backIconTintColor,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainBg,
        {
          paddingTop: insets.top,
        },
        container,
        shadow && styles.shadowView,
      ]}>
      <View style={styles.view3}>
        {leftView && leftView()}
        {showBack && (
          <TouchableOpacity
            style={[styles.backContainer, backImgContainer]}
            onPress={goBack}>
            <Image
              style={backImageStyle ?? styles.backImageStyle}
              resizeMode="contain"
              source={Images.back}
              tintColor={backIconTintColor ?? Colors.white}
            />
            <Text
              style={[
                {
                  marginLeft: 5,
                  fontSize: 16,
                  color: Colors.white,
                  fontWeight: '500',
                },
                backTxtStyle,
              ]}>
              Back
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.flex}>
          {title && (
            <Text
              numberOfLines={1}
              style={StyleSheet.flatten([styles.titleStyle, titleStyle])}>
              {title}
            </Text>
          )}
          {subTitle && (
            <Text
              numberOfLines={1}
              style={StyleSheet.flatten([styles.subTitleStyle, subTitleStyle])}>
              {subTitle}
            </Text>
          )}
        </View>
        {centerView && <View style={styles.view2}>{centerView()}</View>}
        {rightView && rightView()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, alignItems: 'center'},
  gradientImage: {
    position: 'absolute',
  },
  titleStyle: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.black,
    marginLeft: 5,
    marginRight: 70,
  },
  subTitleStyle: {
    fontWeight: '400',
    fontSize: 12,
    color: Colors.blue,
    marginLeft: 5,
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
  },
  centerContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  backContainer: {
    zIndex: 100,
    height: 45,
    width: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  view2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  view3: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
  },
  mainBg: {
    width: '100%',
    backgroundColor: Colors.green,
    paddingHorizontal: 20,
  },
  shadowView: {
    shadowColor: Colors.blue,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  overlayBg: {},
  centerView: {},
  backImageStyle: {
    height: 18,
    width: 18,
  },
});

export default CustomHeader;
