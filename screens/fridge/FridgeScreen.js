import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/universal/Button";

import ProductList from "../../components/product_list/ProductList";
import { Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { theme } from "../../assets/theme";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncFridgeStore, useFridgesStore } from "./FridgeStore";
import {
  FridgeProductView,
  EditedFridgeProductView,
} from "../../components/fridge/FridgeProductView";
import ExpandableFridgeList from "../../components/fridge/ExpandableFridgeList";
import NewListForm from "../../components/fridge/NewListForm";

const windowDimensions = Dimensions.get("window");
// const screenDimensions = Dimensions.get("screen");

const FridgeScreen = ({ navigation }) => {
  const { updateProductQuantity } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
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

  console.log("fasdfdas", useFridgesStore().products);

  return (
    <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
      <ExpandableFridgeList
        syncStore={syncFridgeStore}
        addNewItemForm={() => setFormVisible(true)}
      />
      <ProductList
        syncStore={syncFridgeStore}
        normalProductView={FridgeProductView}
        editProductView={EditedFridgeProductView}
        updateProductQuantity={updateProductQuantity}
      />
      <Button
        title="Open Scanner"
        mode="outlined"
        onPress={() => navigation.navigate("FridgeScanner")}
      >
        Open Scanner
      </Button>
      <NewListForm
        visible={formVisible}
        onSubmit={syncFridgeStore.createFridge}
        onClose={() => setFormVisible(false)}
      />
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
