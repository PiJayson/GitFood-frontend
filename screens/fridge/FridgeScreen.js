import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/universal/Button";

import { Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { theme } from "../../assets/theme";
import { useRestApi } from "../../providers/RestApiProvider";
import { syncFridgeStore } from "./FridgeStore";
import CategoryComponent from "../../components/fridge/CategoryComponent";
import CategoryList from "../../components/category_list/CategoryList";
import ProductComponent from "../../components/fridge/ProductComponent";
import Background from "../../components/universal/Background";
import ShareForm from "../../components/fridge/ShareForm";
import ExpandableList from "../../components/universal/ExpandableList";
import AddStore from "../../components/universal/AddStore";
import EditFridge from "../../components/fridge/EditFridge";

const windowDimensions = Dimensions.get("window");

const FridgeScreen = ({ navigation }) => {
  const { updateProductQuantity, patchFridgeShare, getFridgeProducts, createFridge, username } = useRestApi();
  const [formVisible, setFormVisible] = useState(false);
  const [shareFormVisible, setShareFormVisible] = useState(false);
  const [editedFridgeId, setEditedFridgeId] = useState(null);
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });

  const currentStoreId = syncFridgeStore.currentStoreId();

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => subscription?.remove();
  }, []);

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
    />
  );

  const handleAddStore = async (fridgeName) => {
    await syncFridgeStore.createStore(fridgeName.name, username, createFridge);
    setFormVisible(false);
  }

  const handleEdit = (fridge) => {
    setEditedFridgeId(fridge.id);
    setShareFormVisible(true);
  }

  return (
    <Background style={{ maxWidth: 800, padding: 0 }}>
      <View style={[{ maxHeight: dimensions.window.height }, styles.background]}>
        <ExpandableList
          items={syncFridgeStore.stores()}
          onAddNew={() => setFormVisible(true)}
          onSelect={(item) => syncFridgeStore.setStore(item, getFridgeProducts)}
          onEdit={handleEdit}
        />
        <View style={{flex: 1}}>
          <CategoryList
            syncStore={syncFridgeStore}
            renderCategory={renderCategory}
            updateProductQuantity={updateProductQuantity}
            onRefresh={async () => { console.log("refresh"); }}
          />
        </View>
        {currentStoreId != -1 ? (
          <Button
            title="Open Scanner"
            mode="outlined"
            onPress={() => navigation.navigate("FridgeScanner")}
          >
           Open Scanner
          </Button>
          ) : (
            <></>
        )}
        <AddStore
          visible={formVisible}
          onSubmit={handleAddStore}
          onClose={() => setFormVisible(false)}
        />
        <EditFridge
          visible={shareFormVisible}
          onClose={() => setShareFormVisible(false)}
          fridgeId={editedFridgeId}
          syncStore={syncFridgeStore}
        />
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

export default FridgeScreen;
