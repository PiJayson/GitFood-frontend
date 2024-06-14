import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { IconButton, Text  } from "react-native-paper";
import Title from "../../components/universal/Title";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../../assets/theme";

import defaultRecipImage from "../../assets/burger.jpeg";

export default function RecipeCard({
  index,
  recipe,
  onViewRecipe,
  onLikeRecipe,
}) {
  const mainImage = recipe.titleImage
    ? "https://gitfood.fun:5255/" + recipe.titleImage
    : "https://gitfood.fun:5254/recipe_files/default_logo.png";

  return (
    <Animated.View
      entering={FadeInDown.delay(200 * index)}
      style={styles.container}
    >
      <Animated.Image
        sharedTransitionTag={`image-${recipe.id}`}
        source={{ uri: mainImage }}
        style={styles.image}
      />
      <View style={styles.titleContainer}>
        <Title>{recipe.name}</Title>
      </View>
      <View style={styles.actions}>
        <Text>{recipe.description}</Text>
        <View style={styles.buttons}>
          <View style={styles.likesContainer}>
            <IconButton
              icon="heart"
              iconColor={recipe.isLiked ? theme.colors.primary : theme.colors.accent}
              onPress={() => onLikeRecipe(recipe)}
            />
            <Text>{recipe.numberOfLikes}</Text>
          </View>
          <IconButton
            icon="arrow-right-circle"
            onPress={() => onViewRecipe(recipe)}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  image: {
    height: 200,
  },
  titleContainer: {
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
