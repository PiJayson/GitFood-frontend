import React from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import RecipeList from "../../components/recipes/RecipeList";
import IngredientsInSearch from "../../components/recipes/IngredientsInSearch";

import { getRecipes } from "../../providers/ReactQueryProvider";
import NewCategoryInSearchForm from "../../components/recipes/NewCategoryInSearchForm";

export default function RecipesSearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [formVisible, setFormVisible] = React.useState(false);

  const [categoriesQuery, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case "add":
        return [...state, action.category];
      case "remove":
        return state.filter((category) => category !== action.category);
      default:
        return state;
    }
  }, []);

  const addNewCategory = () => {
    setFormVisible(true);
  };

  const query = {
    search: searchQuery,
    ingredients: categoriesQuery,
    pageSize: 10,
  };

  const dataSource = getRecipes(query);

  return (
    <View style={styles.container}>
      <View style={styles.query}>
        <Searchbar
          placeholder="Search"
          // onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
        />
        <IngredientsInSearch
          state={categoriesQuery}
          dispatch={dispatch}
          addNewCategory={addNewCategory}
        />
      </View>
      <View style={styles.results}>
        <RecipeList
          dataSource={dataSource}
          onLikeRecipe={(recipe) => console.log("like", recipe)}
          onViewRecipe={(recipe) =>
            navigation.navigate("Recipe", { recipe: recipe })
          }
        />
      </View>

      <NewCategoryInSearchForm
        visible={formVisible}
        onSubmit={(ingredient) => dispatch({ type: "add", ingredient })}
      />
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
