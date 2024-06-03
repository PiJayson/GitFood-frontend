import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../assets/theme";

export default function Title(props) {
  return <Text variant="displaySmall" style={styles.title} {...props} />;
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.primary,
    fontWeight: "bold",
    paddingVertical: 12,
  },
});
