import { View, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

export default function IngredientsInSearch({
  state,
  dispatch,
  addNewIngredient,
}) {
  console.log("IngredientsInSearch", state);

  return (
    <View style={styles.container}>
      {state.map((ingredient) => (
        <Chip
          key={ingredient.id}
          onClose={() => dispatch({ type: "remove", category: ingredient.id })}
          style={styles.chip}
        >
          {ingredient.name}
        </Chip>
      ))}
      <Chip icon={"plus"} onPress={addNewIngredient} style={styles.chip}>
        Add Ingredient
      </Chip>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    margin: 2,
  },
});
