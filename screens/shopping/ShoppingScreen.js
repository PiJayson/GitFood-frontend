import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Button from "../../components/universal/Button";
import { theme } from "../../assets/theme";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncShoppingStore } from "./ShoppingStore";
import { syncFridgeStore } from "../fridge/FridgeStore";
import ExpandableShoppingList from "../../components/shopping/ExpandableShoppingList";
import NewListForm from "../../components/shopping/NewListForm";
import CategoryList from "../../components/category_list/CategoryList";
import CategoryComponent from "../../components/shopping/CategoryComponent";
import ProductComponent from "../../components/shopping/ProductComponent";
import FinishTransactionForm from "../../components/shopping/FinishTransactionForm";

const windowDimensions = Dimensions.get("window");

const ShoppingScreen = ({ navigation }) => {
  const { updateShoppingListQuantity, patchFridgeAddProducts, getFridges } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
  const [showFridgeSelector, setShowFridgeSelector] = useState(false);
  const [dimensions, setDimensions] = useState({ window: windowDimensions });
  const [shoppingStarted, setShoppingStarted] = useState(false);

  const elements = syncShoppingStore.elements();
  const currentStoreId = syncShoppingStore.currentStoreId();

  const finishedShopping = () => {
    console.log("Shopping finished");

    setShowFridgeSelector(true);
  };

  const handleFridgeSelect = async (fridge) => {
    const products = elements.flatMap(category => category.products).map(product => ({
      productId: product.productId,
      quantity: product.quantity
    }));
    
    console.log(products, fridge);
    if (products.length > 0) {
      await patchFridgeAddProducts(products, fridge.id);
    }

    setShowFridgeSelector(false);
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

  const renderProduct = ({ baseProduct, syncStore, updateProductQuantity }) => (
    <ProductComponent
      key={baseProduct.productId}
      baseProduct={baseProduct}
      syncStore={syncStore}
      updateProductQuantity={updateProductQuantity}
    />
  );
  
  const renderCategory = ({ item, index, syncStore, updateProductQuantity }) => (
    <CategoryComponent
      key={item.categoryId}
      item={item}
      index={index}
      renderProduct={renderProduct}
      syncStore={syncStore}
      updateProductQuantity={updateProductQuantity}
      shoppingStarted={shoppingStarted}
    />
  );

  return (
    <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
      <ExpandableShoppingList
        syncStore={syncShoppingStore}
        addNewItemForm={() => setFormVisible(true)}
      />
      <FinishTransactionForm 
        visible={showFridgeSelector}
        onSubmit={handleFridgeSelect}
        onClose={() => setShowFridgeSelector(false)}
        syncStore={syncFridgeStore}
      />
      <View style={{marginTop: 40, flex: 1}}>
        <CategoryList
          syncStore={syncShoppingStore}
          renderCategory={renderCategory}
          updateProductQuantity={updateShoppingListQuantity}
        />
      </View>
      <NewListForm
        visible={formVisible}
        onSubmit={syncShoppingStore.createStore}
        onClose={() => setFormVisible(false)}
      />
      {!shoppingStarted ? (
        <>
        {currentStoreId != -1 ? (
          <Button mode="outlined" onPress={() => setShoppingStarted(true)}>
          Start Shopping
        </Button>
        ) : (
          <></>
        )}
      </>
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
