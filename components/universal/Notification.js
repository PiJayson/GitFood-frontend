// components/Notification.js
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Notification = ({ message }) => {
  const insets = useSafeAreaInsets();
  const [opacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start();
      }, 3000);
    });
  }, [message]);

  return (
    <Animated.View style={[styles.container, { opacity, bottom: insets.bottom + 20, right: insets.right + 20 }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    maxWidth: '80%',
    right: 10,
    bottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default Notification;
