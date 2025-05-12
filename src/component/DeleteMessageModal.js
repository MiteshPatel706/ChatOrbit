import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Store from '../Store/Store';
import OpcityModal from './OpcityModal';
import Colors from '../theme/Color';
import CommanStyle from '../theme/CommanStyle';
import CustomButton from './CustomButton';

const DeleteMessageModal = ({
  isVisible,
  title,
  deleteMessageData,
  onClose,
  onClickDeleteEveryone,
  onClickDeleteMe,
}) => {
  return (
    <OpcityModal
      isVisible={isVisible}
      onClose={onClose}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{title ?? 'Confirm'}</Text>
        <View
          style={[
            CommanStyle.deviderView,
            {
              marginVertical: 0,
            },
          ]}
        />

        <Text style={styles.subTitle}>
          {deleteMessageData?.isCurrentUser
            ? 'Are you sure want you Delete message?'
            : ` Are you sure want you Delete message from ${'efef'}?`}
        </Text>
        <View style={styles.btnGroup}>
          {deleteMessageData?.isCurrentUser && (
            <TouchableOpacity
              style={styles.btnStyle}
              onPress={onClickDeleteEveryone}>
              <Text style={styles.btnName}>Delete for everyone</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btnStyle} onPress={onClickDeleteMe}>
            <Text style={styles.btnName}>Delete for me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnStyle} onPress={onClose}>
            <Text style={[styles.btnName, {color: Colors.red1}]}>Cancle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OpcityModal>
  );
};
export default DeleteMessageModal;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    letterSpacing: 0.7,
  },
  btnName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.green,
  },
  btnStyle: {
    paddingVertical: 5,
  },
  btnGroup: {
    rowGap: 2,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  container: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignSelf: 'center',
  },
  subTitle: {
    marginVertical: 20,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
  },
});
