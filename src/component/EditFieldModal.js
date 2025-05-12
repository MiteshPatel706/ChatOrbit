import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import OpcityModal from './OpcityModal';
import Colors from '../theme/Color';
import Store from '../Store/Store';
import firestore from '@react-native-firebase/firestore';

const EditFieldModal = ({
  isVisible,
  onClose,
  lable,
  placeholder,
  value,
  onChangeText,
  userId,
}) => {
  const editInputRef = useRef(null);
  const setToastData = Store(state => state.setToastData);

  useEffect(() => {
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 100);
  }, []);

  const handleSave = () => {
    if (value != undefined && value != null && value != '') {
      onClose();
      let saveValue;

      switch (lable) {
        case 'Name':
          saveValue = {name: value};
          break;
        case 'About':
          saveValue = {about: value};
          break;
        case 'Nick Name':
          saveValue = {nickName: value};
          break;
        case 'Phone':
          saveValue = {phoneNo: value};
          break;
      }
      firestore()
        .collection('users')
        .doc(userId)
        .update(saveValue)
        .then(() => {
          setToastData({
            type: 1,
            text1: `${lable} updated successfully`,
            text2: '',
            iconType: '',
            isVisible: true,
          });
        })
        .catch(e => {
          console.log(e, '==-=-=-=-');
          setToastData({
            type: 0,
            text1: e,
            text2: '',
            iconType: '',
            isVisible: true,
          });
        });
    } else {
      setToastData({
        type: 0,
        text1: placeholder,
        text2: '',
        iconType: '',
        isVisible: true,
      });
    }
  };

  return (
    <OpcityModal
      isVisible={isVisible}
      onClose={() => onClose()}
      onRequestClose={() => onClose()}
      containerStyle={{justifyContent: 'flex-end'}}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{lable}</Text>
        <TextInput
          ref={editInputRef}
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={lable == 'Phone' ? 'numeric' : 'email-address'}
          onSubmitEditing={() => handleSave()}
          multiline={lable == 'About'}
          placeholderTextColor={Colors.black}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OpcityModal>
  );
};

export default EditFieldModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 25,
    paddingVertical: 30,
    elevation: 5,
    elevation: 2,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.black,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    elevation: 4,
    marginBottom: 20,
    color: Colors.black,
    fontWeight: '',
    maxHeight: 100,
    color: Colors.black,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // borderWidth: 0.5,
    // borderColor: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: Colors.green,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {backgroundColor: '#f0f0f0'},
  buttonText: {color: '#fff', fontWeight: 'bold'},
  cancelButtonText: {color: '#000'},
});
