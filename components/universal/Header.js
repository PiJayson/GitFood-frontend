import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../assets/theme";

export default function Header(props) {
  return <Text variant="headlineMedium" style={styles.header} {...props} />;
}

const styles = StyleSheet.create({
  header: {
    color: theme.colors.primary,
    fontWeight: "bold",
    paddingVertical: 12,
  },
});
