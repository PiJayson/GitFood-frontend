import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function Ingredient({
  ingredient,
  addIngredientToShoppingList,
}) {
  const enough = ingredient.inFridge;

  return (
    <View style={styles.container}>
      <Text variant="bodyMedium" style={styles.text}>
        {ingredient.categoryName} ({ingredient.quantity} {ingredient.units})
      </Text>
      <IconButton
        icon={enough ? "check-circle-outline" : "checkbox-blank-circle-outline"}
      />
      <IconButton
        icon="plus"
        onPress={() => addIngredientToShoppingList(ingredient)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    minHeight: 60,
  },
  text: {
    flexWrap: "wrap",
    fontWeight: "bold",
    marginLeft: 10,
    flex: 2,
  },
});
