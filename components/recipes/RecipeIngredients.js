import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import Ingredient from "./Ingredient";
import { syncFridgeStore } from "../../screens/fridge/FridgeStore";

export default function RecipeIngredients({ ingredientsList }) {
  const ingredients = ingredientsList.map((ingredient) => ({
    ...ingredient,
    inFridge: syncFridgeStore
      .elements()
      .some(
        (el) =>
          el.categoryId === ingredient.id && el.quantity > Ingredient.quantity,
      ),
  }));

  const fridge = syncFridgeStore.currentStore();
  const fridgeName = fridge ? fridge.name : "No fridge selected";

  return (
    <View style={styles.container}>
      <Button mode="contained">{fridgeName}</Button>
      <View style={styles.ingredientsContainer}>
        {ingredients.map((ingredient) => (
          <Ingredient ingredient={ingredient} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  ingredientsContainer: {
    flex: 1,
    padding: 10,
  },
});
