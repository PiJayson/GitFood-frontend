import { View, StyleSheet } from "react-native";
import Header from "../../components/universal/Header";

export default function SingleRecipeScreen({ recipe }) {
  const { title, image, ingredients, instructions } = recipe;
  return (
    <View style={styles.container}>
      <Header>{title}</Header>
      <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      <Text>Ingredients</Text>
      <Text>{ingredients.join(", ")}</Text>
      <Text>Instructions</Text>
      <Text>{instructions}</Text>
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
});
