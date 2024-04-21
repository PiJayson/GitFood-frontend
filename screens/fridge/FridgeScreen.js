import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/universal/Button";
import Paragraph from "../../components/universal/Paragraph";
import { AuthContext } from "../../utils/contexts/AuthContext";
// import ProductList from "../../components/product_list/ProductList";
import ProductList from "../../components/product_list/ProductList";
import { Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { theme } from "../../core/theme";

const windowDimensions = Dimensions.get("window");
// const screenDimensions = Dimensions.get("screen");

// TODO: plan what is supposed to be on the home screen
const FridgeScreen = ({ navigation }) => {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });

  const products = [
    {
      name: "Milk",
      count: 1,
      barcode: null,
    },
    {
      name: "Eggs",
      count: 12,
      barcode: null,
    },
    {
      name: "Bread",
      count: 1,
      barcode: null,
    },
    {
      name: "Butter",
      count: 1,
      barcode: null,
    },
    {
      name: "Cheese",
      count: 1,
      barcode: null,
    },
    {
      name: "Yogurt",
      count: 1,
      barcode: null,
    },
    {
      name: "Apples",
      count: 3,
      barcode: null,
    },
    {
      name: "Oranges",
      count: 2,
      barcode: null,
    },
    {
      name: "Bananas",
      count: 4,
      barcode: null,
    },
    {
      name: "Grapes",
      count: 1,
      barcode: null,
    },
    {
      name: "Strawberrie sssssssssssssssssssssssssssss ssssssssssssss",
      count: 1,
      barcode: null,
    },
  ];

  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
      <ProductList products={products} ListName={"kldsaj"} />
      <Button
        mode="outlined"
        onPress={async () => {
          await signOut(); // disabling when clicked?
        }}
      >
        log out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.surface,
  },
});

export default FridgeScreen;
