import { View, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

export default function FridgesInSearch({
  state,
  dispatch,
  addNewFridge,
}) {
  console.log("FridgessInSearch", state);

  return (
    <View style={styles.container}>
      {state.map((fridge) => (
        <Chip
          key={fridge.id}
          onClose={() => dispatch({ type: "remove", fridge })}
          style={styles.chip}
        >
          {fridge.name}
        </Chip>
      ))}
      <Chip icon={"plus"} onPress={addNewFridge} style={styles.chip}>
        Add Fridge
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
