import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import ExpandableList from "../universal/ExpandableList";
import { useRestApi } from "../../providers/RestApiProvider";

import Ingredient from "./Ingredient";
import { FlatList } from "react-native";

export default function RecipeIngredients({
  ingredientsList,
  syncStore,
  addIngredientToShoppingList,
}) {
  const fridgeElements = syncStore.elements();

  const ingredients = ingredientsList.map((ingredient) => ({
    ...ingredient,
    inFridge: fridgeElements.some(
      (el) =>
        el.categoryId === ingredient.categoryId &&
        el.quantity > ingredient.quantity,
    ),
  }));

  const { getFridgeProducts } = useRestApi();

  const fridge = syncStore.currentStore();
  const fridgeName = fridge ? fridge.name : "No fridge selected";

  return (
    <View style={styles.container}>
      <ExpandableList
        title={fridgeName}
        items={syncStore.stores()}
        onSelect={(item) => syncStore.setStore(item, getFridgeProducts)}
      />
      {ingredients.map((item) => (
        <Ingredient
          key={item.categoryId}
          ingredient={item}
          addIngredientToShoppingList={addIngredientToShoppingList}
        />
      ))}
      {/* <View style={styles.ingredientsContainer}>
        {ingredients.map((ingredient) => (
          <Ingredient ingredient={ingredient} />
        ))}
      </View> */}
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
    flex: 1,
    padding: 5,
  },
});
