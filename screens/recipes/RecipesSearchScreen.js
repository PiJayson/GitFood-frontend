import React from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import RecipeList from "../../components/recipes/RecipeList";
import IngredientsInSearch from "../../components/recipes/IngredientsInSearch";

import { getRecipes } from "../../providers/ReactQuerryProvider";

export default function RecipesSearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [ingredientsQuery, dispatcher] = React.useReducer((state, action) => {
    switch (action.type) {
      case "add":
        return [...state, action.ingredient];
      case "remove":
        return state.filter((ingredient) => ingredient !== action.ingredient);
      default:
        return state;
    }
  }, []);

  const query = {
    search: searchQuery,
    ingredients: ingredientsQuery,
    pageSize: 10,
  };

  const dataSource = getRecipes(query);

  return (
    <View style={styles.container}>
      <View style={styles.query}>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
        />
        <IngredientsInSearch state={ingredientsQuery} dispatch={dispatcher} />
      </View>
      <View style={styles.results}>
        <RecipeList
          dataSource={dataSource}
          onLikeRecipe={(recipe) => console.log("like", recipe)}
          onViewRecipe={(recipe) => navigation.navigate("Recipe", { recipe })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: "100%",
    margin: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  query: {
    width: "100%",
    marginBottom: 10,
    flex: 1,
  },
  results: {
    flex: 3,
    width: "100%",
  },
});
