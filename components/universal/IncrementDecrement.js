import React from "react";
import { StyleSheet, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { IconButton } from "react-native-paper";

export default function IncrementDecrement({ update }) {
  return (
    <View style={styles.container}>
      <IconButton
        mode="outlined"
        icon="plus"
        style={styles.button}
        onPress={() => update(1)}
      />
      <IconButton
        mode="outlined"
        icon="minus"
        style={styles.button}
        onPress={() => update(-1)}
      />
    </View>
  );
} //we should change this to Icons

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: 8,
    maxHeight: 100,
    right: 0,
    height: 30,
    maxWidth: 90,
    width: 90,
    marginTow: 5,
    marginBottom: 10,
  },
  button: {
    margin: 5,
  },
});
