import React from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';

const TypingIndicator = () => {
  const dotScale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotScale, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(dotScale, {
          toValue: 0.2,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.dot, {opacity: dotScale}]}>•</Animated.Text>
      <Animated.Text style={[styles.dot, {opacity: dotScale}]}>•</Animated.Text>
      <Animated.Text style={[styles.dot, {opacity: dotScale}]}>•</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    fontSize: 22,
    marginHorizontal: 1,
    color: '#888',
    fontWeight: '900',
  },
});

export default TypingIndicator;
