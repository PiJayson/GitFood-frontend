import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { theme } from "../../assets/theme";

export default function IngredientEdit({ ingredient, updateIngredient }) {
  return (
    <View style={styles.container}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{ingredient.categoryName}</Text>
        <TextInput
          style={styles.productQuantity}
          value={String(ingredient.quantity)}
          keyboardType="numeric"
          onChangeText={(newQuantityText) => {
            const newQuantity = parseInt(newQuantityText, 10);
            console.log("newQuantity", newQuantity, "ingredient", ingredient);

            updateIngredient({
              type: "update",
              updatedIngredient: { ...ingredient, quantity: newQuantity },
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 25,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    flex: 2,
  },
  categoryQuantity: {
    fontSize: 24,
    marginLeft: 10,
    flex: 1,
    textAlign: "right",
  },
  expandButton: {
    marginLeft: 10,
  },
  unit: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
