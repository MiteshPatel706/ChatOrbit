import firestore from '@react-native-firebase/firestore';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Store from '../Store/Store';
import Colors from '../theme/Color';
import OpcityModal from './OpcityModal';
import LazyImageLoading from './LazyImageLoading';
import Images from '../theme/Images';
import {height} from '../utils/dimen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ContatItem = memo(({item, onClickContactItem}) => {
  return (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => onClickContactItem(item)}
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
      <View style={{width: 25, alignItems: 'flex-end'}}>
        {item?.selected && (
          <Ionicons name="checkmark-sharp" size={22} color={Colors.green} />
        )}
      </View>
    </TouchableOpacity>
  );
});

const AddContactModal = ({currentUser, visible, onClose, data}) => {
  const [contactListData, setContactListData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('Email');
  const [selectContact, setSelectContact] = useState({});
  const setToastData = Store(state => state.setToastData);

  useEffect(() => {
    StatusBar.setTranslucent(true);
    if (data) {
      const filterData = data.map(contact => {
        return {...contact, selected: false};
      });
      setContactListData(filterData);
    }
  }, []);

  const handleAddContact = async () => {
    onClose();
    if (selectContact?.email == undefined || !selectContact?.email.trim()) {
      setToastData({
        type: 0,
        text1: 'Email cannot be empty',
        text2: '',
        iconType: '',
        isVisible: true,
      });
      return;
    } else if (currentUser.email === selectContact?.email) {
      setToastData({
        type: 0,
        text1: 'Cannot add yourself as a contact',
        text2: '',
        iconType: '',
        isVisible: true,
      });
      return;
    }

    try {
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', selectContact?.email)
        .get();

      if (userSnapshot.empty) {
        setToastData({
          type: 0,
          text1: 'No user found with this email.',
          text2: selectContact?.email,
          iconType: '',
          isVisible: true,
        });
        return;
      }

      const user = userSnapshot.docs[0].data();
      const userId = userSnapshot.docs[0].id;

      // Check if the contact already exists
      const contactSnapshot = await firestore()
        .collection('users')
        .doc(currentUser.userId)
        .collection('contacts')
        .doc(userId)
        .get();

      if (contactSnapshot?._exists) {
        setToastData({
          type: 0,
          text1: 'Contact already exists',
          text2: user.email,
          iconType: '',
          isVisible: true,
        });
        return;
      }

      // Add the contact if it doesn't exist
      const AddData = {
        userId: userId,
        createdAt: new Date(),
        notification: '',
        lastMessage: '',
      };
      await firestore()
        .collection('users')
        .doc(currentUser.userId)
        .collection('contacts')
        .doc(userId)
        .set(AddData);

      setToastData({
        type: 1,
        text1: 'Contact added successfully',
        text2: selectContact?.email,
        iconType: '',
        isVisible: true,
      });
    } catch (error) {
      console.error(error);
      onClose();
      setToastData({
        type: 0,
        text1: 'Something went wrong',
        text2: '',
        iconType: '',
        isVisible: true,
      });
    }
  };

  const onClickContactItem = useCallback(item => {
    setSelectContact(item);
    const filterData = data.map(contact => {
      if (contact?.userId == item?.userId) {
        return {...contact, selected: true};
      } else {
        return {...contact};
      }
    });
    setContactListData(filterData);
  }, []);

  const onChangeSearchText = useCallback((text, searchType) => {
    const filteredContacts = data.filter(contact =>
      searchType == 'Email'
        ? contact.email.toLowerCase().includes(text.toLowerCase())
        : contact.name.toLowerCase().includes(text.toLowerCase()),
    );
    setContactListData(filteredContacts);
    setSelectContact({});
  }, []);

  return (
    <OpcityModal isVisible={visible} onClose={onClose} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Add Contact</Text>
        <TextInput
          style={styles.input}
          placeholder={filterType == 'Email' ? 'Enter email' : 'Enter name'}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            onChangeSearchText(text, filterType);
          }}
          placeholderTextColor={Colors.black}
        />
        <View style={styles.filterGroup}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterType == 'Email' && styles.activeFilterBtn,
            ]}
            activeOpacity={0.9}
            onPress={() => {
              setFilterType('Email');
              onChangeSearchText(searchText, 'Email');
            }}>
            <Text
              style={[
                styles.filterName,
                filterType == 'Email' && styles.activeFilterName,
              ]}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterType == 'Name' && styles.activeFilterBtn,
            ]}
            activeOpacity={0.9}
            onPress={() => {
              setFilterType('Name');
              onChangeSearchText(searchText, 'Name');
            }}>
            <Text
              style={[
                styles.filterName,
                filterType == 'Name' && styles.activeFilterName,
              ]}>
              Name
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 5, height: height / 2.5}}>
          <FlatList
            data={contactListData}
            renderItem={({item}) => (
              <ContatItem
                item={item}
                onClickContactItem={item2 => onClickContactItem(item2)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddContact}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OpcityModal>
  );
};

const styles = StyleSheet.create({
  filterGroup: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: 'space-around',
  },
  filterBtn: {
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.grey_text,
  },
  activeFilterBtn: {
    borderColor: Colors.green,
  },
  filterName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grey2,
  },
  activeFilterName: {
    color: Colors.green,
  },
  container: {
    backgroundColor: 'rgba(0,0, 0,0.29)',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.29)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    elevation: 2,
    alignSelf: 'center',
  },
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 20},
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    elevation: 2,
    color: Colors.black,
    fontWeight: '',
    borderWidth: 0.6,
    borderColor: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: Colors.green,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    color: Colors.black,
  },
  cancelButton: {backgroundColor: '#f0f0f0'},
  buttonText: {color: '#fff', fontWeight: 'bold'},
  cancelButtonText: {color: '#000'},
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: Colors.white,
    width: '100%',
    marginVertical: 2,
    gap: 12,
    overflow: 'hidden',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  userMessage: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
});

export default AddContactModal;
