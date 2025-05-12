import React from 'react';
import {Text, View} from 'react-native';
import Store from '../Store/Store';
import OpcityModal from './OpcityModal';
import Colors from '../theme/Color';
import CommanStyle from '../theme/CommanStyle';
import CustomButton from './CustomButton';

const CustomDialog = () => {
  let {isVisible, title, description, onCancel, onDone, isOutSideDisable} =
    Store(state => state.dialogData);

  let setDialogData = Store(state => state.setDialogData);

  return (
    <OpcityModal
      isOutSideDisable={
        isOutSideDisable !== undefined ? isOutSideDisable : false
      }
      isVisible={isVisible}
      onClose={() => {}}
      onRequestClose={() => {}}>
      <View
        style={{
          width: '90%',
          backgroundColor: Colors.white,
          borderRadius: 10,
          paddingHorizontal: 15,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            marginVertical: 20,
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.black,
          }}>
          {title}
        </Text>
        <View
          style={[
            CommanStyle.deviderView,
            {
              marginVertical: 0,
            },
          ]}
        />

        <Text
          style={{
            textAlign: 'center',
            marginVertical: 20,
            fontSize: 14,
            fontWeight: '400',
            color: Colors.black,
          }}>
          {description}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: onCancel && onDone ? 'space-between' : 'center',
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          {onCancel && (
            <CustomButton
              customStyle={{
                backgroundColor: Colors.green,
                width: '45%',
                borderRadius: 30,
                marginTop: 0,
              }}
              title={'cancel'}
              onPress={() => {
                setDialogData({isVisible: false});
                onCancel && onCancel();
              }}
            />
          )}
          {onDone && (
            <CustomButton
              customStyle={{
                backgroundColor: Colors.green,
                width: '45%',
                borderRadius: 30,
                marginTop: 0,
              }}
              title={'okay'}
              onPress={() => {
                setDialogData({isVisible: false});
                onDone && onDone();
              }}
            />
          )}
        </View>
      </View>
    </OpcityModal>
  );
};
export default CustomDialog;
