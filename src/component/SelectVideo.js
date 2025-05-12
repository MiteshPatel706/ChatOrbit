import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../theme/Color";
import OpcityModal from "./OpcityModal";

const SelectVideo = ({ confirmVideo, isVideoDialogOpen, onClose }) => {
  const selectPhotoTapped = () => {
    onClose();

    var options = {
      mediaType: "video",
      compressVideoPreset: "MediumQuality",
      includeBase64: true,
    };

    ImagePicker.openPicker(options)
      .then((data) => {
        confirmVideo(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cameraClick = () => {
    onClose();

    var options = {
      mediaType: "video",
      compressVideoPreset: "MediumQuality",
      includeBase64: true,
    };

    ImagePicker.openCamera(options)
      .then((data) => {
        confirmVideo(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <OpcityModal
      isVisible={isVideoDialogOpen}
      onClose={() => {
        onClose();
      }}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select Video</Text>
        <TouchableOpacity
          style={styles.modalOption}
          onPress={() => cameraClick()}
        >
          <View style={styles.iconView}>
            <Ionicons name="camera" size={24} color={Colors.white} />
          </View>
          <Text style={styles.modalOptionText}>Record Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalOption}
          onPress={() => selectPhotoTapped()}
        >
          <View style={styles.iconView}>
            <Ionicons name="image" size={24} color={Colors.white} />
          </View>
          <Text style={styles.modalOptionText}>Choose From Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalCancel}
          onPress={() => {
            onClose();
          }}
        >
          <Text style={styles.modalCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </OpcityModal>
  );
};

export default SelectVideo;

const styles = StyleSheet.create({
  iconView: {
    height: 40,
    width: 40,
    backgroundColor: Colors.green,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBtnText: {
    color: Colors.green,
    fontSize: 18,
    textAlign: "center",
  },
  imageBtnStyle: {
    backgroundColor: Colors.white,
    borderColor: Colors.green,
    borderWidth: 0.8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  modalCancel: {
    marginTop: 20,
  },

  modalTitle: {
    color: Colors.black,
    textAlign: "center",
    padding: 6,

    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },

  userImage: {
    width: 117,
    height: 117,
    borderRadius: 117 / 2,
    overflow: "hidden",
  },
  profileView: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    alignSelf: "center",
    borderColor: Colors.grey2,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 120 / 2,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green,
  },

  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    alignSelf: "center",
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 5,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    elevation: 5,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
    fontWeight: "400",
  },

  modalCancelText: {
    fontSize: 16,
    color: Colors.red1,
    textAlign: "center",
    fontWeight: "500",
  },
});
