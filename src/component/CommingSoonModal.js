import React, {useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Store from '../Store/Store';
import Colors from '../theme/Color';
import OpcityModal from './OpcityModal';

const CommingSoonModal = () => {
  const CommingSoonData = Store(state => state.CommingSoonData);
  const setCommingSoonData = Store(state => state.setCommingSoonData);

  useEffect(() => {
    StatusBar.setTranslucent(true);
  }, []);

  const handleClose = () => {
    setCommingSoonData({isVisible: false, title: '', description: ''});
  };

  return (
    <OpcityModal
      isVisible={CommingSoonData?.isVisible}
      onClose={handleClose}
      onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{CommingSoonData?.title}</Text>
        <Text style={styles.description}>
          {CommingSoonData?.description ?? 'Comming Soon.....'}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </OpcityModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0, 0,0.29)',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.29)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    elevation: 2,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.black,
    textAlign: 'center',
  },
  description: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Colors.grey_575e64,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    elevation: 2,
    marginBottom: 20,
    color: Colors.black,
    fontWeight: '',
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

export default CommingSoonModal;
