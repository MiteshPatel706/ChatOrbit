/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import {StatusBar, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import CommingSoonModal from './src/component/CommingSoonModal';
import CustomDialog from './src/component/CustomDialog';
import CustomLoader from './src/component/CustomLoader';
import CustomToast from './src/component/CustomToast';
import {setupNotificationHandlers} from './src/component/NotificationService';
import StackNavigation from './src/route/StackNavigation';
import Store from './src/Store/Store';
import Colors from './src/theme/Color';

function App() {
  const isVisible = Store(state => state.isLoaderVisible);

  useEffect(() => {
    setupNotificationHandlers();
  }, []);
  return (
    <View style={{flex: 1}}>
      <StatusBar
        backgroundColor={Colors.screenBg}
        barStyle={'dark-content'}
        translucent
      />
      <GestureHandlerRootView>
        <StackNavigation />
      </GestureHandlerRootView>
      <CustomToast />
      <CustomDialog />
      <CustomLoader isVisible={isVisible} />
      <CommingSoonModal />
    </View>
  );
}

export default App;
