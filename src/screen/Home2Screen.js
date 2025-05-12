import { useFocusEffect } from "@react-navigation/native";
// import ZegoUIKitPrebuiltCallService, {
//   ZegoSendCallInvitationButton,
// } from '@zegocloud/zego-uikit-prebuilt-call-rn';
// import ZegoUIKit from "@zegocloud/zego-uikit-rn";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Orientation from "react-native-orientation-locker";
import getUserInfo from "../utils/GetUserInfo";

const HomeScreen = (props) => {
  const [userID, setUserID] = useState("");
  const [invitees, setInvitees] = useState([]);
  const viewRef = useRef(null);
  const blankPressedHandle = () => {
    viewRef.current.blur();
  };
  const changeTextHandle = (value) => {
    setInvitees(value ? value.split(",") : []);
  };

  useEffect(() => {
    Orientation.addOrientationListener((orientation) => {
      var orientationValue = 0;
      if (orientation === "PORTRAIT") {
        orientationValue = 0;
      } else if (orientation === "LANDSCAPE-LEFT") {
        orientationValue = 1;
      } else if (orientation === "LANDSCAPE-RIGHT") {
        orientationValue = 3;
      }
      console.log("+++++++Orientation+++++++", orientation, orientationValue);
      ZegoUIKit.setAppOrientation(orientationValue);
    });

    getUserInfo().then((info) => {
      if (info) {
        setUserID(info.userID);
        onUserLogin(info.userID, info.name, props);
      } else {
        props.navigation.navigate("LoginScreen");
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUserInfo().then((info) => {
        if (info) {
          setUserID(info.userID);
        }
      });

      return () => {};
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={blankPressedHandle}>
      <View style={styles.container}>
        <Text>Your user id: {userID}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref={viewRef}
            style={styles.input}
            onChangeText={changeTextHandle}
            placeholder="Invitees ID, Separate ids by ','"
          />
          <ZegoSendCallInvitationButton
            invitees={invitees.map((inviteeID) => {
              return { userID: inviteeID, userName: "user_" + inviteeID };
            })}
            isVideoCall={false}
          />
          <ZegoSendCallInvitationButton
            invitees={invitees.map((inviteeID) => {
              return { userID: inviteeID, userName: "user_" + inviteeID };
            })}
            isVideoCall={true}
          />
        </View>
        <View style={{ width: 220, marginTop: 100 }}>
          <Button
            title="Back To Login Screen"
            onPress={() => {
              props.navigation.navigate("LoginScreen");
              ZegoUIKitPrebuiltCallService.uninit();
            }}
          ></Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A3A3A3",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
});
