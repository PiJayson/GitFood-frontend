import React from 'react';
import { Button, View, StyleSheet } from 'react-native';

export default function ShoppingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Open Scanner"
        onPress={() => navigation.navigate('Scanner')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
