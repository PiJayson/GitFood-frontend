import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import Ingredient from "./Ingredient";

export default function RecipeIngredients({ ingredientsList }) {
  const ingredients = ingredientsList.map((ingredient) => ({
    ...ingredient,
    inFridge: 0,
  }));

  return (
    <View style={styles.container}>
      <Button>Choose Fridge</Button>
      <View style={styles.ingredientsContainer}>
        {ingredients.map((ingredient, index) => (
          <Ingredient key={index} ingredient={ingredient} />
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
