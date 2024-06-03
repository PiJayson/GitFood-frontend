import React, { useRef, useEffect, useState, useReducer } from "react";
import { ScrollView, View, Animated, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeAreaView from "react-native-safe-area-view";
import AnimatedHeaderWithImage from "../../components/universal/AnimatedHeaderWithImage";
import AnimatedHeaderEditable from "../../components/universal/AnimatedHeaderEditable";
import * as ImagePicker from "expo-image-picker";
import {
  Button,
  Text,
  TextInput,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import Markdown from "react-native-markdown-display";

import { useRestApi } from "../../providers/RestApiProvider";
import { getComments } from "../../providers/ReactQueryProvider";

import AddComment from "../../components/recipes/AddComment";
import CommentList from "../../components/recipes/CommentList";
import Title from "../../components/universal/Title";
import Header from "../../components/universal/Header";
import BackButton from "../../components/universal/BackButton";

import RecipeIngredients from "../../components/recipes/RecipeIngredients";
import { theme } from "../../assets/theme";
import SectionHeader from "../../components/recipes/SectionHeader";
import RecipeIngredientsEdit from "../../components/recipes/RecipeIngredientsEdit";

const HEADER_HEIGHT = 400;

export default function NewSingleRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;
  const offset = useRef(new Animated.Value(0)).current;

  const [lastUpdated, setLastUpdated] = useState(new Date().getTime());

  // const { name, description } = recipe;
  const {
    addRecipePhotos,
    getMarkdown,
    username,
    postAddComment,
    getRecipeDetails,
    recipeLike,
    updateRecipeName,
    updateRecipeDescription,
    updateRecipeIngredient,
    updateMarkdown,
    addRecipeMainPhoto,
  } = useRestApi();

  const [editState, editReducer] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "header":
          return { ...state, header: !state.header };
        case "description":
          return { ...state, description: !state.description };
        case "ingredients":
          return { ...state, ingredients: !state.ingredients };
        case "markdown":
          return { ...state, markdown: !state.markdown };
        default:
          return state;
      }
    },
    {
      header: false,
      description: false,
      ingredients: false,
      markdown: false,
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
            name: action.name,
            description: action.description,
          };
        case "setMarkdown":
          return { ...state, markdown: action.markdown };
        case "setDetails":
          return { ...state, details: action.payload };
        case "setTitle":
          return { ...state, name: action.newTitle };
        case "setIngredients":
          return { ...state, ingredients: action.newIngredients };
        case "setDescription":
          return { ...state, description: action.newDescription };
        default:
          return state;
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
        ? "https://gitfood.fun:5255/" + recipe.titleImage
        : "https://gitfood.fun:5254/recipe_files/default_logo.png",
    },
  );

  const {
    data: commentPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = getComments(recipe.id, 10);

  const comments = commentPages?.pages.flat() ?? [];

  useEffect(() => {
    console.log("reload");
    const fetchRecipeDetails = async () => {
      try {
        const recipeDetails = await getRecipeDetails(recipe.id);
        console.log("recipeDetails: ", recipeDetails);
        recipeReducer({
          type: "setDetails",
          ingredients: recipeDetails.ingredients,
          imagePaths: recipeDetails.imagePaths,
          name: recipeDetails.name,
          description: recipeDetails.description,
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
  }, [lastUpdated]);

  const likeButtonAction = async () => {
    console.log("likeButtonAction");
    // await recipeLike(recipe.id);
  };

  actions = recipeState.authorized
    ? {
        title: async () => {
          if (editState.header) {
            const response = await updateRecipeName(
              recipe.id,
              recipeState.name,
            );
            console.log("response: ", response);
          }
          editReducer({ type: "header" });
          setLastUpdated(new Date().getTime());
        },
        description: async () => {
          if (editState.description) {
            const response = await updateRecipeDescription(
              recipe.id,
              recipeState.description,
            );
            console.log("response: ", response);
          }
          editReducer({ type: "description" });
          setLastUpdated(new Date().getTime());
        },
        ingredients: () => editReducer({ type: "ingredients" }),
        markdown: async () => {
          if (editState.markdown) {
            const response = await updateMarkdown(
              recipeState.id,
              recipeState.markdown,
            );
            console.log("response: ", response);
          }
          editReducer({ type: "markdown" });
          setLastUpdated(new Date().getTime());
        },
      }
    : {
        like: likeButtonAction,
      };

  const handleAddComment = async (comment) => {
    const newComment = { username, comment };
    await postAddComment(recipe.id, comment);
    // setLastUpdated(new Date().getTime());
    refetchComments();
  };

  const handleAddMainPhotoAction = async () => {
    console.log("Add photo");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    });

    console.log(result);

    if (!result.canceled) {
      addRecipePhotos(recipe.id, result);
    }
  };

  const animatedHeader = recipeState.authorized ? (
    editState.header ? (
      <AnimatedHeaderEditable
        animatedValue={offset}
        imageUri={recipeState.titleImage}
        title={recipeState.name}
        updateTitle={(title) => {
          console.log("title: ", title);
          recipeReducer({ type: "setTitle", newTitle: title });
        }}
        onAddPhoto={handleAddMainPhotoAction}
        action={actions.title}
      />
    ) : (
      <AnimatedHeaderWithImage
        animatedValue={offset}
        imageUri={recipeState.titleImage}
        title={recipeState.name}
        state={{ isAuthor: true }}
        action={actions.title}
      />
    )
  ) : (
    <AnimatedHeaderWithImage
      animatedValue={offset}
      imageUri={recipeState.titleImage}
      title={recipeState.name}
      state={{ isLiked: recipe.isLiked }}
      action={actions.like}
    />
  );

  const ingredients = editState.ingredients ? (
    <View style={styles.square}>
      <SectionHeader title="Ingredients" editAction={actions.ingredients} />
      {recipeState.ingredients ? (
        <RecipeIngredientsEdit ingredientsList={recipeState.ingredients} />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  ) : (
    <View style={styles.square}>
      <SectionHeader title="Ingredients" editAction={actions.ingredients} />
      {recipeState.ingredients ? (
        <RecipeIngredients ingredientsList={recipeState.ingredients} />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );

  const description = editState.description ? (
    <View style={styles.square}>
      <SectionHeader title="Description" editAction={actions.description} />
      <TextInput
        style={styles.description}
        value={recipeState.description}
        onChangeText={(text) =>
          recipeReducer({ type: "setDescription", newDescription: text })
        }
      />
    </View>
  ) : (
    <View style={styles.square}>
      <SectionHeader title="Description" editAction={actions.description} />
      <Text style={styles.description}>{recipeState.description}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <BackButton goBack={navigation.goBack} />
        {animatedHeader}
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
            {description}
            {ingredients}
            <View style={styles.markdown}>
              <SectionHeader
                title="Instructions"
                editAction={actions.markdown}
              />
              {recipeState.markdown ? (
                editState.markdown ? (
                  <View style={styles.editorContainer}>
                    <TextInput
                      style={styles.textInput}
                      multiline
                      value={recipeState.markdown}
                      onChangeText={(text) => {
                        recipeReducer({ type: "setMarkdown", markdown: text });
                        console.log(recipeState.markdown);
                      }}
                    />
                  </View>
                ) : (
                  <Markdown>{recipeState.markdown}</Markdown>
                )
              ) : (
                <ActivityIndicator />
              )}
            </View>
            <View style={styles.commentSection}>
              <AddComment onAddComment={handleAddComment} />
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
