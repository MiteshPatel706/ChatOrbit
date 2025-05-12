import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const RenderItem = ({item, moveToDoneFn}) => {
  // Shared values for animated translation
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translationX.value;
      context.startY = translationY.value;
    },
    onActive: (event, context) => {
      translationX.value = context.startX + event.translationX;
      translationY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      // Return to original position with spring animation
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translationX.value},
      {translateY: translationY.value},
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.draggableItem, animatedStyle]}>
        <TouchableOpacity onPress={() => moveToDoneFn(item)}>
          <View style={styles.itemContainer}>
            <Text>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  draggableItem: {
    width: '100%',
  },
});

export default RenderItem;
