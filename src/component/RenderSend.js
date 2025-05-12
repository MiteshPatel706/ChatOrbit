import { StyleSheet, View } from "react-native";
import { Send } from "react-native-gifted-chat";
import Ionicons from "react-native-vector-icons/Ionicons";

const RenderSend = ({ props }) => (
  <Send {...props}>
    <View style={styles.sendButton}>
      <Ionicons name="send" size={24} color="#4CAF50" />
    </View>
  </Send>
);

export default RenderSend;

const styles = StyleSheet.create({
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
