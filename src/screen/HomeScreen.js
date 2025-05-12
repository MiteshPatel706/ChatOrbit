import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddContactModal from '../component/AddContactModal';
import CustomHeader from '../component/CustomHeader';
import UserCard from '../component/UserCard';
import Store from '../Store/Store';
import Colors from '../theme/Color';
import CommanStyle from '../theme/CommanStyle';
import Images from '../theme/Images';
import Lotties from '../theme/Lotties';
import {height, width} from '../utils/dimen';
import getUserInfo from '../utils/GetUserInfo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HomeScreen = ({navigation}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuOpacity = useState(new Animated.Value(0))[0];
  const [contacts, setContacts] = useState([]);
  const [addContactList, setAddContactList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const isLoaderVisible = Store(state => state.isLoaderVisible);
  const setIsLoaderVisible = Store(state => state.setIsLoaderVisible);
  const setDialogData = Store(state => state.setDialogData);
  const setToastData = Store(state => state.setToastData);
  const isFocused = useIsFocused();

  const setBottomTabZindex = Store(state => state.setBottomTabZindex);
  const filteredContacts = contacts?.filter(contact =>
    contact?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  );
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setIsLoaderVisible(true);

    (async () => {
      const user = await getUserInfo();
      const profileData = await firestore()
        .collection('users')
        .doc(user.userId)
        .get();

      setCurrentUser(profileData?.data());
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify(profileData?.data()),
      );
    })();
    (async () => {
      await firestore()
        .collection('users')
        .get()
        .then(item => {
          setAddContactList(item?.docs?.map(item => item?.data()));
          setIsLoaderVisible(false);
        })
        .catch(err => {
          console.log('error: ', err);
          setIsLoaderVisible(false);
        });
    })();
  }, []);

  useEffect(() => {
    if (!!currentUser?.userId) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(currentUser?.userId)
        .collection('contacts')
        .orderBy('createdAt', 'desc')
        .onSnapshot(async snapshot => {
          const contactData = snapshot.docs.map(doc => doc.data());
          const contactPromises = contactData.map(item =>
            firestore().collection('users').doc(item?.userId).get(),
          );

          const contactDocs = await Promise.all(contactPromises);
          const updatedContacts = contactDocs.map((contactDoc, index) => ({
            id: contactDoc.id,
            ...contactData[index],
            ...contactDoc.data(),
          }));
          setContacts(updatedContacts);
          if (isLoaderVisible) {
            setIsLoaderVisible(false);
          }
        });

      return () => unsubscribe();
    }
  }, [currentUser, isFocused]);

  const onUserCardClick = item => {
    navigation.navigate('UserDetailScreen', {
      user: item,
      currentUser: currentUser,
    });
  };

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const onDelete = item => {
    setDialogData({
      isVisible: true,
      title: 'Confirm',
      description: 'Are you sure you want to Delete User.',
      onDone: () => {
        setIsLoaderVisible(true);
        handleDeleteContact(item.id);
      },
      onCancel: () => {},
    });
  };

  const onClickVoiceCall = item => {
    null;
  };
  const onClickVideoCall = item => {
    null;
  };

  const handleDeleteContact = async contactId => {
    try {
      await firestore()
        .collection('users')
        .doc(currentUser.userId)
        .collection('contacts')
        .doc(contactId)
        .delete();
      setIsLoaderVisible(false);

      setToastData({
        type: 1,
        text1: 'Contact deleted successfully',
        text2: '',
        iconType: '',
        isVisible: true,
      });
    } catch (error) {
      setIsLoaderVisible(false);
      setToastData({
        type: 0,
        text1: 'Failed to delete contact',
        text2: '',
        iconType: '',
        isVisible: true,
      });
      console.error(error);
    }
  };

  useEffect(() => {
    setBottomTabZindex(modalVisible ? -1 : 0);
  }, [modalVisible]);

  return (
    <View style={CommanStyle.container}>
      <StatusBar backgroundColor={Colors.green} barStyle={'light-content'} />
      <CustomHeader
        showBack={false}
        leftView={() => {
          return <Text style={styles.headerTitle}>Chats</Text>;
        }}
        rightView={() => {
          return (
            <TouchableOpacity onPress={() => toggleMenu()}>
              <Ionicons name="ellipsis-vertical" size={28} color="white" />
            </TouchableOpacity>
          );
        }}
      />

      {menuVisible && (
        <Animated.View
          style={[styles.menu, {opacity: menuOpacity, marginTop: insets.top}]}>
          <Text style={styles.menuItem}>Profile</Text>
          <Text style={styles.menuItem}>Settings</Text>
          <Text
            style={styles.menuItem}
            onPress={() => {
              auth().signOut();
              navigation.navigate('Splash');
              AsyncStorage.clear();
            }}>
            Logout
          </Text>
        </Animated.View>
      )}
      <View style={styles.inputContainer}>
        <LottieView
          source={Lotties.searchAnimation}
          autoPlay
          loop
          style={{
            height: 22,
            width: 22,
          }}
          speed={0.4}
        />
        <TextInput
          style={styles.input}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.black}
        />
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={filteredContacts}
          keyExtractor={item => item.userId}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <UserCard
                item={item}
                onPress={item => onUserCardClick(item)}
                onDelete={item => onDelete(item)}
                onClickVoiceCall={item => onClickVoiceCall(item)}
                onClickVideoCall={item => onClickVideoCall(item)}
              />
            );
          }}
          contentContainerStyle={styles.userList}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={Images.noMessageBg}
                  style={{height: height / 1.7, width: width - 100}}
                  resizeMode="contain"
                />
              </View>
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <LottieView
          source={Lotties.AddAnimation}
          autoPlay
          loop
          style={{height: 65, width: 65}}
        />
      </TouchableOpacity>

      {/* AddAnimation */}

      {modalVisible && (
        <AddContactModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          currentUser={currentUser}
          data={addContactList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    fontSize: 16,
    color: Colors.black,
  },
  userList: {
    // padding: 16,
    // paddingVertical: 15,
    // marginBottom: 500,
    paddingBottom: 200,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userMessage: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 115,
    right: 16,
    height: 65,
    width: 65,
  },
  input: {
    height: 50,
    color: Colors.black,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 2,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,

    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
});

export default HomeScreen;
