import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function Ingredient({ ingredient }) {
  const enough = ingredient.inFridge;

  return (
    <View style={styles.container}>
      <IconButton
        icon={enough ? "check-circle-outline" : "checkbox-blank-circle-outline"}
      />
      <Text style={styles.text}>
        {ingredient.categoryName} ({ingredient.quantity})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
});
