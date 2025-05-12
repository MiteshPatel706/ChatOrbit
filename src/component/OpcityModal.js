import React, {useEffect} from 'react';
import {
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../theme/Color';
import {height, width} from '../utils/dimen';

const OpcityModal = ({
  isVisible,
  onClose,
  children,
  isOutSideDisable = false,
  contentConstainerStyle,
  containerStyle,
  animationType,
  onRequestClose,
}) => {
  useEffect(() => {
    StatusBar.setTranslucent(true);
  }, []);
  return (
    <>
      {isVisible && (
        <>
          <StatusBar backgroundColor={Colors.green} />
          <View style={styles.modelContainer}>
            <Modal
              transparent
              visible={isVisible}
              animationType={animationType ?? 'slide'}
              onRequestClose={onRequestClose}>
              <View style={[styles.container, containerStyle]}>
                <TouchableOpacity
                  disabled={isOutSideDisable}
                  activeOpacity={1}
                  onPress={onClose}
                  style={styles.overlay}
                />
                <View style={[styles.modalContent]}>{children}</View>
              </View>
            </Modal>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    // backgroundColor: Color.black + '70',
  },
  modalContent: {
    width: '100%',
  },
  modelContainer: {
    height: height,
    backgroundColor: Colors.black + '60',
    position: 'absolute',
    width: width,
    zIndex: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default OpcityModal;
