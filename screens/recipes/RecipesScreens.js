import NewSingleRecipeScreen from "./NewSingleRecipeScreen";
import RecipesSearchScreen from "./RecipesSearchScreen";
import SingleRecipeScreen from "./SingleRecipeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const FridgesStack = createNativeStackNavigator();

export default function RecipesScreen({ navigation }) {
  return (
    <FridgesStack.Navigator screenOptions={{ headerShown: false }}>
      <FridgesStack.Screen
        name="BrowseRecipes"
        component={RecipesSearchScreen}
      />
      <FridgesStack.Screen name="Recipe" component={SingleRecipeScreen} />
    </FridgesStack.Navigator>
  );
}
