import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomLoader from "../component/CustomLoader";
import Store from "../Store/Store";
import Colors from "../theme/Color";
import CommanStyle from "../theme/CommanStyle";
import { ValidateEmail, ValidatePassword } from "../utils/FunctionUtils";

const LoginScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const setToastData = Store((state) => state.setToastData);

  // Animate logo and form on mount
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

  const handleLoginPress = async () => {
    Keyboard.dismiss();
    setEmailError("");
    setPasswordError("");

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

    if (!ValidateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else if (!ValidatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    } else {
      setLoading(true);
      setEmailError("");
      setPasswordError("");
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      const userId = userCredential.user.uid;
      const userDoc = await firestore().collection("users").doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        storeUserInfo(userData);
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "BottomTabNavigation" }],
        });
      } else {
        setLoading(false);
        setToastData({
          type: 0,
          text1: "User does not exist.",
          text2: "",
          iconType: "",
          isVisible: true,
        });
      }
    } catch (error) {
      setLoading(false);
      setToastData({
        type: 0,
        text1: error?.message,
        text2: "",
        iconType: "",
        isVisible: true,
      });
      console.log("Error", error.message);
    }
  };

  const storeUserInfo = async (info) => {
    const data = {
      email: info.email,
      name: info.name,
      userId: info.userId,
      userName: info.userName,
    };
    await AsyncStorage.setItem("userData", JSON.stringify(data));
  };

  return (
    <View style={CommanStyle.containerItemCenter}>
      <Animated.View style={styles.logoContainer}>
        <Text style={styles.logoText}>Video & Voice Call</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: formOpacity,
            transform: [{ translateY: formTranslateY }],
          },
        ]}
      >
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={Colors.black}
          />
          {!!emailError && (
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
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
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
              <Text style={[styles.errorText, {}]}>{passwordError}</Text>
            </Animated.View>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.dontAccountView}>
          <Text style={styles.dontAccountText}>I don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
            <Text style={styles.signUptext}>SignUP</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <CustomLoader isVisible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
  },

  signUptext: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.green,
  },
  dontAccountText: {
    fontSize: 13,
    fontWeight: "400",
    color: Colors.black,
  },
  dontAccountView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    width: "80%",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    elevation: 2,
    color: Colors.black,
    borderWidth: 0.5,
    borderColor: "#4CAF50",
  },
  button: {
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
