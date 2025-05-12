import {Dimensions, Image} from 'react-native';

const {height, width} = Dimensions.get('screen');
/**  set value as per figma screen height and width */
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

/** This line logic is applied to style for managing all views, text, etc. calculating the width of device and showing properly as per figma */
const screenScale = size => (width / guidelineBaseWidth) * size;
/**This line logic is applied to style for managing all views, text, etc. calculating the height of device and showing properly as per figma */
const verticalScale = size => (height / guidelineBaseHeight) * size;
/** this line logic applied to style for manage text size as per figma for all device */
const moderateScale = (size, factor = 0.5) =>
  size + (screenScale(size) - size) * factor;

/** this obj var make customize toast msg */

export {screenScale, verticalScale, moderateScale, height, width};
