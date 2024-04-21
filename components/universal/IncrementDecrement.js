import React from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Button,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Icon from "react-native-vector-icons/AntDesign";

export default function IncrementDecrement({ update }) {
  return (
    <View style={styles.container}>
      <Button title="+" onPress={() => update(1)} />
      <Button title="-" onPress={() => update(-1)} />
    </View>
  );
} //we should change this to Icons

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    right: 0,
    paddingRight: 8,
  },
});
