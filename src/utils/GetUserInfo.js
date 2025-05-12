import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserInfo = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');

    if (userData == undefined) {
      return undefined;
    } else {
      return JSON.parse(userData);
    }
  } catch (e) {
    return undefined;
  }
};

export default getUserInfo;
