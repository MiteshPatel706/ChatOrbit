// import ZegoUIKitPrebuiltCallService, {
//   ZegoMenuBarButtonName,
// } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import KeyCenter from "./KeyCenter";
import { Image, View } from "react-native";
// import * as ZIM from "zego-zim-react-native";

export const ZegoUIKitUserLogin = async (
  userID,
  userName,
  userImage,
  navigation
) => {
  return ZegoUIKitPrebuiltCallService.init(
    KeyCenter.appID,
    KeyCenter.appSign,
    userID,
    userName,
    [ZIM],
    {
      ringtoneConfig: {
        incomingCallFileName: "zego_incoming.mp3",
        outgoingCallFileName: "zego_outgoing.mp3",
      },
      avatarBuilder: ({ userInfo }) => {
        return (
          <View style={{ width: "100%", height: "100%" }}>
            <Image
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              source={{
                uri: userImage ?? `https://robohash.org/${userInfo.userID}.png`,
              }}
            />
          </View>
        );
      },
      waitingPageConfig: {},
      requireInviterConfig: {
        enabled: true,
        detectSeconds: 5,
      },
      onIncomingCallDeclineButtonPressed: (navigation) => {},
      onIncomingCallAcceptButtonPressed: (navigation) => {},
      onOutgoingCallCancelButtonPressed: (
        navigation,
        callID,
        invitees,
        type
      ) => {
        console.log(
          "[onOutgoingCallCancelButtonPressed]+++",
          navigation,
          callID,
          invitees,
          type
        );
      },
      onIncomingCallReceived: (callID, inviter, type, invitees, customData) => {
        console.log(
          "[Incoming call]+++",
          callID,
          inviter,
          type,
          invitees,
          customData
        );
      },
      onIncomingCallCanceled: (callID, inviter) => {
        console.log("[onIncomingCallCanceled]+++", callID, inviter);
      },
      onIncomingCallTimeout: (callID, inviter) => {
        console.log("[onIncomingCallTimeout]+++", callID, inviter);
      },
      onOutgoingCallAccepted: (callID, invitee) => {
        console.log("[onOutgoingCallAccepted]+++", callID, invitee);
      },
      onOutgoingCallRejectedCauseBusy: (callID, invitee) => {
        console.log("[onOutgoingCallRejectedCauseBusy]+++", callID, invitee);
      },
      onOutgoingCallDeclined: (callID, invitee) => {
        console.log("[onOutgoingCallDeclined]+++", callID, invitee);
      },
      onOutgoingCallTimeout: (callID, invitees) => {
        console.log("[onOutgoingCallTimeout]+++", callID, invitees);
      },
      requireConfig: (data) => {
        console.log("requireConfig, callID: ", data.callID);
        return {
          timingConfig: {
            isDurationVisible: true,
            onDurationUpdate: (duration) => {
              console.log(
                "########CallWithInvitation onDurationUpdate",
                duration
              );
              if (duration === 10 * 60) {
                ZegoUIKitPrebuiltCallService.hangUp();
              }
            },
          },
          topMenuBarConfig: {
            buttons: [ZegoMenuBarButtonName.minimizingButton],
          },
          onWindowMinimized: () => {
            console.log("[Demo]CallInvitation onWindowMinimized");
            navigation.navigate("BottomTabNavigation");
          },
          onWindowMaximized: () => {
            console.log("[Demo]CallInvitation onWindowMaximized");
            navigation.navigate("ZegoUIKitPrebuiltCallInCallScreen");
          },
        };
      },
    }
  ).then(() => {});
};
