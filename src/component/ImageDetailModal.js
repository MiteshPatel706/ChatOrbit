import LottieView from 'lottie-react-native';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../theme/Color';
import Images from '../theme/Images';
import Lotties from '../theme/Lotties';
import OpcityModal from './OpcityModal';
import RenderInputToolbar from './RenderInputToolbar';

const ImageDetailModal = ({onClose, data}) => {
  return (
    <OpcityModal
      isVisible={true}
      onClose={() => onClose()}
      onRequestClose={() => onClose()}>
      <View style={styles.container}>
        <View style={styles.ImageView}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Image
              source={Images.close}
              tintColor={Colors.black}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Image
            source={{uri: data?.path}}
            style={styles.selectImage}
            resizeMode="contain"
          />
        </View>

        <RenderInputToolbar
          inputText={inputText}
          setInputText={i => setInputText(i)}
          sendMessage={item => sendMessage('image', base64Code, inputText)}
          isHideSendImageOption={true}
          isHideSendVideoOption={true}
          placeholder={'Add a caption...'}
          leftContainer={
            <Image
              source={Images.ImageSend}
              style={{height: 25, width: 25}}
              tintColor={Colors.green}
            />
          }
          isHideSendBtn={!base64Code}
          customSendButton={
            !base64Code && (
              <TouchableOpacity
                onPress={() => null}
                style={styles.sendButton}
                activeOpacity={1}>
                <LottieView
                  source={Lotties.loaderAnimation}
                  style={{height: 50, width: 50}}
                  autoPlay
                  loop
                />
              </TouchableOpacity>
            )
          }
        />
      </View>
    </OpcityModal>
  );
};

export default ImageDetailModal;

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: Colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectImage: {
    height: '100%',
    width: '100%',
    elevation: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    height: 40,
    width: 40,
    zIndex: 1,
    backgroundColor: Colors.white + '80',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImageView: {
    flex: 1,
    marginBottom: 2,
  },
  container: {
    backgroundColor: Colors.white,
    height: '100%',
    width: '100%',
    paddingBottom: 10,
  },
});
