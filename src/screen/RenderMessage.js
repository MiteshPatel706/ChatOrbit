import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";
import { Swipeable } from "react-native-gesture-handler";
import { memo, useRef } from "react";
import Images from "../theme/Images";
import Colors from "../theme/Color";
import TypingIndicator from "../component/TypingIndicator";
import LazyImageLoading from "../component/LazyImageLoading";
import { height, width } from "../utils/dimen";
import Ionicons from "react-native-vector-icons/Ionicons";

const RenderMessage = ({
  item,
  currentUserID,
  onDelete,
  onReply,
  index,
  isTyping,
  onClickMedia,
  otherUserName,
  onClickReplyMessage,
  highlightedId,
  animationRef,
}) => {
  const isCurrentUser = item.user._id === currentUserID;
  const isDeleteEveryOne = item[`${item?.user?._id}_isDelete`] == 2;
  const isDeleteMe = item[`${item?.user?._id}_isDelete`] == 1;
  const swipeableRef = useRef(null);

  const isHighlighted = item?.id === highlightedId;

  // console.log(item?.id, ':', item[`${item?.user?.id}_isDelete`]);

  const RenderLeftActions = () => (
    <View style={[styles.leftContainer]}>
      <TouchableOpacity
        style={[styles.LeftButton]}
        activeOpacity={0.9}
        onPress={() => {
          onReply(item, isCurrentUser);
          swipeableRef?.current?.close();
        }}
      >
        <Image
          source={Images.leftReply}
          style={{
            height: 15,
            width: 15,
          }}
          tintColor={"green"}
        />
        <Text style={styles.chatBtnText}>Reply</Text>
      </TouchableOpacity>
    </View>
  );

  const RenderRightActions = () => (
    <View style={[styles.rightContainer]}>
      <TouchableOpacity
        style={[styles.RightButton]}
        activeOpacity={0.9}
        onPress={() => {
          onDelete(item, isCurrentUser);
          swipeableRef.current.close();
        }}
      >
        <Image
          source={Images.delete}
          style={{
            height: 15,
            width: 15,
          }}
          tintColor={"red"}
        />
        <Text style={styles.chatBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const onSwipeableWillOpen = (text) => {
    if (text == "left") {
      onReply(item);
      swipeableRef?.current?.close();
    } else {
      setTimeout(() => {
        swipeableRef?.current?.close();
      }, 2000);
    }
  };

  const backgroundColor = isHighlighted
    ? animationRef.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.green + "02", Colors.green + "80"],
      })
    : "white";

  return (
    <>
      {index == 0 && isTyping && <TypingIndicator />}

      <Swipeable
        ref={swipeableRef}
        renderLeftActions={() => {
          return !isDeleteEveryOne && <RenderLeftActions />;
        }}
        renderRightActions={() => {
          return <RenderRightActions />;
        }}
        containerStyle={{ flex: 1 }}
        key={index.toString()}
        onSwipeableWillOpen={(item) => onSwipeableWillOpen(item)}
        overshootLeft={false}
      >
        <Animated.View style={[styles.mainView, { backgroundColor }]}>
          <TouchableOpacity
            style={[
              styles.messageContainer,
              isCurrentUser ? styles.currentUser : styles.otherUser,
            ]}
            activeOpacity={0.9}
            disabled={!item?.isReply}
            onPress={() => onClickReplyMessage(item?.replyTo?.id)}
          >
            {item?.isReply && (
              <View style={[styles.replyContainer]}>
                <View style={styles.leftDummyLine} />
                <View style={styles.replyUserdetailContainer}>
                  <View style={{ marginRight: 10, minWidth: 100 }}>
                    <Text numberOfLines={1} style={styles.replayname}>
                      {item?.replyTo?.user?.id == currentUserID
                        ? "You"
                        : otherUserName}
                    </Text>

                    <View style={styles.replyTextDetail}>
                      {item?.replyTo?.type == "image" && (
                        <Ionicons
                          name="image"
                          size={18}
                          color={Colors.grey_575e64}
                        />
                      )}
                      <Text numberOfLines={1} style={[styles.replyMessage]}>
                        {item?.replyTo?.type == "text"
                          ? item?.replyTo?.text
                          : !!item?.replyTo?.text
                          ? item?.replyTo?.text
                          : "Photo"}
                      </Text>
                    </View>
                  </View>
                  {item?.replyTo?.type == "image" && (
                    <LazyImageLoading
                      style={styles.replyImageStyle}
                      source={{ uri: item?.replyTo?.imageURL }}
                    />
                  )}
                </View>
              </View>
            )}

            {item?.type == "image" && (
              <TouchableOpacity
                onPress={() => onClickMedia(item, "image", isCurrentUser)}
                activeOpacity={1}
                style={styles.imageTouchView}
              >
                <LazyImageLoading
                  source={{ uri: item?.imageURL }}
                  style={{ height: "100%", width: "100%" }}
                  placeHolder={Images.noImg}
                />
              </TouchableOpacity>
            )}

            {(!!item?.text || isDeleteEveryOne) && (
              <View style={styles.textMainView}>
                {isDeleteEveryOne && (
                  <Image
                    source={Images.disabled}
                    style={{ height: 14, width: 14 }}
                    tintColor={Colors.grey_575e64}
                    resizeMode="contain"
                  />
                )}

                {!!item?.text && (
                  <Text
                    style={[
                      styles.messageText,
                      isDeleteEveryOne && styles.isDeleteEveryOneTextStyle,
                    ]}
                  >
                    {isDeleteEveryOne ? "This message was deleted" : item.text}
                  </Text>
                )}
              </View>
            )}

            <Text
              style={[
                styles.timestamp,
                !item?.text && styles.positionTimeStyle,
              ]}
            >
              {moment(item.createdAt).format("h:mm a")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>
    </>
  );
};

export default memo(RenderMessage);

const styles = StyleSheet.create({
  textMainView: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 5,
    alignItems: "center",
    gap: 5,
  },
  replyTextDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  imputAndIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 5,
  },

  replyImageStyle: {
    backgroundColor: "#00000010",
    height: 65,
    width: 65,
  },
  replyMessage: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.grey_575e64,
    lineHeight: 17,
    flex: 1,
  },
  replayname: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.green,
  },
  replyUserdetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
  },
  leftDummyLine: {
    width: 10,
    height: "100%",
    position: "absolute",
    left: 0,
    backgroundColor: Colors.green,
  },
  replyContainer: {
    backgroundColor: Colors.inputBG,
    borderRadius: 10,
    overflow: "hidden",
    height: 65,
    justifyContent: "center",
    marginHorizontal: 6,
    marginTop: 6,
  },
  imageTouchView: {
    height: width / 1.7 - 10,
    width: width / 1.7 - 10,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 5,
    marginVertical: 5,
    overflow: "hidden",
    borderRadius: 10,
  },
  mainView: {
    width: "100%",
    backgroundColor: Colors.white,
    paddingBottom: 5,
  },
  chatBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.black,
  },
  messageContainer: {
    marginHorizontal: 10,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    borderRadius: 10,
    maxWidth: "70%",
  },
  currentUser: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C5",
  },
  otherUser: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 20,
    textAlign: "left",
  },
  isDeleteEveryOneTextStyle: {
    color: Colors.grey_575e64,
    fontSize: 12,
  },

  timestamp: {
    fontSize: 9,
    lineHeight: 9,
    color: "#888",
    textAlign: "right",
    paddingHorizontal: 10,
    marginBottom: 5,
  },

  leftContainer: {
    backgroundColor: "white",
    marginBottom: 5,
    width: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
    borderWidth: 0.4,
    borderColor: "#00000020",
    padding: 2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 2,
    marginTop: 1,
  },

  LeftButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    gap: 5,
    flexDirection: "row",
  },

  rightContainer: {
    backgroundColor: "white",
    marginBottom: 5,
    width: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
    borderWidth: 0.4,
    borderColor: "#00000020",
    padding: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: 2,
    marginTop: 1,
  },

  RightButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    gap: 5,
    flexDirection: "row",
  },
  imageContainer: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
    width: width / 1.7,
  },
  positionTimeStyle: {
    position: "absolute",
    bottom: 10,
    right: 15,
    elevation: 5,
  },
});
