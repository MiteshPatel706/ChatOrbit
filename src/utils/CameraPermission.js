import {PermissionsAndroid, Platform} from 'react-native';

export const CameraPermission = async () => {
  if (Platform.OS === 'android') {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]).then(result => {
      if (
        result['android.permission.CAMERA'] &&
        result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
      ) {
      }
    });
    return true;
  }
  return false;
};

export default CameraPermission;
