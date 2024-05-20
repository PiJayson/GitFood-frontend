import { RefreshControlComponent, View } from "react-native";
import { Chip } from "react-native-paper";

export default function IngredientsInSearch({ state, dispatch }) {
  return (
    <View>
      {state.map((ingredient) => (
        <Chip
          key={ingredient}
          onClose={() => dispatch({ type: "remove", ingredient })}
        >
          {ingredient}
        </Chip>
      ))}
      <Chip icon={"plus"} onPress={() => console.log("add new ingredient")}>
        Add Ingredient
      </Chip>
    </View>
  );
}
