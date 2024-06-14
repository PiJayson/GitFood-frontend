import React, { useDeferredValue } from "react";
import { View, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import RecipeList from "../../components/recipes/RecipeList";
import IngredientsInSearch from "../../components/recipes/IngredientsInSearch";
import { getRecipes } from "../../providers/ReactQueryProvider";
import NewIngredientInSearchForm from "../../components/recipes/NewCategoryInSearchForm";
import OutsidePressHandler, { EventProvider } from "react-native-outside-press";
import { useNavigation } from "@react-navigation/native";
import AddRecipeForm from "../../components/recipes/AddRecipeForm";
import { useRestApi } from "../../providers/RestApiProvider";

export default function RecipesSearchScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [formVisible, setFormVisible] = React.useState(false);
  const [recipeFormVisible, setRecipeFormVisible] = React.useState(false);

  const { createRecipe, getRecipeDetails, likeRecipe, unlikeRecipe } = useRestApi();

  const [active, setActive] = React.useState(false);
  const searchValue = useDeferredValue(search, { timeoutMs: 3000 });
  // const { data } = getFoodSuggestion({
  //   search: searchValue,
  //   count: 10,
  // });
  //
  data = [
    { name: "pierogi", type: "class" },
    { name: "pierogi ruskie jak u mamy", type: "recipe" },
    { name: "pierogi ruskie jak u babci", type: "recipe" },
    { name: "pierniczki", type: "class" },
    { name: "piernik-ciasto", type: "class" },
    { name: "piernik świąteczny", type: "recipe" },
    { name: "pierniczki z miodem", type: "recipe" },
  ];

  const [ingredientsQuery, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case "add":
        if (
          state.find((ingredient) => ingredient.id === action.ingredient.id)
        ) {
          return state;
        }
        return [...state, action.ingredient];
      case "remove":
        return state.filter((ingredient) => ingredient.id !== action.category);
      default:
        return state;
    }
  }, []);

  const addNewIngredient = () => {
    setFormVisible(true);
  };

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

  const query = {
    search: searchQuery,
    ingredients: ingredientsQuery,
    pageSize: 10,
  };

  const dataSource = getRecipes(query);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => {
            setActive(true);
            setSearch(query);
          }}
          onIconPress={() => {
            setActive(false);
            setSearchQuery(search);
          }}
          onClearIconPress={() => {
            console.log("clear");
            setActive(false);
            setSearch("");
            setSearchQuery("");
          }}
          value={searchValue}
          style={styles.searchbar}
        />
      </View>
      <View style={styles.content}>
        <EventProvider>
          {active && (
            <View style={styles.searchResults}>
              <OutsidePressHandler
                onOutsidePress={() => {
                  setActive(false);
                  setSearchQuery(search);
                  console.log("outside");
                }}
              >
                <FlatList
                  data={data}
                  ListHeaderComponent={<View style={{ height: 10 }} />}
                  renderItem={({ item }) => (
                    <Button
                      onPress={() => {
                        setActive(false);
                        setSearch(item.name);
                        setSearchQuery(item.name);
                      }}
                      mode={item.type === "recipe" ? "contained" : "outlined"}
                    >
                      {item.name}
                    </Button>
                  )}
                  keyExtractor={(item) => item.name}
                />
              </OutsidePressHandler>
            </View>
          )}

          <IngredientsInSearch
            state={ingredientsQuery}
            dispatch={dispatch}
            addNewIngredient={addNewIngredient}
          />
          <Button onPress={addNewRecipe} mode="contained" style={styles.addRecipeButton}>
            Add Recipe
          </Button>
          <View style={styles.results}>
            <RecipeList
              dataSource={dataSource}
              onLikeRecipe={handleLikeRecipe}
              onViewRecipe={(recipe) =>
                navigation.navigate("Recipe", { recipe })
              }
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
  searchResults: {
    top: -10,
    alignSelf: "center",
    maxHeight: 500,
    height: 300,
    width: "90%",
    maxWidth: 650,
    position: "absolute",
    backgroundColor: "white",
    zIndex: 100,
    borderEndEndRadius: 10,
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

