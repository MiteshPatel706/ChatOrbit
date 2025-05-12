import React, {useRef, useState} from 'react';
import {
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Easing,
  Alert,
  Keyboard,
  ScrollView,
} from 'react-native';
import CommanStyle from '../theme/CommanStyle';
import {getFirstInstallTime} from 'react-native-device-info';
import {ZegoUIKitUserLogin} from '../utils/ZegoUIKitUserLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Colors from '../theme/Color';
import CustomLoader from '../component/CustomLoader';
import {HasText, ValidateEmail, ValidatePassword} from '../utils/FunctionUtils';
import Store from '../Store/Store';
import SelectImage from '../component/SelectImage';
import Images from '../theme/Images';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import CameraPermission from '../utils/CameraPermission';

const SignUpScreen = ({navigation}) => {
  const logoScale = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);

  const setToastData = Store(state => state.setToastData);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignUpPress = async () => {
    Keyboard.dismiss();

    setNameError('');
    setEmailError('');
    setPasswordError('');
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    if (profileImage == '' || profileImage == null) {
      setToastData({
        type: 0,
        text1: 'Please select a profile',
        text2: '',
        iconType: '',
        isVisible: true,
      });
    } else if (!HasText(name)) {
      setNameError('Name is required');
      return;
    } else if (!ValidateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    } else if (!ValidatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    } else {
      setLoading(true);
      setNameError('');
      setEmailError('');
      setPasswordError('');
      RegisterUser();
    }
  };

  const RegisterUser = () => {
    // try {

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async userCredential => {
        const userId = userCredential.user.uid;
        await firestore()
          .collection('users')
          .doc(userId)
          .set({
            name: name,
            email: email,
            userId: userId,
            userName: name + '_' + userId,
            profileImage: profileImage,
            about: '',
            nickName: '',
          });

        handleLogin();
      })
      .catch(error => {
        console.log('Error', error.message);
        setLoading(false);
        setToastData({
          type: 0,
          text1: error?.message,
          text2: '',
          iconType: '',
          isVisible: true,
        });
      });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const userId = userCredential.user.uid;
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        storeUserInfo(userData);
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{name: 'BottomTabNavigation'}],
        });
      } else {
        setLoading(false);
        setToastData({
          type: 0,
          text1: 'User does not exist.',
          text2: '',
          iconType: '',
          isVisible: true,
        });
      }
    } catch (error) {
      setLoading(false);
      setToastData({
        type: 0,
        text1: error?.message,
        text2: '',
        iconType: '',
        isVisible: true,
      });
    }
  };

  const storeUserInfo = async info => {
    const data = {
      email: info.email,
      name: info.name,
      userId: info.userId,
      userName: info.userName,
    };
    await AsyncStorage.setItem('userData', JSON.stringify(data));
  };

  // const uploadImage = async imageData => {
  //   try {
  //     const {path, mime} = imageData;
  //     const resizedImage = await ImageResizer.createResizedImage(
  //       path,
  //       500, // Max width
  //       500, // Max height
  //       'JPEG', // Format
  //       80, // Quality
  //     );

  //     const file = await RNFetchBlob.fs.readFile(
  //       resizedImage.uri.replace('file://', ''),
  //       'base64',
  //     );

  //     const base64Icon = `data:${mime};base64,${file}`;

  //     return base64Icon;
  //   } catch (error) {
  //     setToastData({
  //       type: 0,
  //       text1: 'Image upload failed',
  //       text2: '',
  //       iconType: '',
  //       isVisible: true,
  //     });
  //     console.error('Image upload failed:', error);
  //     throw error;
  //   }
  // };

  const confirmImage = async data => {
    if (data?.data) {
      const imageUrl = `data:${data?.mime};base64,${data?.data}`;
      setProfileImage(imageUrl);
    } else {
      setToastData({
        type: 0,
        text1: 'Image upload failed',
        text2: '',
        iconType: '',
        isVisible: true,
      });
      console.error('Image upload failed222:', error);
    }
  };

  const onClickCameraIcon = async () => {
    setIsCameraDialogOpen(true);

    // setToastData({
    //   type: 0,
    //   text1: "Please allow camera permission to access this feature",
    //   text2: "",
    //   iconType: "",
    //   isVisible: true,
    // });
  };

  return (
    <View style={CommanStyle.containerItemCenter}>
      <Animated.View style={[styles.logoContainer]}>
        <Text style={styles.logoText}>Video & Voice Call</Text>
      </Animated.View>
      <SelectImage
        isSelectProfilePic={true}
        userImage={profileImage}
        placeHolder={Images.user}
        confirmImage={data => confirmImage(data)}
        onClickCameraIcon={() => onClickCameraIcon()}
        isCameraDialogOpen={isCameraDialogOpen}
        onClose={() => setIsCameraDialogOpen(false)}
      />

      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: formOpacity,
            transform: [{translateY: formTranslateY}],
          },
        ]}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={Colors.black}
          />
          {!!nameError && (
            <Animated.View style={{transform: [{scale: logoScale}]}}>
              <Text style={[styles.errorText]}>{nameError}</Text>
            </Animated.View>
          )}
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={Colors.black}
          />
          {!!emailError && (
            <Animated.View style={{transform: [{scale: logoScale}]}}>
              <Text style={[styles.errorText]}>{emailError}</Text>
            </Animated.View>
          )}
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={Colors.black}
          />
          {!!passwordError && (
            <Animated.View style={{transform: [{scale: logoScale}]}}>
              <Text style={[styles.errorText, {}]}>{passwordError}</Text>
            </Animated.View>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUpPress}>
          <Text style={styles.buttonText}>SignUp</Text>
        </TouchableOpacity>

        <View style={styles.dontAccountView}>
          <Text style={styles.dontAccountText}>
            I have already use an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.signUptext}>Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <CustomLoader isVisible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
  },
  textInputContainer: {
    marginBottom: 15,
  },
  signUptext: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.green,
  },
  dontAccountText: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.black,
  },
  dontAccountView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    width: '80%',
    marginBottom: 40,
    marginTop: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    elevation: 2,
    color: Colors.black,
    borderWidth: 0.5,
    borderColor: '#4CAF50',
  },
  button: {
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
