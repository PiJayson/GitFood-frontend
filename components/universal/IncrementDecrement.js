import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

export default function IncrementDecrement({ update, containerStyle, buttonStyle }) {
  return (
    <View style={[styles.container, containerStyle]}>
      <IconButton
        mode="outlined"
        icon="plus"
        style={[styles.button, buttonStyle]}
        onPress={() => update(1)}
        iconColor={buttonStyle?.iconColor || 'black'}  // Set icon color from style prop
        containerColor={buttonStyle?.containerColor || 'transparent'}  // Set container color from style prop
      />
      <IconButton
        mode="outlined"
        icon="minus"
        style={[styles.button, buttonStyle]}
        onPress={() => update(-1)}
        iconColor={buttonStyle?.iconColor || 'black'}  // Set icon color from style prop
        containerColor={buttonStyle?.containerColor || 'transparent'}  // Set container color from style prop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
  },
  button: {
    marginHorizontal: 5,
  },
});
