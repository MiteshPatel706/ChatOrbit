import {Alert, Linking} from 'react-native';
import {
  request,
  check,
  RESULTS,
  Permission,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';

let permissionDeniedCont = 0;
let permissionArr = [];

const checkPermission = async permission => {
  const result = await check(permission);
  if (permissionArr.length == 0) {
    permissionDeniedCont = 1;
    permissionArr.push(permission);
  } else {
    let a = permissionArr.filter(r => r == permission).length > 0;
    if (a) {
      permissionDeniedCont = 2;
    } else {
      permissionArr.push(permission);
      permissionDeniedCont = 1;
    }
  }
  return checkPermissionResult(result, permission, permissionDeniedCont);
};

const requestPermission = async permission => {
  const result = await request(permission);
  if (
    result === RESULTS.BLOCKED ||
    result === RESULTS.UNAVAILABLE ||
    result === RESULTS.DENIED
  ) {
    return false;
  }
  return true;
};

const checkPermissionResult = (result, permission, count) => {
  return new Promise(async resolve => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        showPopWithPermission(permission);
        resolve(RESULTS.UNAVAILABLE);
        break;
      case RESULTS.DENIED:
        // console.log('The permission is denied and not requestable anymore');
        console.log('permissionDeniedCont', count);

        if (count > 1) {
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          showPopWithPermission(permission);
          resolve(RESULTS.DENIED);
        } else {
          let r = await requestPermission(permission);
          if (r) {
            resolve(RESULTS.GRANTED);
          }
        }

        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        resolve(RESULTS.LIMITED);
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        resolve(RESULTS.GRANTED);
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        showPopWithPermission(permission);
        resolve(RESULTS.BLOCKED);
        break;
    }
  });
};

const showPopWithPermission = permission => {
  if (
    PERMISSIONS.IOS.PHOTO_LIBRARY === permission ||
    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES == permission ||
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE == permission
  ) {
    showPermissionSettingPopup(t('photoPermisssion'), t('photosIsRequired'));
  } else if (
    PERMISSIONS.ANDROID.CAMERA == permission ||
    PERMISSIONS.IOS.CAMERA == permission
  ) {
    showPermissionSettingPopup(t('cameraPermisssion'), t('cameraIsRequired'));
  }
};

export const showPermissionSettingPopup = (title, description) => {
  Alert.alert(title, description, [
    {
      text: 'Cancel',
    },
    {
      text: 'Settings',
      onPress: () => openSettings(),
    },
  ]);
};

export default checkPermission;
