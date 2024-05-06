import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Button from "../../components/universal/Button";
import ProductList from "../../components/product_list/ProductList";
import { theme } from "../../assets/theme";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncShoppingStore, useShoppingStore } from "./ShoppingStore";
import {
  ShoppingProductView,
  EditedShoppingProductView,
} from "../../components/shopping/ShoppingProductView";
import ExpandableShoppingList from "../../components/shopping/ExpandableShoppingList";
import NewListForm from "../../components/shopping/NewListForm";

const windowDimensions = Dimensions.get("window");

const ShoppingScreen = ({ navigation }) => {
  const { updateShoppingListQuantity } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ window: windowDimensions });
  const [shoppingStarted, setShoppingStarted] = useState(false);

  const finishedShopping = () => {
    // Placeholder for your finishedShopping logic
    console.log("Shopping finished");
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  });

  return (
    <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
      <ExpandableShoppingList
        syncStore={syncShoppingStore}
        addNewItemForm={() => setFormVisible(true)}
      />
      <ProductList
        syncStore={syncShoppingStore}
        normalProductView={ShoppingProductView}
        editProductView={EditedShoppingProductView}
        updateProductQuantity={updateShoppingListQuantity}
      />
      <NewListForm
        visible={formVisible}
        onSubmit={syncShoppingStore.createShoppingList}
        onClose={() => setFormVisible(false)}
      />
      {!shoppingStarted ? (
        <Button title="Start Shopping" mode="outlined" onPress={() => setShoppingStarted(true)}>
          Start Shopping
        </Button>
      ) : (
        <>
          <Button title="Stop Shopping" mode="outlined" onPress={() => {
            setShoppingStarted(false);
            finishedShopping();
          }}>
            Stop Shopping
          </Button>
          <Button
            title="Open Scanner"
            mode="outlined"
            onPress={() => navigation.navigate("ShoppingScanner")}
          >
            Open Scanner
          </Button>
        </>
      )}
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

export default ShoppingScreen;
