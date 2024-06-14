import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Button from "../../components/universal/Button";
import { theme } from "../../assets/theme";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncShoppingStore } from "./ShoppingStore";
import { syncFridgeStore } from "../fridge/FridgeStore";
import CategoryList from "../../components/category_list/CategoryList";
import CategoryComponent from "../../components/shopping/CategoryComponent";
import ProductComponent from "../../components/shopping/ProductComponent";
import FinishTransactionForm from "../../components/shopping/FinishTransactionForm";
import Background from "../../components/universal/Background";
import ExpandableList from "../../components/universal/ExpandableList";
import AddStore from "../../components/universal/AddStore";
import AddCategoryToShoppingList from "../../components/shopping/AddCategoryToShoppingList";

const windowDimensions = Dimensions.get("window");

const ShoppingScreen = ({ navigation }) => {
  const { updateShoppingListQuantity, patchFridgeAddProducts, getShoppingProducts, createShoppingList, patchAddCategory } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
  const [addProductFormVisible, setAddProductFormVisible] = useState(false);
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
    if (!fridge) {
      setShowFridgeSelector(false)
      return
    }
    
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

  const handleShare = async () => {
    console.log("not supported");
  }

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

  const handleAddStore = async (ShoppingStoreName) => {
    await syncShoppingStore.createStore(ShoppingStoreName.name, createShoppingList);
    setFormVisible(false);
  }

  const handleAddCategory = async (category, quantity) => {
    const newItem = {
      description: category.description,
      categoryName: category.name,
      categoryId: category.id,
      quantity: quantity,
      unit: category.unit,
      products: []
    };

    const existingCategory = elements.find(cat => cat.categoryId === category.id);

    if (existingCategory) {
      await syncShoppingStore.updateCategory(newItem, patchAddCategory);
    }
    else {
      await syncShoppingStore.addCategory(newItem, patchAddCategory);
    }
    setAddProductFormVisible(false);
  }

  return (
    <Background style={{ maxWidth: 800, padding: 0 }}>
      <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
        <ExpandableList
          items={syncShoppingStore.stores()}
          onAddNew={() => setFormVisible(true)}
          onSelect={(item) => syncShoppingStore.setStore(item, getShoppingProducts)}
          onEdit={handleShare}
        />
        {currentStoreId != -1 && (
          <Button
            title="Add Product"
            mode="outlined"
            onPress={() => setAddProductFormVisible(true)}
          >
            Add Product
          </Button>
        )}
        <FinishTransactionForm 
          visible={showFridgeSelector}
          onSubmit={handleFridgeSelect}
          onClose={() => setShowFridgeSelector(false)}
          syncStore={syncFridgeStore}
        />
        <AddCategoryToShoppingList 
          visible={addProductFormVisible}
          onSubmit={handleAddCategory}
          onClose={() => setAddProductFormVisible(false)}
          syncStore={syncFridgeStore}
        />
        <View style={{flex: 1}}>
          <CategoryList
            syncStore={syncShoppingStore}
            renderCategory={renderCategory}
            updateProductQuantity={updateShoppingListQuantity}
          />
        </View>
        <AddStore
          visible={formVisible}
          onSubmit={handleAddStore}
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
    </Background>
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
