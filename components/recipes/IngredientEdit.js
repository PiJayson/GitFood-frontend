import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { theme } from "../../assets/theme";

export default function IngredientEdit({ ingredient, updateIngredient }) {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium" style={styles.text}>
        {ingredient.categoryName}
      </Text>
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
  productQuantity: {
    backgroundColor: "transparent",
  },
});
