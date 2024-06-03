import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { IconButton, Text } from "react-native-paper";
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
    ? recipe.titleImage
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
          <IconButton
            icon={"arrow-right-circle"}
            onPress={() => onViewRecipe(recipe)}
          />
          <IconButton icon={"heart"} onPress={() => onLikeRecipe(recipe)} />
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
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  titleContainer: {
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
