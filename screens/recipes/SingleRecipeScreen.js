import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Header from "../../components/universal/Header";
import BackButton from "../../components/universal/BackButton";

export default function SingleRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;
  const { name, description } = recipe;
  return (
    <View style={styles.container}>
      <BackButton goBack={navigation.goBack} />
      <Header>{name}</Header>
      <Text>{description}</Text>
      {/* <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      <Text>Ingredients</Text>
      <Text>{ingredients.join(", ")}</Text> */}
      {/* <Text>Instructions</Text>
      <Text>{instructions}</Text> */}
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
