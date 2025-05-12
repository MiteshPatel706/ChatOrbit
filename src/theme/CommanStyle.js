import {StyleSheet} from 'react-native';
import Colors from './Color';

export const CommanStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerItemCenter: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviderView: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.grey_text,
  },
});

export default CommanStyle;
