import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Store = create(
  persist(
    set => ({
      toastData: {
        isVisible: false,
        text1: '',
        text2: '',
        type: 1,
        iconType: '',
      },
      isLoaderVisible: false,
      dialogData: {
        isVisible: false,
        title: '',
        description: '',
        onCancel: () => {},
        onDone: () => {},
        isOutSideDisable: () => {},
      },
      bottomTabZindex: 0,
      CommingSoonData: {
        isVisible: false,
        title: '',
        description: '',
      },

      // Actions
      setToastData: data => set({toastData: data}),
      setIsLoaderVisible: value => set({isLoaderVisible: value}),
      setDialogData: data => set({dialogData: data}),
      setBottomTabZindex: value => set({bottomTabZindex: value}),
      setCommingSoonData: data => set({CommingSoonData: data}),
    }),
    {
      name: 'app-storage', // Storage key
      getStorage: () => {
        console.log('Accessing AsyncStorage...');
        return AsyncStorage;
      },
    },
  ),
);

export default Store;
