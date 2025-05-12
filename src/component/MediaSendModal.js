import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../theme/Color";
import Images from "../theme/Images";
import LazyImageLoading from "./LazyImageLoading";
import OpcityModal from "./OpcityModal";
import RenderInputToolbar from "./RenderInputToolbar";
import Video from "react-native-video";
import UploadMediaBas64 from "../utils/UploadMediaBas64";
import CompressMedia from "../utils/CompressMedia";
import UploadMediaToServer from "../utils/UploadMediaToServer";

const MediaSendModal = ({
  isVisible,
  onClose,
  data,
  sendMessage,
  mediaType,
}) => {
  const [inputText, setInputText] = React.useState("");
  const videoRef = useRef(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [compressVideo, setCompressVideo] = useState(null);

  useEffect(() => {
    if (mediaType === "video") {
      setIsUploadingVideo(true);
      (async () => {
        const compressVideoIfNeeded = await CompressMedia(data, mediaType);
        console.log("compress Video success", compressVideoIfNeeded);

        const uploadData = await UploadMediaToServer(
          compressVideoIfNeeded?.compressedData,
          mediaType
        );
        console.log("uploadData", uploadData);

        setIsUploadingVideo(false);
        setCompressVideo(compressVideoIfNeeded?.compressedUri);
      })();
    }
  }, [data]);

  const handleSendMessage = () => {
    let updateData = {
      mediaType: mediaType,
      text: inputText,
    };
    if (mediaType === "image") {
      updateData.imageURL = `data:${data?.mime};base64,${data?.data}`;
    } else {
      updateData.imageURL = `https://via.placeholder.com/200`;
      updateData.videoURL = `data:${data?.mime};base64,${data?.data}`;
    }
    sendMessage(updateData);
    setInputText("");
  };

  const onBuffer = () => {
    // console.log('onBuffer Call=-=-=-=-=');
    null;
  };

  const onError = (e) => {
    console.log("Video Error: ", e);
  };
  return (
    <OpcityModal
      isVisible={isVisible}
      onClose={() => onClose()}
      onRequestClose={() => onClose()}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: mediaType == "image" ? Colors.white : Colors.black,
          },
        ]}
      >
        <View style={styles.ImageView}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor:
                  mediaType == "image"
                    ? Colors.black + "10"
                    : Colors.white + "10",
              },
            ]}
            onPress={onClose}
          >
            <Image
              source={Images.close}
              tintColor={mediaType == "image" ? Colors.black : Colors.white}
              style={{ height: 20, width: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {mediaType == "image" ? (
            <Image
              source={{ uri: data?.path }}
              style={styles.selectImage}
              resizeMode="contain"
            />
          ) : (
            <>
              <Video
                source={{ uri: data?.path }}
                ref={videoRef}
                onBuffer={onBuffer}
                onError={onError}
                style={styles.video}
                controls={true}
                controlsStyles={{
                  hideNext: true,
                  hidePrevious: true,
                }}
              />
            </>
          )}
        </View>

        <RenderInputToolbar
          inputText={inputText}
          setInputText={(i) => setInputText(i)}
          sendMessage={(item) => handleSendMessage()}
          isHideSendImageOption={true}
          isHideSendVideoOption={true}
          placeholder={"Add a caption..."}
          leftContainer={
            <Image
              source={Images.ImageSend}
              style={{ height: 25, width: 25 }}
              tintColor={Colors.green}
            />
          }
          isHideSendBtn={isUploadingVideo}
          customSendButton={
            isUploadingVideo && (
              <View style={styles.sendButton}>
                <ActivityIndicator color={Colors.white} />
              </View>
            )
          }
        />
      </View>
    </OpcityModal>
  );
};

export default MediaSendModal;

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: Colors.green,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  video: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.black,
  },

  selectImage: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.white,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    height: 40,
    width: 40,
    zIndex: 1,
    backgroundColor: Colors.white + "40",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  ImageView: {
    flex: 1,
    marginBottom: 2,
  },
  container: {
    backgroundColor: Colors.white,
    height: "100%",
    width: "100%",
    paddingBottom: 10,
  },
});
