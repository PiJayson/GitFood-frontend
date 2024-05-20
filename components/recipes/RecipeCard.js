import React from "react";
import { StyleSheet } from "react-native";
import { Card, Button, IconButton, Text } from "react-native-paper";

export default function RecipeCard({ recipe, onViewRecipe, onLikeRecipe }) {
  return (
    <Card style={styles.container}>
      <Card.Title title={recipe.name} />
      <Card.Cover
        source={
          // recipe.image
          //   ? { uri: recipe.image }
          //   :
          require("../../assets/burger.jpeg")
        }
        resizeMode="cover"
        style={styles.image}
      />
      <Card.Content>
        <Text>{recipe.description}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon={"arrow-right-circle"}
          onPress={() => onViewRecipe(recipe)}
        />
        <IconButton icon={"heart"} onPress={() => onLikeRecipe(recipe)}>
          Like Recipe
        </IconButton>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: "100%",
    maxWidth: 800,
    margin: 12,
    maxHeight: 600,
    alignSelf: "center",
  },
  image: {
    Width: "100%",
    flex: 1,
  },
});
