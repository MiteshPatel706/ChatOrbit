import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../theme/Color';
import LazyImageLoading from './LazyImageLoading';
import OpcityModal from './OpcityModal';
import checkPermission from '../utils/PermissionFunctions';
import Store from '../Store/Store';
import {PERMISSIONS, RESULTS} from 'react-native-permissions';

const SelectImage = ({
  isSelectProfilePic,
  confirmImage,
  userImage,
  placeHolder,
  children,
  isCameraDialogOpen,
  onClose,
  onClickCameraIcon,
}) => {
  const setToastData = Store(state => state.setToastData);

  const checkMediaPermission = async () => {
    var permission;
    if (Platform.OS === 'android') {
      const level = await DeviceInfo.getApiLevel();
      if (level >= 33) {
        permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      } else {
        permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    } else {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    }
    let result = await checkPermission(permission);
    console.log('result: ', result);

    if (
      result === RESULTS.BLOCKED ||
      result === RESULTS.UNAVAILABLE ||
      result === RESULTS.DENIED
    ) {
      return false;
    }
    return true;
  };

  const checkCameraPermission = async () => {
    let result = await checkPermission(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    );
    if (
      result === RESULTS.BLOCKED ||
      result === RESULTS.UNAVAILABLE ||
      result === RESULTS.DENIED
    ) {
      return false;
    }
    return true;
  };

  const selectPhotoTapped = async () => {
    onClose();

    let isCameraPermissionAvailable = await checkMediaPermission();
    console.log('isCameraPermissionAvailable:', isCameraPermissionAvailable);
    if (!isCameraPermissionAvailable) {
      setToastData({
        type: 0,
        text1: 'Please allow media to access this feature',
        text2: '',
        iconType: '',
        isVisible: true,
      });
      return;
    }

    var options = {
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.5,
      mediaType: 'photo',
    };

    ImagePicker.openPicker(options)
      .then(data => {
        confirmImage(data);
      })
      .catch(err => {
        // alert(err);
      });
  };

  const cameraClick = async () => {
    // toggleModal();
    onClose();
    let isCameraPermissionAvailable = await checkCameraPermission();
    if (!isCameraPermissionAvailable) {
      setToastData({
        type: 0,
        text1: 'Please allow camera permission to access this feature',
        text2: '',
        iconType: '',
        isVisible: true,
      });
      return;
    }

    var options = {
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.5,
      mediaType: 'photo',
    };

    ImagePicker.openCamera(options)
      .then(data => {
        confirmImage(data);
      })
      .catch(err => {
        // alert(err);
        console.log(err);
      });
  };

  return (
    <>
      {isSelectProfilePic ? (
        <View style={styles.profileView}>
          <LazyImageLoading
            source={{uri: userImage}}
            style={styles.userImage}
            resizeMode={'cover'}
            placeHolder={placeHolder}
          />

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              onClickCameraIcon();
            }}
            style={styles.cameraIcon}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{}}>{children && children}</View>
      )}

      <OpcityModal
        isVisible={isCameraDialogOpen}
        onClose={() => {
          onClose();
        }}
        onRequestClose={() => {
          onClose();
        }}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Image</Text>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => cameraClick()}>
            <View style={styles.iconView}>
              <Ionicons name="camera" size={24} color={Colors.white} />
            </View>
            <Text style={styles.modalOptionText}>Choose From Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => selectPhotoTapped()}>
            <View style={styles.iconView}>
              <Ionicons name="image" size={24} color={Colors.white} />
            </View>
            <Text style={styles.modalOptionText}>Choose From Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => {
              onClose();
            }}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </OpcityModal>
    </>
  );
};

export default SelectImage;

const styles = StyleSheet.create({
  iconView: {
    height: 40,
    width: 40,
    backgroundColor: Colors.green,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBtnText: {
    color: Colors.green,
    fontSize: 18,
    textAlign: 'center',
  },
  imageBtnStyle: {
    backgroundColor: Colors.white,
    borderColor: Colors.green,
    borderWidth: 0.8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  modalCancel: {
    marginTop: 20,
  },

  modalTitle: {
    color: Colors.black,
    textAlign: 'center',
    padding: 6,

    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },

  userImage: {
    width: 117,
    height: 117,
    borderRadius: 117 / 2,
    overflow: 'hidden',
  },
  profileView: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    alignSelf: 'center',
    borderColor: Colors.grey2,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 120 / 2,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green,
  },

  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },

  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 5,
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
    fontWeight: '400',
  },

  modalCancelText: {
    fontSize: 16,
    color: Colors.red1,
    textAlign: 'center',
    fontWeight: '500',
  },
});
