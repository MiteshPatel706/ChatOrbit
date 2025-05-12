import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
// import ZegoUIKitPrebuiltCallService, {
//   call,
// } from '@zegocloud/zego-uikit-prebuilt-call-rn';

// Custom Call Button Component
const CustomCallButton = ({ invitees, isVideoCall, title }) => {
  const handlePress = () => {
    if (invitees.length === 0) {
      console.warn("No invitees provided!");
      return;
    }

    // Make a call invitation
    call({
      invitees: invitees.map((inviteeID) => ({
        userID: inviteeID,
        userName: `user_${inviteeID}`,
      })),
      callType: isVideoCall ? 1 : 0, // 1 = Video Call, 0 = Voice Call
      timeout: 60, // Timeout in seconds
      customData: JSON.stringify({ info: "Custom data here" }), // Optional custom data
    })
      .then(() => {
        console.log(
          `${
            isVideoCall ? "Video" : "Voice"
          } call invitation sent successfully!`
        );
      })
      .catch((error) => {
        console.error("Failed to send call invitation:", error);
      });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomCallButton;
