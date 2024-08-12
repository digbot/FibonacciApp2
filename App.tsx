import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';

const fibonacci = (max) => {
  const sequence = [0, 1];
  let next = 1;

  while (next <= max) {
    sequence.push(next);
    next = sequence[sequence.length - 1] + sequence[sequence.length - 2];
  }

  return sequence;
};

const veryIntensiveTask = async (taskDataArguments) => {
    console.log('START  3333');
    /*
  const { delay } = taskDataArguments;

  const fibList = fibonacci(1000);
  await AsyncStorage.setItem('fibList', JSON.stringify(fibList));

  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      await new Promise((r) => setTimeout(r, delay));
    }
    resolve();
  });*/
};

const options = {
  taskName: 'FibonacciTask',
  taskTitle: 'Fibonacci Calculation',
  taskDesc: 'Calculating Fibonacci numbers up to 1000.',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // Replace with your actual deep link URI
  parameters: {
    delay: 1000,
  },
};

const App = () => {
  const [fibList, setFibList] = useState([]);

  const loadFibList = async () => {
    const storedFibList = await AsyncStorage.getItem('fibList');
    if (storedFibList) {
      setFibList(JSON.parse(storedFibList));
    }
  };

  useEffect(() => {
    loadFibList();
  }, []);

  const startBackgroundTask = async () => {
    console.log('START 2222');
    await BackgroundService.start(veryIntensiveTask, options);
    // await loadFibList();
  };

  const stopBackgroundTask = async () => {
    await BackgroundService.stop();
    await loadFibList();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fibonacci Sequence up to 1000</Text>
      <Button title="Start Task" onPress={startBackgroundTask} />
      <Button title="Stop Task" onPress={stopBackgroundTask} />
      <FlatList
        data={fibList}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default App;