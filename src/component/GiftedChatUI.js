import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  AppState,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import Colors from '../theme/Color';
import Images from '../theme/Images';
// import RenderBubble from './RenderBubble';
import RenderInputToolbar from './RenderInputToolbar';
import RenderMessage from '../screen/RenderMessage';
import Store from '../Store/Store';
import CustomLoader from './CustomLoader';
import SelectImage from './SelectImage';
import MediaSendModal from './MediaSendModal';
import CameraPermission from '../utils/CameraPermission';
import SelectVideo from './SelectVideo';
import DeleteMessageModal from './DeleteMessageModal';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const GiftedChatUI = ({user, currentUser}) => {
  // console.log("currentUser?.userId=-=-=-", currentUser?.userId, user?.id);

  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const animationRef = useRef(new Animated.Value(1)).current;
  const setToastData = Store(state => state.setToastData);
  const setCommingSoonData = Store(state => state.setCommingSoonData);
  const width = Dimensions.get('window').width;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = React.useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [isOtherPersonAvaliable, setIsOtherPersonAvaliable] = useState(false);
  const [isOpenSelectMedia, setIsOpenSelectMedia] = useState('');
  const [selectMediaData, setSelectMediaData] = useState({});
  const [isOpenMediaSendModal, setIsOpenMediaSendModal] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [replyData, setReplyData] = useState({});
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [deleteMessageData, setDeleteMessageData] = useState({});
  const insets = useSafeAreaInsets();

  const chatId =
    currentUser?.userId > user?.userId
      ? `${currentUser?.userId}_${user.userId}`
      : `${user.userId}_${currentUser?.userId}`;

  const messagesRef = firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages');

  const myContactUserListRef = firestore()
    .collection('users')
    .doc(currentUser?.userId)
    .collection('contacts')
    .doc(user?.userId);

  const otherContactUserListRef = firestore()
    .collection('users')
    .doc(user?.userId)
    .collection('contacts')
    .doc(currentUser?.userId);

  // const chatRef = firestore().collection('chats').doc(chatId);

  const myAccontChatRef = firestore()
    .collection('chats')
    .doc(chatId)
    .collection('users')
    .doc(currentUser?.userId);

  const otherAccontChatRef = firestore()
    .collection('chats')
    .doc(chatId)
    .collection('users')
    .doc(user?.userId);

  useEffect(() => {
    const unsubscribeMessages = messagesRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const messagesData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
        }));

        setMessages(
          messagesData.filter(
            msg => msg[`${currentUser?.userId}_isDelete`] != 1,
          ),
        );
        setIsLoadData(true);
      });

    const unsubscribeOtherAccontChat = otherAccontChatRef.onSnapshot(doc => {
      const data = doc?.data();
      if (data) {
        setIsTyping(data?.isTyping);
        if (data?.isAvailable != undefined) {
          setIsOtherPersonAvaliable(data?.isAvailable);
        }
      }
    });
    return () => {
      unsubscribeMessages();
      unsubscribeOtherAccontChat();
    };
  }, []);

  useEffect(() => {
    const myUserListUpdate = async () => {
      await myContactUserListRef.update({notification: ''});

      const doc = await myAccontChatRef.get();
      if (!doc.exists) {
        const addMydata = {
          isTyping: false,
          userId: currentUser?.userId,
          createdAt: new Date(),
          isAvailable: false,
        };

        await myAccontChatRef.set(addMydata);
      } else {
        const addMydata = {
          isTyping: false,
          isAvailable: true,
          createdAt: new Date(),
        };
        await myAccontChatRef.set(addMydata);
      }
    };
    myUserListUpdate();
  }, [user]);

  useEffect(() => {
    const appstatus = AppState.addEventListener('change', async e => {
      if (e === 'background') {
        const addMydata = {
          isTyping: false,
          isAvailable: false,
        };
        await myAccontChatRef.set(addMydata);
      } else {
        const addMydata = {
          isTyping: false,
          isAvailable: true,
          createdAt: new Date(),
        };
        await myAccontChatRef.set(addMydata);
      }
    });
    return () => {
      appstatus.remove();
    };
  }, []);

  const sendMessage = useCallback(
    async ({type, text, imageURL, videoURL, isReply, replyData}) => {
      setInputText('');

      if (!text.trim() && type != 'image') return; // Don't send empty messages

      let newMessage = {
        _id: `${Date.now()}`, // Temporary ID
        text: text ?? '',
        createdAt: new Date(),
        user: {
          _id: currentUser?.userId,
          name: currentUser?.name ?? '',
          // avatar: currentUser.photoURL ?? '',
        },
        type: type,
        imageURL: imageURL ?? '',
        videoURL: videoURL ?? '',
        [`${currentUser?.userId}_isDelete`]: 0,
        [`${user.userId}_isDelete`]: 0,
      };
      if (isReply) {
        (newMessage.isReply = isReply || false),
          (newMessage.replyTo = replyData);
      }

      await myAccontChatRef.update({
        isTyping: false,
        createdAt: new Date(),
      });
      try {
        scrollToBottom();
        await messagesRef
          .add(newMessage)
          .then(e => updateUserList())
          .catch(e =>
            setToastData({
              type: 0,
              text1: e,
              text2: '',
              iconType: '',
              isVisible: true,
            }),
          );
      } catch (e) {
        console.log('Err', e);
      }
    },
    [inputText],
  );

  const updateMessage = async (messageId, data) => {
    try {
      await messagesRef
        .doc(messageId)
        .update(data)
        .then(() => updateUserList(true));
    } catch (error) {
      console.error('Error Update message:', error);
    }
  };

  const updateUserList = async isDelete => {
    if (!isOtherPersonAvaliable) {
      const userDataList = await otherContactUserListRef.get();

      let AddData;
      if (isDelete != undefined && isDelete == true) {
        console.log(Number(userDataList?.data()?.notification));

        AddData = {
          notification:
            userDataList?.data()?.notification != undefined &&
            userDataList?.data()?.notification != null &&
            Number(userDataList?.data()?.notification) > 1
              ? Number(userDataList?.data()?.notification) - 1
              : '',
        };
      } else {
        AddData = {
          userId: currentUser?.userId,
          createdAt: new Date(),
          notification:
            userDataList?.data()?.notification != undefined &&
            userDataList?.data()?.notification != null
              ? Number(userDataList?.data()?.notification) + 1
              : 1,
          lastMessage: inputText ?? '',
        };
      }

      if (userDataList?.exists) {
        await otherContactUserListRef.update(AddData);
      } else {
        try {
          await otherContactUserListRef.set({
            userId: currentUser?.userId,
            createdAt: new Date(),
            notification:
              userDataList?.data()?.notification != undefined &&
              userDataList?.data()?.notification != null
                ? Number(userDataList?.data()?.notification) + 1
                : 1,
            lastMessage: inputText ?? '',
          });
        } catch (error) {
          console.log('error=-=-=--=-=-', error);
        }
      }
    }
    await myContactUserListRef.update({createdAt: new Date()});
  };

  let typingTimeout;
  const handleIsTyping = useCallback(
    async text => {
      setInputText(text);

      try {
        await myAccontChatRef.update({
          isTyping: text.length > 0 ? true : false,
          createdAt: new Date(),
        });

        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        typingTimeout = setTimeout(async () => {
          await myAccontChatRef.update({
            isTyping: false,
            createdAt: new Date(),
          });
        }, 2000);
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    },
    [chatId],
  );

  const ScrollToBottomComponent = () => {
    return (
      <TouchableOpacity
        style={styles.ScrollToBottomComponentContainer}
        onPress={() => scrollToBottom()}>
        <Image
          source={Images.downArrow}
          style={{height: 22, width: 22}}
          tintColor={Colors.black}
        />
      </TouchableOpacity>
    );
  };

  const onDelete = async (item, isCurrentUser) => {
    if (item[`${item?.user?._id}_isDelete`] == 2) {
      setDeleteMessageData({item: item, isCurrentUser: false});
    } else {
      setDeleteMessageData({item: item, isCurrentUser: isCurrentUser});
    }
    setIsShowDeleteModal(true);
    // try {
    //   await firestore()
    //     .collection('chats')
    //     .doc(chatId)
    //     .collection('messages')
    //     .doc(item.id)
    //     .delete();
    // } catch (error) {
    //   console.error('Error deleting message:', error);
    // }
  };

  const onClickDeleteEveryone = () => {
    const updateData = {
      [`${user?.userId}_isDelete`]: 2,
      [`${currentUser?.userId}_isDelete`]: 2,
    };
    updateMessage(deleteMessageData?.item?.id, updateData);
    setIsShowDeleteModal(false);
    setDeleteMessageData({});
  };
  const onClickDeleteMe = () => {
    const updateData = {
      [`${currentUser?.userId}_isDelete`]: 1,
    };
    updateMessage(deleteMessageData?.item?.id, updateData);
    setIsShowDeleteModal(false);
    setDeleteMessageData({});
  };

  const onReply = (item, isCurrentUser) => {
    setIsReply(true);
    setReplyData({
      ...item,
      replyUserName: isCurrentUser ? 'You' : user?.name,
    });
  };
  const isReplyClose = item => {
    setIsReply(false);
    setReplyData({});
  };

  const onClickMediaIcon = async type => {
    setIsOpenSelectMedia('image');
  };

  const confirmMedia = (data, type) => {
    setIsOpenSelectMedia('');
    if (!data) {
      return;
    }
    const updateData = {
      mediaData: data,
      mediaType: type,
    };
    setSelectMediaData(updateData);
    setIsOpenMediaSendModal(true);
  };

  const onClickMedia = (item, type, isCurrentUser) => {
    navigation.navigate('MediaDetailscreen', {
      data: item,
      title: isCurrentUser ? 'You' : user?.name,
      type: type,
    });
  };

  const handleScroll = event => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;

    const isAtBottom = contentOffset.y < 100;

    setShowScrollToBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  const handleReplyScroll = key => {
    const index = messages.findIndex(item => item?.id === key);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index,
        viewPosition: 0.5,
      });
      setHighlightedId(key);

      // Reset the animation value
      animationRef.setValue(1);

      // Animate the highlight fade-out
      Animated.timing(animationRef, {
        toValue: 0,
        duration: 3000, // 1 second animation
        useNativeDriver: false,
      }).start(() => {
        // Clear the highlight after the animation completes
        setHighlightedId(null);
      });
    }
  };

  return (
    <>
      <View style={[styles.container, {paddingBottom: insets.bottom}]}>
        <View style={{flex: 1}}>
          {messages?.length < 1 && isLoadData ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={Images.noMessageBg}
                style={{height: width - 100, width: width - 100}}
              />
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({item, index}) => (
                  <RenderMessage
                    item={item}
                    index={index}
                    currentUserID={currentUser?.userId}
                    onDelete={(item, isCurrentUser) =>
                      onDelete(item, isCurrentUser)
                    }
                    onReply={(item, isCurrentUser) =>
                      onReply(item, isCurrentUser)
                    }
                    isTyping={isTyping}
                    navigation={navigation}
                    onClickMedia={(item, type, isCurrentUser) =>
                      onClickMedia(item, type, isCurrentUser)
                    }
                    otherUserName={user?.name}
                    onClickReplyMessage={id => handleReplyScroll(id)}
                    highlightedId={highlightedId}
                    animationRef={animationRef}
                  />
                )}
                keyExtractor={item => item?.id}
                inverted
                contentContainerStyle={{paddingVertical: 10}}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              />
            </>
          )}
        </View>

        <RenderInputToolbar
          inputText={inputText}
          setInputText={i => handleIsTyping(i)}
          sendMessage={({inputText, isReply, replyData}) =>
            sendMessage({
              type: 'text',
              text: inputText,
              isReply: isReply,
              replyData: replyData,
            })
          }
          onCickImage={() => onClickMediaIcon('image')}
          onClickVideo={() => onClickMediaIcon('video')}
          isReply={isReply}
          replyData={replyData}
          isReplyClose={() => isReplyClose()}
        />
        {showScrollToBottom && <ScrollToBottomComponent />}
        <SelectImage
          isCameraDialogOpen={isOpenSelectMedia == 'image'}
          onClose={() => setIsOpenSelectMedia('')}
          confirmImage={data => confirmMedia(data, 'image')}
        />
        <SelectVideo
          isVideoDialogOpen={isOpenSelectMedia == 'video'}
          onClose={() => setIsOpenSelectMedia('')}
          confirmVideo={data => confirmMedia(data, 'video')}
        />
      </View>
      <MediaSendModal
        isVisible={isOpenMediaSendModal}
        onClose={() => {
          setIsOpenMediaSendModal(false);
        }}
        data={selectMediaData?.mediaData}
        mediaType={selectMediaData?.mediaType}
        sendMessage={data => {
          sendMessage({
            type: data?.mediaType ?? '',
            imageURL: data?.imageURL ?? '',
            text: data?.text ?? '',
            videoURL: data?.videoURL ?? '',
          });
          setIsOpenMediaSendModal(false);
        }}
      />
      <DeleteMessageModal
        isVisible={isShowDeleteModal}
        deleteMessageData={deleteMessageData}
        onClose={() => {
          setIsShowDeleteModal(false);
          setDeleteMessageData({});
        }}
        onClickDeleteEveryone={() => onClickDeleteEveryone()}
        onClickDeleteMe={() => onClickDeleteMe()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  ScrollToBottomComponentContainer: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default GiftedChatUI;

// GiftedChat UI components Code
{
  /* <GiftedChat
        messageContainerRef={messageContainerRef}
        messages={messages}
        user={{
          _id: currentUser?.userId,
          name: currentUser.displayName || 'Me',
          avatar: currentUser.photoURL || 'https://via.placeholder.com/50',
        }}
        renderAvatar={null}
        renderBubble={props => {
          return <RenderBubble props={props} />;
        }}
        infiniteScroll={true}
        renderInputToolbar={props => (
          <RenderInputToolbar
            inputText={inputText}
            setInputText={i => handleIsTyping(i)}
            sendMessage={item => sendMessage(item)}
          />
        )}
        placeholder=""
        alwaysShowSend
        scrollToBottom={true}
        scrollToBottomOffset={200}
        scrollToBottomComponent={() => <ScrollToBottomComponent />}
        isTyping={isTyping}
      /> */
}
