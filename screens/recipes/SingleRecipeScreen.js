import React, { useRef, useEffect, useState, useReducer } from "react";
import { ScrollView, View, Animated, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeAreaView from "react-native-safe-area-view";
import AnimatedHeaderWithImage from "../../components/universal/AnimatedHeaderWithImage";
import { Button, Text, ActivityIndicator, Divider } from "react-native-paper";
import Markdown from "react-native-markdown-display";

import { useRestApi } from "../../providers/RestApiProvider";
import { getComments } from "../../providers/ReactQueryProvider";

import CommentList from "../../components/recipes/CommentList";
import Title from "../../components/universal/Title";
import Header from "../../components/universal/Header";
import BackButton from "../../components/universal/BackButton";

import RecipeIngredients from "../../components/recipes/RecipeIngredients";
import { theme } from "../../assets/theme";
import SectionHeader from "../../components/recipes/SectionHeader";

const HEADER_HEIGHT = 400;

export default function NewSingleRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;
  const offset = useRef(new Animated.Value(0)).current;

  // const { name, description } = recipe;
  const {
    addRecipePhotos,
    getMarkdown,
    updateMarkdown,
    username,
    postAddComment,
    getRecipeById,
    recipeLike,
  } = useRestApi();

  const [componentsOnEdit, editReducer] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "title":
          return { ...state, title: !state.title };
        case "ingredients":
          return { ...state, ingredients: !state.ingredients };
        default:
          return state;
      }
    },
    {
      title: false,
      ingredients: false,
      instruction: false,
    },
  );
  const [recipeState, recipeReducer] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setDetails":
          return {
            ...state,
            ingredients: action.ingredients,
            imagePaths: action.imagePaths,
          };
        case "setMarkdown":
          return { ...state, markdown: action.markdown };
        case "setDetails":
          return { ...state, details: action.payload };
        case "setTitle":
          return { ...state, title: action.payload };
        case "setIngredients":
      }
    },
    {
      authorized: recipe.author === username,
      id: recipe.id,
      name: recipe.name,
      author: recipe.author,
      title: recipe.title,
      markdownPath: recipe.markdownPath,
      description: recipe.description,
      isLiked: false,
      titleImage: recipe.titleImage
        ? recipe.titleImage
        : "https://strefainwestorow.pl/sites/default/files/styles/bootstrap_thumbnail_image/public/Software%20Mansion_3.jpg?itok=X1PXpOpv",
    },
  );

  const {
    data: commentPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = getComments(recipe.id, 10);

  const comments = commentPages?.pages.flat() ?? [];

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const recipeDetails = await getRecipeById(recipe.id);
        console.log("recipeDetails: ", recipeDetails);
        recipeReducer({
          type: "setDetails",
          ingredients: recipeDetails.ingredients,
          imagePaths: recipeDetails.imagePaths,
        });
      } catch (error) {
        console.error("Error fetching recipe details: ", error);
      }
    };

    fetchRecipeDetails();

    const fetchMarkdown = async () => {
      try {
        const markdown = await getMarkdown(recipe.markdownPath);
        recipeReducer({ type: "setMarkdown", markdown: markdown });
      } catch (error) {
        console.error("Error fetching markdown: ", error);
      }
    };

    fetchMarkdown();
  }, [recipe.id, getMarkdown]);

  const likeButtonAction = async () => {
    console.log("likeButtonAction");
    // await recipeLike(recipe.id);
  };

  actions = recipeState.authorized
    ? {
        title: () => editReducer({ type: "title" }),
        description: () => editReducer({ type: "description" }),
        ingredients: () => editReducer({ type: "ingredients" }),
        instruction: () => editReducer({ type: "instruction" }),
      }
    : {
        like: likeButtonAction,
      };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <BackButton goBack={navigation.goBack} />
        <AnimatedHeaderWithImage
          animatedValue={offset}
          imageUri={recipeState.titleImage}
          title={recipeState.name}
          state={{ isAuthor: recipeState.authorized, isLiked: recipe.isLiked }}
          action={recipeState.authorized ? actions.title : actions.like}
        />
        <ScrollView
          style={{
            flex: 1,
            paddingTop: 20,
          }}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: offset } } }],
            { useNativeDriver: false },
          )}
        >
          <View style={styles.container}>
            <View style={styles.square}>
              <SectionHeader
                title="Description"
                editAction={actions.description}
              />
              <Text style={styles.description}>{recipeState.description}</Text>
            </View>
            <View style={styles.square}>
              <SectionHeader
                title="Ingredients"
                editAction={actions.ingredients}
              />
              {recipeState.ingredients ? (
                <RecipeIngredients ingredientsList={recipeState.ingredients} />
              ) : (
                <ActivityIndicator />
              )}
            </View>
            <View style={styles.markdown}>
              <SectionHeader
                title="Instructions"
                editAction={actions.instruction}
              />
              {recipeState.markdown ? (
                <Markdown>{recipeState.markdown}</Markdown>
              ) : (
                <ActivityIndicator />
              )}
            </View>
            <View style={styles.commentSection}>
              <CommentList comments={comments} />
              {isFetchingNextPage && <ActivityIndicator />}
              {hasNextPage && (
                <Button onPress={fetchNextPage} mode="contained">
                  Load more comments
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingBottom: 20,
    marginBottom: 20,
  },
  scrollViewContent: {
    paddingTop: HEADER_HEIGHT + 50,
    alignItems: "center",
  },
  commentSection: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  square: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 5,
    // alignItems: "center",
    alignSelf: "center",
    // backgroundColor: "grey",
    // borderRadius: 5,

    // borderWidth: 1,
    marginVertical: 20,
  },
  markdown: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 5,
    // alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white", // change to better color
    borderRadius: 10,
    borderColor: theme.colors.primary,
    borderWidth: 3,
    marginVertical: 20,
  },

  description: {
    fontSize: 16,
  },
});
