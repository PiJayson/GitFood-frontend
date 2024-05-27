import React from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import RecipeList from "../../components/recipes/RecipeList";
import IngredientsInSearch from "../../components/recipes/IngredientsInSearch";

import { getRecipes } from "../../providers/ReactQueryProvider";
import NewIngredientInSearchForm from "../../components/recipes/NewCategoryInSearchForm";

export default function RecipesSearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [formVisible, setFormVisible] = React.useState(false);

  const [categoriesQuery, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case "add":
        if (state.find((category) => category.id === action.category.id)) {
          return state;
        }
        return [...state, action.category];
      case "remove":
        return state.filter((category) => category.id !== action.category.id);
      default:
        return state;
    }
  }, []);

  const addNewIngreident = () => {
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
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          style={{ width: "100%", maxWidth: 700, alignSelf: "center" }}
        />
        <IngredientsInSearch
          state={categoriesQuery}
          dispatch={dispatch}
          addNewIngredient={addNewIngreident}
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

      <NewIngredientInSearchForm
        visible={formVisible}
        onSubmit={(ingredient) =>
          dispatch({ type: "add", category: ingredient })
        }
        onClose={() => {
          setFormVisible(false);
        }}
        selected={categoriesQuery.map((category) => category.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 15,
    width: "100%",
    // margin: 12,
    height: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  query: {
    width: "100%",
    marginBottom: 2,
    marginTop: 2,
    flexDirection: "column",
    // alignItems: "center",
    // zIndex: 1,
  },
  results: {
    flex: 1,
    width: "100%",
    // flexGrow: 1,
    // height: "100%",
    // width: "100%",
  },
});
