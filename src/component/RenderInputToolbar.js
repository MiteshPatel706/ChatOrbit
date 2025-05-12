import React, {useCallback, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../theme/Color';
import Images from '../theme/Images';
import LazyImageLoading from './LazyImageLoading';
import {height} from '../utils/dimen';

const RenderInputToolbar = ({
  inputText,
  setInputText,
  sendMessage,
  onCickImage,
  onClickVideo,
  isHideSendImageOption,
  isHideSendVideoOption,
  placeholder,
  leftContainer,
  isHideSendBtn,
  customSendButton,
  isReply,
  replyData,
  isReplyClose,
}) => {
  const inputRef = useRef(null);
  let AnimatedReplyView = useRef(new Animated.Value(0));
  useEffect(() => {
    if (isReply) {
      Animated.timing(AnimatedReplyView.current, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      setTimeout(() => inputRef.current.focus(), 100);

      // inputRef.current.focus();
    }
  }, [isReply]);

  const handleIsReplyClose = () => {
    Animated.timing(AnimatedReplyView.current, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      isReplyClose();
    }, 400);
  };

  const handleSendMessage = () => {
    const data = {
      inputText: inputText ?? '',
      isReply: isReply,
      replyData: replyData,
    };
    if (isReply) {
      sendMessage(data);
      handleIsReplyClose();
    } else {
      sendMessage(data);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View
        style={[
          styles.inputContainer,
          isReply && styles.isReplyInputContainer,
        ]}>
        {isReply && (
          <Animated.View
            style={[
              styles.replyContainer,
              {
                transform: [
                  {
                    translateY: AnimatedReplyView?.current?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
                opacity: AnimatedReplyView.current,
              },
            ]}>
            <View style={styles.leftDummyLine} />
            <View style={styles.replyUserdetailContainer}>
              <Text numberOfLines={1} style={styles.replayname}>
                {replyData?.replyUserName}
              </Text>

              <View style={styles.replyTextDetail}>
                {replyData?.type == 'image' && (
                  <Ionicons name="image" size={18} color={Colors.grey_575e64} />
                )}
                <Text numberOfLines={1} style={[styles.replyMessage]}>
                  {replyData?.type == 'text'
                    ? replyData?.text
                    : !!replyData?.text
                    ? replyData?.text
                    : 'Photo'}
                </Text>
              </View>
            </View>

            {replyData?.type == 'image' && (
              <LazyImageLoading
                style={styles.replyImageStyle}
                source={{uri: replyData?.imageURL}}
              />
            )}

            <TouchableOpacity
              style={styles.replyCloseBtn}
              onPress={() => {
                handleIsReplyClose();
              }}>
              <Image source={Images.close} style={{height: 10, width: 10}} />
            </TouchableOpacity>
          </Animated.View>
        )}
        <View style={styles.imputAndIconGroup}>
          {leftContainer && leftContainer}
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={placeholder ?? 'Type a message...'}
            placeholderTextColor="#888"
            multiline={true}
          />
          {!inputText && !isHideSendImageOption && (
            <TouchableOpacity activeOpacity={0.9} onPress={onCickImage}>
              <Image
                source={Images.ImageSend}
                style={{height: 28, width: 28}}
                tintColor={Colors.grey_575e64}
              />
            </TouchableOpacity>
          )}
          {!inputText && !isHideSendVideoOption && (
            <TouchableOpacity activeOpacity={0.9} onPress={onClickVideo}>
              <Image
                source={Images.addVideo}
                style={{height: 24, width: 24}}
                tintColor={Colors.grey_575e64}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {!isHideSendBtn && (
        <TouchableOpacity
          onPress={() => handleSendMessage()}
          style={styles.sendButton}>
          <Ionicons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      )}
      {customSendButton && customSendButton}
    </View>
  );
};

const styles = StyleSheet.create({
  replyTextDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  imputAndIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 5,
  },
  replyCloseBtn: {
    height: 20,
    width: 20,
    backgroundColor: '#ffffff90',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 2,
    top: 2,
    zIndex: 1,
  },
  replyImageStyle: {
    backgroundColor: '#00000010',
    height: 65,
    width: 65,
  },
  replyMessage: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.grey_575e64,
    lineHeight: 17,
    flex: 1,
  },
  replayname: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.green,
  },
  replyUserdetailContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 1,
  },
  leftDummyLine: {
    width: 10,
    height: '100%',
    position: 'absolute',
    left: 0,
    backgroundColor: Colors.green,
  },
  replyContainer: {
    backgroundColor: Colors.inputBG,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 2,
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  isReplyInputContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 0.4,
    borderColor: '#00000010',
  },
  textInput: {
    minHeight: 50,
    maxHeight: 100,
    color: '#000',
    padding: 0,
    // paddingVertical: 8,
    flex: 1,
    textAlignVertical: 'center',
    paddingTop: Platform.OS === 'ios' ? 15 : 8,
    paddingBottom: Platform.OS === 'ios' ? 15 : 2,
  },
  sendButton: {
    backgroundColor: Colors.green,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});

export default RenderInputToolbar;
