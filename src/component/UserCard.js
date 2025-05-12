import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import Colors from '../theme/Color';
import {Swipeable} from 'react-native-gesture-handler';
import Images from '../theme/Images';
import LazyImageLoading from './LazyImageLoading';

import Ionicons from 'react-native-vector-icons/Ionicons';

const UserCard = ({
  item,
  onPress,
  onDelete,
  onClickVoiceCall,
  onClickVideoCall,
}) => {
  const swipeableRef = useRef(null);

  const renderLeftActions = () => (
    <View style={styles.leftContainer}>
      <TouchableOpacity
        style={styles.LeftButton}
        activeOpacity={0.9}
        onPress={() => {
          onDelete(item);
          swipeableRef.current.close();
        }}>
        <Image
          source={Images.delete}
          style={{
            height: 22,
            width: 22,
          }}
          tintColor={'white'}
        />
      </TouchableOpacity>
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.rightContainer}>
      <View style={styles.rightBtnGroup}>
        <TouchableOpacity
          style={[styles.rightButton, {flex: 1.15}]}
          activeOpacity={0.9}
          onPress={() => {
            onClickVoiceCall(item);
            swipeableRef.current.close();
          }}>
          {/* <ZegoSendCallInvitationButton
            invitees={[{userID: item?.userId, userName: item?.name}]}
            isVideoCall={false}
            backgroundColor={'transparent'}
            text={<Ionicons name="call" size={28} color="white" />}
            icon={'ss'}
          /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rightButton}
          activeOpacity={0.9}
          onPress={() => {
            onClickVideoCall(item);
            swipeableRef.current.close();
          }}>
          {/* <ZegoSendCallInvitationButton
            invitees={[{userID: item?.userId, userName: item?.name}]}
            isVideoCall={true}
            backgroundColor={'transparent'}
            text={<Ionicons name="videocam" size={28} color="white" />}
            icon={'ss'}
          /> */}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      containerStyle={{flex: 1}}>
      <View style={{width: '100%', backgroundColor: Colors.white}}>
        <TouchableOpacity
          style={styles.userItem}
          onPress={() => onPress(item)}
          activeOpacity={0.9}>
          <LazyImageLoading
            source={{uri: item.profileImage}}
            style={styles.userImage}
            placeHolder={Images.user}
            resizeMode={'cover'}
            placeHolderTintColor={Colors.green}
          />

          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.userMessage} numberOfLines={1}>
              {item.email}
            </Text>
          </View>
          {item?.notification != undefined &&
            item?.notification != null &&
            item?.notification != '' &&
            item?.notification != '' && (
              <View style={styles.notificationContainer}>
                <Text style={styles.notificationText} numberOfLines={1}>
                  {item?.notification}
                </Text>
              </View>
            )}
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  notificationText: {
    color: Colors.black,
    fontWeight: '500',
  },
  notificationContainer: {
    height: '100%',
    width: 50,
    // borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCF8C5',
    position: 'absolute',
    right: 0,
  },
  rightBtnGroup: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    flexDirection: 'row',
    overflow: 'hidden',
    gap: 2,
  },
  rightButton: {
    backgroundColor: Colors.green,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LeftButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    flex: 1,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  leftContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    width: 70,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginRight: 2,
    paddingVertical: 5,
    overflow: 'hidden',
    paddingRight: 5,
  },
  rightContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    width: 120,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: 2,
    paddingVertical: 5,
    overflow: 'hidden',
    paddingLeft: 5,
  },
  userList: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    backgroundColor: Colors.white,
    borderRadius: 50,

    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
    gap: 12,
    height: 60,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  userMessage: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
