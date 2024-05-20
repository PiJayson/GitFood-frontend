import RecipesSearchScreen from "./RecipesSearchScreen";
import SingleRecipeScreen from "./SingleRecipeScreen";
import { createStackNavigator } from "@react-navigation/stack";

const FridgesStack = createStackNavigator();

export default function RecipesScreen({ navigation }) {
  return (
    <FridgesStack.Navigator screenOptions={{ headerShown: true }}>
      <FridgesStack.Screen
        name="BrowseRecipes"
        component={RecipesSearchScreen}
      />
      <FridgesStack.Screen name="Recipe" component={SingleRecipeScreen} />
    </FridgesStack.Navigator>
  );
}
