import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Store from '../Store/Store';
import Colors from '../theme/Color';
import Images from '../theme/Images';
import LazyImageLoading from './LazyImageLoading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const UserDetailHeader = ({userData, onClickBack}) => {
  const [invitees, setInvitees] = useState([]);
  const setCommingSoonData = Store(state => state.setCommingSoonData);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setInvitees([userData]);
  }, [userData]);

  return (
    <View style={[styles.header, {paddingTop: insets.top + 2}]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => onClickBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <LazyImageLoading
          source={{uri: userData?.profileImage}}
          style={styles.userImage}
          placeHolder={Images.user}
          resizeMode={'cover'}
          placeHolderTintColor={Colors.green}
        />

        <Text style={styles.headerTitle}>{userData.name}</Text>
      </View>
      <View style={styles.headerActions}>
        {/* <Ionicons name="call" size={24} color="white" style={styles.icon} />
        <Ionicons name="videocam" size={24} color="white" style={styles.icon} /> */}
        <TouchableOpacity
          onPress={() =>
            setCommingSoonData({
              isVisible: true,
              title: 'More options',
              description: 'Comming soon...',
            })
          }>
          <Ionicons name="ellipsis-vertical" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserDetailHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.green,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 8,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
});
