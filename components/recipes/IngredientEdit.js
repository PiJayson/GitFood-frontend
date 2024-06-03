import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function IngredientEdit({ ingredient }) {
  const enough = ingredient.required < ingredient.inFridge;

  return (
    <View style={styles.container}>
      <IconButton icon="plus" onPress={() => console.log("")} />
      <Text style={styles.text}>
        {ingredient.name} ({ingredient.required})
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