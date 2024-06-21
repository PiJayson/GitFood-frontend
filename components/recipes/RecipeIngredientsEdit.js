import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import IngredientEdit from "./IngredientEdit";
import { FlatList } from "react-native";

export default function RecipeIngredientsEdit({
  ingredientsList,
  updateIngredientsList,
  addNewIngredient,
}) {
  const AddIngredientButton = () => {
    return (
      <Button
        icon="plus"
        style={styles.addIngredientButton}
        onPress={() => addNewIngredient()}
      >
        Add Ingredient
      </Button>
    );
  };

  const updateIngredient = (actions) => {
    switch (actions.type) {
      case "update":
        console.log("ajfklds", ingredientsList);
        console.log("actions", actions);
        const newIngredientsList = ingredientsList.map((ingredient) =>
          ingredient.categoryId === actions.updatedIngredient.categoryId
            ? actions.updatedIngredient
            : ingredient,
        );
        console.log("update to", newIngredientsList);
        updateIngredientsList(newIngredientsList);
        break;
      case "delete":
        updateIngredientsList(
          ingredientsList.filter(
            (ingredient) => ingredient.id !== actions.ingredient.id,
          ),
        );
        break;
      default:
        break;
    }
  };

  console.log("ingredientsList", ingredientsList);

  return (
    <View style={styles.container}>
      <View style={styles.ingredientsContainer}>
        <AddIngredientButton />
        {ingredientsList.map((item) => (
          <IngredientEdit
            key={item.categoryId}
            ingredient={item}
            updateIngredient={updateIngredient}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    borderColor: "#d3d3d3",
    borderWidth: 4,
    borderRadius: 5,
  },
  ingredientsContainer: {
    flex: 2,
    padding: 5,
  },
  addIngredientButton: {
    margin: 10,
    marginBottom: 30,
  },
});
