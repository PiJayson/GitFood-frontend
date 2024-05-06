import React from "react";
import { Card, Button, IconButton, Text } from "react-native-paper";

export default function RecipeCard({ recipe, onViewRecipe, onLikeRecipe }) {
  return (
    <Card>
      <Card.Title title={recipe.name} />
      <Card.Cover
        source={
          // recipe.image
          //   ? { uri: recipe.image }
          //   :
          require("../../assets/burger.jpeg")
        }
        resizeMode="cover"
        style={{ flex: 1, height: 300 }}
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
