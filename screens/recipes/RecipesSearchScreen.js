import React, { useEffect, useState, useReducer, useDeferredValue } from "react";
import { View, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import RecipeList from "../../components/recipes/RecipeList";
import IngredientsInSearch from "../../components/recipes/IngredientsInSearch";
import { getRecipes } from "../../providers/ReactQueryProvider";
import NewIngredientInSearchForm from "../../components/recipes/NewIngredientInSearchForm";
import OutsidePressHandler, { EventProvider } from "react-native-outside-press";
import { useNavigation } from "@react-navigation/native";
import AddRecipeForm from "../../components/recipes/AddRecipeForm";
import { useRestApi } from "../../providers/RestApiProvider";
import FridgesInSearchForm from "../../components/recipes/FridgesInSearchForm";
import FridgesInSearch from "../../components/recipes/FridgesInSearch";

export default function RecipesSearchScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [formVisible, setFormVisible] = React.useState(false);
  const [fridgeFormVisible, setFridgeFormVisible] = React.useState(false);
  const [recipeFormVisible, setRecipeFormVisible] = React.useState(false);

  const { createRecipe, getRecipeDetails, likeRecipe, unlikeRecipe } = useRestApi();

  const [active, setActive] = React.useState(false);
  const [ingredientsQuery, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add":
        if (state.find((ingredient) => ingredient.id === action.ingredient.id)) {
          return state;
        }
        return [...state, action.ingredient];
      case "remove":
        return state.filter((ingredient) => ingredient.id !== action.category);
      default:
        return state;
    }
  }, []);

  const [fridgesQuery, fridgesDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add":
        if (state.find((fridge) => {fridge.id === action.fridge.id})) {
          return state;
        }
        return [...state, action.fridge];
      case "remove":
        return state.filter((fridge) => fridge.id !== action.fridge.id);
      default:
        return state;
    }
  }, []);
  
  const [recipes, setRecipes] = useState([]);

  const query = {
    search: searchQuery,
    ingredients: ingredientsQuery,
    fridges: fridgesQuery,
    pageSize: 10,
  };

  const dataSource = getRecipes(query);

  useEffect(() => {
    console.log("refetching", searchQuery, ingredientsQuery, fridgesQuery)
    const fetchRecipes = async () => {
      const result = await dataSource.refetch();  // Ensure you refetch data
      setRecipes(result.data);
    };
    fetchRecipes();
  }, [searchQuery, ingredientsQuery, fridgesQuery]);


  const addNewRecipe = () => {
    setRecipeFormVisible(true);
  };

  const handleAddRecipe = async (recipeName) => {
    const recipeId = await createRecipe(recipeName, "", "", [], []);
    const recipe = await getRecipeDetails(recipeId);

    setRecipeFormVisible(false);
    navigation.navigate("Recipe", { recipe })
  }

  const handleLikeRecipe = async (recipe) => {
    if (recipe.isLiked) {
      await unlikeRecipe(recipe.id);
    } else {
      await likeRecipe(recipe.id);
    }

    dataSource.refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => {
            setActive(true);
            setSearch(query);
            setSearchQuery(query);
          }}
          onIconPress={() => {
            setSearchQuery(search);
          }}
          onClearIconPress={() => {
            setActive(false);
            setSearch("");
            setSearchQuery("");
          }}
          value={search}
          style={styles.searchbar}
        />
      </View>
      <View style={styles.content}>
        <EventProvider>
          <IngredientsInSearch
            state={ingredientsQuery}
            dispatch={dispatch}
            addNewIngredient={() => setFormVisible(true)}
          />
          <FridgesInSearch
            state={fridgesQuery}
            dispatch={fridgesDispatch}
            addNewFridge={() => setFridgeFormVisible(true)}
          />
          <Button onPress={addNewRecipe} mode="contained" style={styles.addRecipeButton}>
            Add Recipe
          </Button>
          <View style={styles.results}>
            <RecipeList
              dataSource={dataSource}
              onLikeRecipe={handleLikeRecipe}
              onViewRecipe={(recipe) => navigation.navigate("Recipe", { recipe })}
            />
          </View>
        </EventProvider>
      </View>

      <NewIngredientInSearchForm
        visible={formVisible}
        onSubmit={(ingredient) => dispatch({ type: "add", ingredient })}
        onClose={() => setFormVisible(false)}
        selected={ingredientsQuery.map((ingredient) => ingredient.id)}
      />

      <FridgesInSearchForm
        visible={fridgeFormVisible}
        onSubmit={(fridge) => fridgesDispatch({ type: "add", fridge })}
        onClose={() => setFridgeFormVisible(false)}
        selected={fridgesQuery.map((fridge) => fridge.id)}
      />

      <AddRecipeForm
        visible={recipeFormVisible}
        onSubmit={handleAddRecipe}
        onClose={() => setRecipeFormVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    zIndex: 300,
  },
  searchbar: {
    width: "90%",
    maxWidth: 700,
    alignSelf: "center",
    marginTop: 10,
    zIndex: 200,
  },
  content: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
  },
  addRecipeButton: {
    width: "90%",
    maxWidth: 300,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  results: {
    flex: 1,
    width: "100%",
    marginTop: 10,
  },
});
