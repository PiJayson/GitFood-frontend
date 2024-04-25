import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/universal/Button";

// import ProductList from "../../components/product_list/ProductList";
import ProductList from "../../components/product_list/ProductList";
import { Dimensions } from "react-native";
import BackButton from "../../components/universal/BackButton";
import { useState, useEffect } from "react";
import { theme } from "../../core/theme";
import { useProductStore } from "./ProductStore";

const windowDimensions = Dimensions.get("window");
// const screenDimensions = Dimensions.get("screen");

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

  return (
    <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
      <BackButton goBack={() => navigation.navigate("Home")} />
      <ProductList store={useProductStore} />
      <Button
        title="Open Scanner"
        onPress={() => navigation.navigate("FridgeScanner")}
      >
        Open Scanner
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
