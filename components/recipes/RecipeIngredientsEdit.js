import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { syncFridgeStore } from "../../screens/fridge/FridgeStore";
import IngredientEdit from "./IngredientEdit";

export default function RecipeIngredientsEdit({ ingredientsList }) {
  const ingredients = ingredientsList.map((ingredient) => ({
    ...ingredient,
    inFridge: syncFridgeStore
      .elements()
      .some((el) => el.categoryId === ingredient.id).quantity,
  }));

  const fridge = syncFridgeStore.currentStore();

  return (
    <View style={styles.container}>
      {/* <Button>Choose Fridge</Button> */}
      <View style={styles.ingredientsContainer}>
        {ingredients.map((ingredient) => (
          <IngredientEdit ingredient={ingredient} />
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
