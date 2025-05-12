import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../theme/Color';
import Images from '../theme/Images';

const ProfileDetaitem = ({
  icon,
  lable,
  value,
  onEdit,
  placeHolder,
  numberOfLines,
  disabled,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={25} color={Colors.grey2} />
      <View style={{flex: 1}}>
        <Text style={styles.lable} numberOfLines={1}>
          {lable}
        </Text>
        <Text
          // style={[styles.value, {color: value ? Colors.black : Colors.grey2}]}
          style={[!!value ? styles.value : styles.lable]}
          numberOfLines={numberOfLines ?? 1}>
          {!!value ? value : placeHolder}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onEdit(lable, value)}
        disabled={disabled}>
        <Image
          source={Images.edit}
          style={{height: 20, width: 20}}
          tintColor={disabled ? Colors.grey2 : Colors.green}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileDetaitem;

const styles = StyleSheet.create({
  value: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
    lineHeight: 18,
  },
  lable: {
    fontSize: 15,
    color: Colors.grey2,
    fontWeight: '400',
    lineHeight: 18,
  },
  container: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.grey2,
    padding: 10,
    elevation: 5,
    borderRadius: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
