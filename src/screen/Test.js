import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import RenderItem from '../component/RenderItem';

const Test = () => {
  const [toDoList, setToDoList] = useState([
    {id: '1', title: 'Task 1'},
    {id: '2', title: 'Task 2'},
    {id: '3', title: 'Task 3'},
  ]);
  const [doneList, setDoneList] = useState([]);

  const moveToDone = item => {
    setToDoList(toDoList.filter(task => task.id !== item.id));
    setDoneList([...doneList, item]);
  };

  const moveToToDo = item => {
    setDoneList(doneList.filter(task => task.id !== item.id));
    setToDoList([...toDoList, item]);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <Text style={styles.header}>To Do</Text>
          <FlatList
            data={toDoList}
            // renderItem={({item}) => renderItem(item, moveToDone)}
            renderItem={({item}) => (
              <RenderItem item={item} moveToDone={item => moveToDone(item)} />
            )}
            keyExtractor={item => item.id}
          />
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.header}>Done</Text>
          <FlatList
            data={doneList}
            renderItem={({item}) => (
              <RenderItem item={item} moveToDone={item => moveToToDo(item)} />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </GestureHandlerRootView>
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

export default Test;
