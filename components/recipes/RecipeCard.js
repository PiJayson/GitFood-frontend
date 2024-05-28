import React from "react";
import { StyleSheet } from "react-native";
import { Card, Button, IconButton, Title, Paragraph } from "react-native-paper";
import { theme } from "../../assets/theme";

export default function RecipeCard({ recipe, onViewRecipe, onLikeRecipe }) {
  return (
    <Card style={styles.container}>
      <Card.Cover
        source={
          recipe.image
            ? { uri: recipe.image }
            : require("../../assets/burger.jpeg")
        }
        resizeMode="cover"
        style={styles.image}
      />
      <Card.Content>
        <Title style={styles.title}>{recipe.name}</Title>
        <Paragraph>{recipe.description}</Paragraph>
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
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: 800,
    minWidth: 350,
    alignContent: "center",
    alignSelf: "center",

    Width: "100%",
  },
  image: {
    resizeMode: "contain",
    Width: "100%",
    maxHeight: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
