import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../core/theme";

export default function ProductName(props) {
  return <Text variant="displayMedium" style={styles.productname} {...props} />;
}

const styles = StyleSheet.create({
  productname: {
    flex: 6,
    textAlign: "center",
    fontSize: 36,
    // color: theme.colors.primary,
    fontWeight: "bold",
    paddingLeft: 16,
  },
});
