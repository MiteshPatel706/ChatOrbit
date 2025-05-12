import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import Images from '../theme/Images';
import Colors from '../theme/Color';

const LazyImageLoading = props => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isError, setError] = useState(false);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            !isImageLoaded && isError ? Colors.inputBG : Colors.inputBG,
        },
        props.style,

        props.bgColor && {backgroundColor: props.bgColor},
      ]}>
      {(!isImageLoaded || isError) && (
        <Image
          source={props.placeHolder ?? Images.noImg}
          style={[styles.placeHolderImageStyle, props.placeHolderImageStyle]}
          resizeMode={'contain'}
          tintColor={props?.placeHolderTintColor}
        />
      )}
      {isImageLoaded && (
        <ActivityIndicator
          size={'small'}
          color={Colors.green}
          style={[styles.placeHolderImageStyle, props.placeHolderImageStyle]}
        />
      )}
      <Image
        source={props.source}
        style={[styles.image, props.imageStyle]}
        onLoadStart={() => {
          setImageLoaded(true);
        }}
        onLoadEnd={() => {
          setImageLoaded(false);
        }}
        onError={() => {
          setError(true);
          setImageLoaded(false);
        }}
        resizeMode={props.resizeMode ?? 'contain'}
      />
    </View>
  );
};
export default LazyImageLoading;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHolderImageStyle: {
    position: 'absolute',
    height: '50%',
    width: '50%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
